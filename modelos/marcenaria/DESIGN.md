# Marcenaria (modelo 9): plano de design

Cliente fictício: Veio Marcenaria, móveis sob medida. Público: casal que está reformando ou comprando apartamento e quer ver o móvel antes de pedir. Trabalho do site: fazer a pessoa montar o móvel dela e pedir orçamento no WhatsApp com a configuração pronta.

## Peça única
Um armário 3D numa tela fixa (um único canvas). Ao rolar: aparece inteiro, abre em peças com a lista de corte ao lado, remonta com as portas abrindo e termina virando configurador (largura, altura, profundidade, madeira, puxador, portas e gavetas). A lista de corte e o orçamento recalculam ao vivo; passar o mouse numa linha da lista acende a peça no 3D. Todo o resto da página fica quieto.

## Cor (tokens no `:root`)
| Nome | Valor | Papel |
|---|---|---|
| gesso | `#E5E7E2` | fundo base, um cinza frio de parede, não creme |
| bancada | `#D3D6CF` | faixas alternadas e campos |
| grafite | `#1F2321` | texto e linhas (grafite esverdeado, não preto puro) |
| fita | `#F2C200` | amarelo de fita métrica, só em blocos chapados e na régua |
| compensado | `#C99A5B` | cor da madeira em desenhos |
| nogueira | `#3D2A1F` | seções escuras (marrom de madeira, não preto) |

Texto secundário `#565B57` sobre gesso (5,3:1). Amarelo nunca vira cor de texto sobre gesso; sobre grafite e nogueira passa de 7:1.

## Tipografia
- Bricolage Grotesque (eixos de largura e peso): títulos em largura 75 a 85, peso 800, frase normal.
- Jost: texto, números e rótulos. Linhas de até 70 caracteres.
- Proibido: rótulo em caixa alta acima de título, uma palavra do título em cor ou itálico, seta em botão, metadados separados por ponto médio.

## Layout
Alinhado à esquerda, assimétrico. Hero com o texto à esquerda e, à direita, o plano de corte de uma chapa 2750 x 1850 mm gerado por código (as mesmas peças do armário padrão). Seção do armário em duas colunas: canvas fixo e passos que rolam. Materiais em grade de amostras com veio gerado por código. Ambientes em abas. Perguntas em `<details>`.

## Movimento
- Um momento orquestrado: o armário abrindo com a rolagem.
- Régua de fita métrica fixa na lateral como indicador de rolagem (só `transform`).
- Resto: estados de foco, abertura de gaveta e porta em resposta a clique. Nada de entrada com fade em cada seção.
- `prefers-reduced-motion`: armário montado e parado, sem régua animada, configurador funcionando.

## Princípios
1. Tudo tem medida: cotas, milímetros e lista de corte são tipografia, não enfeite.
2. Material honesto: veio gerado por código, sem foto de banco.
3. Uma coisa memorável, o resto disciplinado.

## Revisão contra os padrões de IA
Troquei creme e terracota por gesso frio e fita amarela; evitei preto com acento neon (o fundo é claro ou nogueira); sem cartões idênticos com sombra (as amostras e abas têm hierarquia própria); sem numeração decorativa (só o processo, que é uma sequência).
