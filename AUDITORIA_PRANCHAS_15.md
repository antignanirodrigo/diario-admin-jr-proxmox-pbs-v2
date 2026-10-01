# Auditoria Level 99 — aula 15

**Data:** 30/09/2026. **Curso:** Proxmox VE + PBS v2. **Par ativo naquela data:** `assets/aula-15-p1-v3.png` e `assets/aula-15-p2-v2.png`, 1536 × 1024, seis quadros 3 × 2 cada.

O conteúdo foi reprovado inicialmente por incoerência entre estados de RAM, `uptime`, `vmstat` e configurações. Após correção, o revisor aprovou as leituras do host com a VM rodando/parada/reiniciada, a amostra `vmstat` pós-reinício apenas em repouso e a sequência de alteração. O laboratório explicita que 4096 MiB configurados e reconhecidos não demonstram melhora da importação.

A P1 v2 foi reprovada porque dois balões desenhados sugeriam variação dinâmica, embora `memory` e `balloon` fossem iguais. A P1 v3 substituiu o trecho por duas barras idênticas de 2048 MiB e foi aprovada. A P2 v2 foi aprovada: evidências, parada ordenada, ajuste único de RAM, reinício e pendência de desempenho aparecem em quadros distintos. O revisor aprovou também o par, comparando personagens, paleta, balões, números, sequência e ausência de quadros repetidos.

**Conferências técnicas:** 22 vCPU/16 threads indica overcommit de atribuição, não saturação; host 28 GiB available antes, 30 GiB parado e 26 GiB após reinício; guest 120 MiB available e 1250 MiB swap antes; `/` 50%; `local-lvm` 560G available; `memory=balloon=4096` após intervenção simulada, sem alterar vCPU/disco. A medição da latência sob a mesma importação permanece pendente.

**Verificação:** `npm.cmd test` 23/23; página e os dois PNGs HTTP 200 no portal 4170. A arte resume comandos e saídas; a execução literal e as explicações de opções/ajuda ficam no laboratório interativo. Ainda é necessária revisão editorial do conjunto anterior antes de apresentar o curso inteiro como versão comercial.

## Reabertura editorial por repetição — 01/10/2026

A aprovação de 30/09 do par P1 v3/P2 v2 foi revogada para uso comercial após comparação com as aulas 14 e 16: Junior de mão no queixo diante de monitor, Sênior apontando tela e dupla diante de checklist repetiam câmera e função narrativa de outras pranchas. Não era cópia pixel a pixel, mas havia reciclagem de encenação. O par foi redesenhado com perspectivas, ações e evidências diferentes.

**Novo par ativo:** P1 `aula-15-p1-v4.png` (`aula-15-p1-v4.svg`, base v3) e P2 `aula-15-p2-v3.png` (`aula-15-p2-v3.svg`, base v3). A primeira base P1 foi reprovada por módulos físicos de CPU/RAM/disco que sugeriam troca de hardware e por balões sobre rostos; as métricas passaram a dashboards virtuais, os balões foram reposicionados e quadros sem falante receberam cartões de dados/nota técnica. O revisor independente aprovou a P1 corrigida. A primeira P2 foi reprovada porque o quadro final mostrava seta de VM para armazenamento e barra de progresso, sugerindo cópia ou importação não executada; também se pediu clareza no shutdown. A base corrigida mostra VM cinza com ícone de desligamento virtual e, no final, RAM reconhecida com relógio e interrogação para a latência ainda pendente. O revisor aprovou P2 e o par, comparando novamente as aulas 14–16. Os SVGs mantêm balões e texto italiano determinísticos; as telas esquemáticas não substituem as saídas literais do laboratório.
