# Ficha dos 12 quadros — aula 12, versões aprovadas

Ticket INF-112. Fonte factual: aula 12 em `data/lessons-module-03.js`, guia em `data/command-guide-module-03.js`. Referência visual: par da aula 08 e diretriz `PADRAO_PRANCHAS.md`. Esta ficha registra as versões corrigidas após a reprovação das imagens anteriores.

Fatos permitidos: `pve02.lab.example` resolve para `10.10.10.12`; route default via `10.10.10.1 dev vmbr0`; `ss -lnt` mostra `0.0.0.0:8006` e `[::]:8006`; política simulada `DROP` com `ALLOW TCP 8006 source 10.10.30.0/24 (utenti)`; fonte autorizada `10.10.10.0/24 (gestione)`. A correção da fonte foi **proposta**, ainda não aplicada. Acesso remoto positivo e negativo ainda não foi testado. É proibido mostrar regra explícita `BLOCK`, abrir para `0.0.0.0/0`, concluir testes ou encerrar ticket.

| Quadro | Ação visual | Função e texto controlado | Estado |
| --- | --- | --- | --- |
| P1-Q1 | Júnior vê falha no navegador | Gestão `10.10.10.0/24` não abre `pve02:8006` | observado |
| P1-Q2 | Sênior organiza quatro símbolos | Nome, route, escuta e firewall são provas distintas | proposto |
| P1-Q3 | Júnior observa caminho na rede | Nome e route locais coerentes não provam acesso remoto | observado |
| P1-Q4 | Sênior inspeciona servidor | TCP 8006 escuta localmente; acesso remoto ainda não provado | observado |
| P1-Q5 | Ambos comparam dois segmentos | Regra permite usuários `10.10.30.0/24`, não gestão | observado |
| P1-Q6 | Sênior desenha plano e caixas vazias | Corrigir fonte e testar ambas as redes | pendente |
| P2-Q1 | Júnior organiza quatro evidências | Saídas literais de `getent hosts` e `ip route` em cartão vetorial | observado |
| P2-Q2 | Sênior consulta pasta de política | Saídas literais de `ss -lnt` e relatório firewall em cartão vetorial | observado |
| P2-Q3 | Sênior limita portão de rede | Abrir 8006 a todas as redes aumenta exposição | hipótese rejeitada |
| P2-Q4 | Júnior redige solicitação | Trocar apenas `10.10.30.0/24` por `10.10.10.0/24`; não aplicada | proposto |
| P2-Q5 | Dois clientes remotos em salas distintas | Acesso de gestão e diniego de usuários | pendente |
| P2-Q6 | Ticket com ampulheta | Mudança e dois testes ainda pendentes; ticket aberto | pendente |

Parecer independente: P1 v3 **APROVADA** para prosseguir; P2 v3 **REPROVADA** por não mostrar evidências; P2 v4 **APROVADA** e par P1 v3/P2 v4 **APROVADO** para ativação. Bases sem texto e legendas/evidências compostas em SVG; PNGs ativos são renderizações determinísticas do SVG.
