# Padrão obrigatório das pranchas — Proxmox VE + PBS v2

Este documento vale para todas as próximas aulas deste curso. O par ativo da aula 08 (`aula-08-hq-v2.png` e `aula-08-p2-hq-v4.png`) é a referência visual; as aulas 09–12 mostram a estrutura pedagógica. A fonte dos fatos técnicos é a aula em `data/`, conferida na documentação oficial de Proxmox VE/PBS. O texto desenhado por IA nunca é fonte técnica.

## 1. Antes de gerar imagem

Para cada aula, preencher uma ficha de **12 quadros** (seis por prancha). Cada quadro precisa declarar: ação visual, função didática, texto visível permitido, valores exatos retirados do laboratório e estado da ação (`observado`, `proposto`, `pendente` ou `executado`). Escrever também o que **não** pode aparecer: versões, datas, IPs, resultados, comandos ou conclusões sem base na aula. Nenhum quadro começa sem essa ficha.

| Prancha | Função | Regra de sequência |
| --- | --- | --- |
| 1 | Incidente e conceito | Mostra o problema, o caminho técnico e a hipótese; termina na decisão a investigar. |
| 2 | Evidência e consequência | Usa comandos/saídas do laboratório, compara hipóteses, registra a decisão e indica o teste que falta. Não reencena os mesmos quadros da prancha 1. |

Se o laboratório apenas **planeja** uma mudança, a arte não pode exibir correção aplicada, backup concluído, teste aprovado ou ticket fechado. O sexto quadro pode mostrar uma pendência honesta em vez de um sucesso fictício.

## 2. Bíblia visual fixa

- Duas pranchas por aula, seis quadros cada, grade 3 × 2; **alvo para novos lotes: 1536 × 1024**. Mesmas bordas e caixas brancas retangulares de legenda no topo. O par legado da aula 01 tem outra dimensão e não deve ser usado como molde de tamanho.
- HQ técnica adulta em tinta de graphic novel, datacenter azul escuro, racks corporativos, luz ciano, telas escuras. Evitar alternar para fotografia, cartoon infantil, fundo branco dominante ou acabamento de outra série.
- **Referência canônica dos personagens:** `assets/aula-01.png` e `assets/aula-01-p2-hq-v3.png`. Comparar rosto, cabelo e idade aparente com essas imagens antes de aprovar cada nova base. Júnior: adulto 26–28 anos, cabelo castanho escuro ondulado e desalinhado (não cachos muito volumosos), rosto estreito, barba leve, moletom grafite e crachá de TI. Sênior: 42–45 anos, cabelo curto escuro-grisalho penteado para trás (não cachos brancos longos), barba escura-grisalha, óculos retangulares pretos e blazer escuro.
- Pranchas com personagens devem conter **balões ovais de fala**, com cauda apontando para quem fala e diálogo natural em italiano. As legendas e os cartões técnicos podem complementar a cena, mas não substituem as falas. Compor o texto dos balões deterministicamente em SVG/HTML e verificar que nenhum cobre rosto ou evidência essencial.
- Variar ação, enquadramento e gesto. Não repetir a pose de abertura da prancha 1 na prancha 2, nem reaproveitar um quadro de aula anterior. Diagramas e terminais podem voltar como assunto, mas devem trazer evidência nova.
- Antes do parecer final, comparar os 12 quadros com pelo menos os três pares de aulas anteriores. Reprovar também a repetição de encenação sem cópia literal: mesmo gesto, mesma câmera e mesma função narrativa com textos trocados. Registrar quais quadros foram comparados e o que mudou de fato.
- Italiano para legendas, diálogo e interface voltada ao aluno. Comandos, caminhos, endereços e nomes técnicos mantêm a grafia exata da simulação.

## 3. Texto técnico sem alucinação

O caminho preferido para as próximas pranchas é **arte base sem texto técnico**, seguida de legendas, terminais, tabelas, selos e balões compostos de forma determinística em SVG/HTML a partir da ficha. Texto gerado dentro de bitmap é aceito apenas como rascunho e precisa ser conferido caractere por caractere antes da ativação. Não copiar saídas de uma captura ilustrativa: usar a saída de `lesson.lab.commands`.

Antes de publicar, conferir explicitamente: VMID, hostname, FQDN, IP/máscara, gateway, VLAN, porta, versão, comando/opções, nome da interface, estado de checkbox, data e status da ação. Qualquer item inventado ou contraditório reprova a prancha, mesmo que o desenho esteja bonito.

## 4. Portão por prancha e publicação por par

Depois de **cada** prancha concluída, aplicar `REVISOR_LEVEL99.md`: agente independente inspeciona a arte e a aula e emite `APROVADA` ou `REPROVADA`. Só iniciar a próxima prancha após `APROVADA`; toda correção exige novo parecer. A aprovação individual não dispensa a conferência conjunta do par.

1. Conferir a ficha de 12 quadros contra a aula, o guia de comandos e a documentação oficial aplicável.
2. Gerar a primeira prancha com as referências visuais e a ficha aprovada. Submetê-la ao revisor; só gerar a segunda após aprovação. Usar as mesmas referências para a segunda; não usar uma prancha antiga de outra aula como única referência do par.
3. Inspecionar as duas pranchas lado a lado, ampliadas: personagens, paleta, traço, seis quadros, legibilidade, repetição de poses/cenas e progressão incidente → evidência.
4. Conferir cada texto e cada estado com o laboratório. Rejeitar resultados inventados; não corrigir uma contradição adicionando outra.
5. Só então copiar para `assets/` com nome versionado, atualizar as duas referências em `data/`, abrir no portal e confirmar as duas imagens carregadas.
6. Executar os testes do curso e registrar em `AUDITORIA_PRANCHAS_XX-YY.md` o que foi aprovado, rejeitado e o que ainda limita o uso comercial.

**Regra de parada:** não ativar apenas uma prancha do par se a outra ainda estiver em linguagem visual diferente. Não declarar arte comercialmente pronta enquanto textos pequenos e interfaces geradas não tiverem revisão determinística.

## Ficha de 12 quadros — copiar para cada novo lote

```text
Aula / ticket / objetivo:
Referência visual exata:
Fatos permitidos (extraídos de lesson.lab.commands):
Estados finais permitidos (observado / proposto / pendente / executado):
Fatos proibidos ou ainda não comprovados:

P1-Q1: ação | função | texto | valores | estado
P1-Q2: ação | função | texto | valores | estado
P1-Q3: ação | função | texto | valores | estado
P1-Q4: ação | função | texto | valores | estado
P1-Q5: ação | função | texto | valores | estado
P1-Q6: ação | função | texto | valores | estado
P2-Q1: ação diferente de P1-Q1 | função | texto | valores | estado
P2-Q2: ação | função | texto | valores | estado
P2-Q3: ação | função | texto | valores | estado
P2-Q4: ação | função | texto | valores | estado
P2-Q5: ação | função | texto | valores | estado
P2-Q6: ação | função | texto | valores | estado

Revisão do par: seis quadros cada? personagens iguais? cenas novas?
Revisão técnica: cada valor e estado bate com a aula?
Resultado: APROVAR / REPROVAR, motivo e arquivo ativo.
```
