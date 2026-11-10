-- Agenda dos estúdios no Supabase (Postgres).
-- AINDA NÃO APLICADO: hoje o site e o painel rodam em modo demonstração (modelos/agenda.js guarda no navegador).
-- Para ligar: crie um projeto no Supabase, rode este arquivo no SQL Editor e troque o modo em agenda.js.
-- Um projeto só atende vários estúdios (cada linha tem estudio_id), o que divide o custo e evita a pausa
-- por inatividade do plano gratuito.

create extension if not exists btree_gist;

-- Estúdios (clientes do Daniel). dona_id = usuário do Supabase Auth que administra o estúdio.
create table estudios (
  id          text primary key,                 -- ex.: 'beleza' (o mesmo slug do site)
  nome        text not null,
  dona_id     uuid references auth.users (id),
  horas       text[] not null default '{09:00,10:30,13:00,14:30,16:00,17:30}',
  dias_semana int[]  not null default '{2,3,4,5,6}', -- 0 = domingo
  sinal       numeric(4,2) not null default 0.30,
  criado_em   timestamptz not null default now()
);

-- Reservas feitas pelo site.
create table reservas (
  id          uuid primary key default gen_random_uuid(),
  estudio_id  text not null references estudios (id) on delete cascade,
  dia         date not null,
  hora        text not null,
  cliente     text not null check (length(cliente) between 2 and 80),
  fone        text not null check (fone ~ '^[0-9]{10,13}$'),
  obs         text not null default '' check (length(obs) <= 500),
  servicos    jsonb not null,                   -- [{id, nome, preco}]
  total       numeric(10,2) not null check (total > 0),
  pagamento   text not null check (pagamento in ('pix', 'estudio')),
  pago        boolean not null default false,
  status      text not null default 'pendente'
              check (status in ('pendente', 'confirmada', 'concluida', 'cancelada', 'expirada')),
  expira_em   timestamptz,                      -- prazo do Pix (15 min)
  mp_pagamento_id text,                         -- id do pagamento no Mercado Pago
  criada_em   timestamptz not null default now()
);

-- Regra principal: dois pedidos ativos nunca ocupam o mesmo horário do mesmo estúdio.
-- É o banco que garante isso, mesmo se duas clientes clicarem ao mesmo tempo.
create unique index reservas_um_por_horario
  on reservas (estudio_id, dia, hora)
  where status in ('pendente', 'confirmada', 'concluida');

-- Bloqueios da dona (hora nula = dia inteiro).
create table bloqueios (
  id          uuid primary key default gen_random_uuid(),
  estudio_id  text not null references estudios (id) on delete cascade,
  dia         date not null,
  hora        text,
  motivo      text not null default '',
  unique nulls not distinct (estudio_id, dia, hora)
);

-- ---------- segurança (RLS) ----------
alter table estudios  enable row level security;
alter table reservas  enable row level security;
alter table bloqueios enable row level security;

-- A dona vê e mexe só no próprio estúdio.
create policy dona_estudio   on estudios  for all using (dona_id = auth.uid());
create policy dona_reservas  on reservas  for all using (exists (select 1 from estudios e where e.id = estudio_id and e.dona_id = auth.uid()));
create policy dona_bloqueios on bloqueios for all using (exists (select 1 from estudios e where e.id = estudio_id and e.dona_id = auth.uid()));
-- O público (site) não lê nenhuma tabela direto: usa as duas funções abaixo, que não expõem dados de clientes.

-- Horários ocupados de um dia (só as horas, sem nomes nem telefones).
create or replace function horarios_ocupados(p_estudio text, p_dia date)
returns setof text language sql security definer set search_path = public as $$
  select hora from reservas
   where estudio_id = p_estudio and dia = p_dia
     and (status in ('confirmada', 'concluida') or (status = 'pendente' and (expira_em is null or expira_em > now())))
  union
  select h from bloqueios b, estudios e, unnest(e.horas) h
   where b.estudio_id = p_estudio and e.id = p_estudio and b.dia = p_dia and (b.hora is null or b.hora = h);
$$;

-- Cria a reserva pelo site. Pix fica pendente por 15 minutos; o webhook do Mercado Pago confirma.
create or replace function reservar(p_estudio text, p_dia date, p_hora text, p_cliente text, p_fone text,
                                    p_obs text, p_servicos jsonb, p_pagamento text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id uuid; v_total numeric;
begin
  -- libera Pix vencido antes de testar o horário
  update reservas set status = 'expirada'
   where estudio_id = p_estudio and status = 'pendente' and expira_em < now();
  if p_hora in (select horarios_ocupados(p_estudio, p_dia)) then
    raise exception 'ocupado' using errcode = 'P0001';
  end if;
  -- preço vem da lista enviada; na versão real, confira contra uma tabela de serviços do estúdio
  select sum((s->>'preco')::numeric) into v_total from jsonb_array_elements(p_servicos) s;
  insert into reservas (estudio_id, dia, hora, cliente, fone, obs, servicos, total, pagamento, expira_em)
  values (p_estudio, p_dia, p_hora, p_cliente, p_fone, coalesce(p_obs, ''), p_servicos, v_total, p_pagamento,
          case when p_pagamento = 'pix' then now() + interval '15 minutes' end)
  returning id into v_id;
  return v_id;
exception when unique_violation then
  raise exception 'ocupado' using errcode = 'P0001';
end $$;

grant execute on function horarios_ocupados(text, date) to anon, authenticated;
grant execute on function reservar(text, date, text, text, text, text, jsonb, text) to anon, authenticated;

-- Confirmação do Pix: uma Edge Function recebe o aviso do Mercado Pago (webhook), consulta o pagamento
-- na API deles e, se aprovado, roda com a chave de serviço:
--   update reservas set status = 'confirmada', pago = true, expira_em = null where id = :id and status = 'pendente';
