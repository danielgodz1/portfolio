# Engenharia civil (modelo 10): plano de design

Cliente fictício: Cota Zero Engenharia (cota zero é o nível de referência de uma obra). Público: construtoras pequenas, incorporadores e donos de terreno que precisam entender o que vão gastar e quanto tempo leva antes de contratar. Trabalho do site: transformar "quanto custa e quanto demora um prédio" em algo que a pessoa mexe e vê, e levar o pedido ao WhatsApp com os números do que ela montou.

## Peça única: a obra virtual
Um prédio de concreto armado em 3D numa tela fixa (um único canvas). Ao rolar ele sobe andar por andar: fundação, estrutura, instalações, vedação e entrega. No fim é um visualizador: número de andares, largura e profundidade da planta, camadas (estrutura, hidráulica, elétrica, fachada) e corte por andar. O quantitativo (concreto, aço, fôrmas), o prazo e o cronograma recalculam juntos. A lista de pavimentos acende o andar no 3D.

## Cor (tokens no `:root`)
| Nome | Valor | Papel |
|---|---|---|
| giz | `#F3F4F0` | fundo base, um branco frio de parede de obra |
| cimento | `#C4C8C2` | faixas, linhas e campos |
| aço | `#5E6B70` | texto secundário (5,0:1 sobre o giz) |
| chumbo | `#222826` | texto e linhas |
| verde-obra | `#0F3B30` | seções escuras (verde de tapume, não preto) |
| sinal | `#FF6A1A` | laranja de sinalização, só em blocos chapados e marcadores |
| sinal-claro | `#FF8A45` | laranja para texto sobre verde-obra (5,3:1) |
| água | `#2F7F9E` | só a camada hidráulica no 3D |

Sem azul de planta (a raiz do portfólio já é azul), sem creme com terracota, sem preto com acento neon.

## Tipografia
- Archivo em largura expandida (eixo `wdth` 112 a 125), peso 800: títulos largos, como letra de placa de obra.
- Work Sans: texto, números e tabelas. Números sempre `tabular-nums`.
- Proibido: rótulo em caixa alta acima de título, uma palavra do título em cor, seta em botão, metadados com ponto médio.

## Layout
Alinhado à esquerda. Hero com título largo e o vídeo da obra subindo logo abaixo, preso à rolagem. A obra virtual em duas colunas (canvas fixo, controles e tabelas à direita). Obras em grade assimétrica: uma foto grande, três menores, dados no próprio quadro. Cronograma como gráfico de barras de verdade (Gantt), que recalcula com o prédio. Pedido de orçamento em 3 passos que termina no WhatsApp.

## Movimento
- Um momento orquestrado: o prédio subindo com a rolagem.
- Barras do cronograma crescem uma vez ao entrar na tela (só `transform`).
- Resto: estados de foco e resposta a clique. Nada de fade em cada seção.
- `prefers-reduced-motion`: prédio pronto e parado, barras no tamanho final, controles funcionando.

## Princípios
1. Todo número é de verdade: o que aparece vem da mesma conta (concreto, aço, prazo, cronograma).
2. A pessoa mexe, não lê.
3. Uma coisa memorável, o resto disciplinado.

## Revisão contra os padrões de IA
Paleta específica da obra (giz, cimento, verde de tapume, laranja de sinalização) em vez de creme e terracota ou preto e neon; título expandido em vez da serifa de contraste; Gantt e quantitativo no lugar de "cartões com número grande e rótulo"; sem numeração decorativa.

## Fórmulas (todas de exemplo)
Concreto = área x (0,21 + 0,004 x andares) m³ por m². Aço = 100 + 2 x andares kg por m³ de concreto. Fôrmas = 2,4 m² por m² construído. Prazo em meses: fundações 2, estrutura 0,4 por andar, instalações e vedação 1 + 0,3 por andar, acabamento 2 + 0,25 por andar. Custo de referência = área x R$ 3.800 por m². Ajustar à realidade do cliente em `quantitativo.mjs`.
