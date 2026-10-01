# Auditoria independente — aula 13

Data: 29/09/2026. Ticket INF-113, VM 210. Fontes: `data/lessons-module-04.js`, `data/command-guide-module-04.js`, `FICHA_PRANCHAS_AULA_13.md` e padrão do curso. Ambas as pranchas usam bases sem texto com legendas/evidências vetoriais renderizadas em PNG 1536 × 1024.

| Etapa | Parecer independente | Motivo e resolução |
| --- | --- | --- |
| P1 v1 | REPROVADA | Q3 mostrava ISO como disco físico; Q5 tinha holograma incompatível com datacenter técnico. |
| P1 v2 | APROVADA | Inventário ISO é arquivo digital; diagrama fica em monitor plano. Seis quadros legíveis, estados corretos. |
| P2 v1 | REPROVADA | Cartões de terminal cobriam rostos em Q2/Q3. |
| P2 v2 | APROVADA visualmente | Cartões reposicionados e evidências legíveis; par liberado inicialmente. |
| Conteúdo da aula | REPROVADO na primeira revisão | `pvesm status` omitia capacidade e contradizia a saída da aula 07 no mesmo pve02. |
| Conteúdo corrigido + P2 v3 | APROVADOS | `pvesm status` agora reproduz os valores da aula 07; `local` continua quase cheio. Q3 exibe as colunas e explica o risco sem afirmar boot. |

**Par ativo aprovado:** `assets/aula-13-p1-v2.png` + `assets/aula-13-p2-v3.png`. P1 apresenta incidente/conceito; P2 traz requisitos, inventário, `qm config 210`, `pvesm status`, proposta mínima e verificações futuras. Nenhuma mudança na VM, boot ou teste de rede foi simulada como concluída. A aprovação do revisor abrange arte e conteúdo desta aula; as outras aulas preservam seus próprios estados de auditoria.
