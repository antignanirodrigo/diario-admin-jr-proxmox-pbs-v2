# Validação — aulas 01–21

Estado da entrega: **protótipo jogável das aulas 01–21**; as aulas 22–24 estão em produção e 25–48 permanecem planejadas. Arte das anteriores sujeita a revisão editorial própria antes de uso comercial.

- Conteúdo: 21 aulas em italiano, 63 questões comentadas, 21 decisões e 21 laboratórios simulados.
- Arte: 42 pranchas ativas em PNG, duas por aula, seis quadros cada. Os pares das aulas 13–20 foram aprovados pelo revisor independente após correções registradas nas respectivas auditorias. As aulas 14–20 têm personagens segundo as referências da aula 01 e balões quando há falas. As ressalvas das aulas 01–08 estão em `AUDITORIA_PRANCHAS_05-08.md` e no plano geral.
- Visibilidade da arte: as duas pranchas aparecem logo após a história e têm atalho no topo. As imagens ativas usam nomes novos para evitar cache de rascunhos antigos; o módulo 3 foi conferido no portal em 27/09/2026.
- Lógica: comandos em host errado não contam; escolhas erradas e evidência incompleta bloqueiam validação; XP é atribuído uma vez.
- Pedagogia de comandos: todos os comandos das aulas 01–21 têm finalidade, decomposição da sintaxe, opções/argumentos, interpretação da saída e ajuda correspondente. Consultas de ajuda funcionam no simulador sem preencher evidências. `simula-ripristino` está identificado como comando fictício.
- Interface restaurada em 26/09/2026: painel de objetivos ao lado do terminal (abaixo em tela estreita), TAB para completar comandos do nó, `help`/`--help` para listar os comandos disponíveis e feedback persistente sob cada questão, inclusive para erros e após recarga.
- Navegação: acesso local pelo portal 4170, grupos de quatro aulas por módulo, seções renderizadas no navegador e prancha ampliada em diálogo. Os testes verificam as 42 pranchas ativas; páginas 18–20 e os dois PNGs da aula 20 responderam HTTP 200 no portal após a ativação.
- Fontes: comandos e conceitos iniciais conferidos na documentação oficial do PVE/PBS vigente em setembro de 2026. Versões devem ser reconferidas em lotes futuros.

Comandos de verificação:

```powershell
npm.cmd test
node --check data/lessons.js
node --check data/command-guide.js
node --check js/simulator.js
node --check js/app.js
```

Limite pedagógico: os comandos e a prova de recuperação da aula 04 são simulações. Elas ensinam raciocínio e sequência de validação; não certificam um ambiente Proxmox real.

Revisão visual de 27/09/2026: a primeira prancha da aula 08 destoava das aulas 05–07 por traço mais caricato, cenário claro e balões maiores. A nova `aula-08-hq-v2.png` usa o mesmo datacenter escuro, personagens adultos e legendas brancas; evita repetir as poses da aula 07. A imagem respondeu HTTP 200 no portal e `npm.cmd test` passou em 13/13 casos. Segue pendente a revisão editorial de textos pequenos antes de uso comercial.

Complemento de 27/09/2026: a prancha 2 ainda destoava do novo par. Foi substituída por `aula-08-p2-hq-v4.png`, com terminal e cenas no mesmo traço escuro. Os números de pacotes inventados em uma candidata foram corrigidos para os dados do laboratório simulado. A atualização continua adiada; backup, aviso e revisão do repositório continuam pendentes.

Lote 09–12 em 27/09/2026: `npm.cmd test` passou em 17/17 casos, incluindo o fluxo completo de evidências, escolha, questões, decisão e diário das quatro novas aulas. Sintaxe dos módulos de aulas e guias aprovada por `node --check`. As oito imagens responderam HTTP 200 no portal 4170. Auditoria visual e ressalvas em `AUDITORIA_PRANCHAS_09-12.md`.

Padrão de produção definido em 27/09/2026: `PADRAO_PRANCHAS.md` exige ficha de 12 quadros, referências visuais compartilhadas entre as duas pranchas e conferência textual/estado antes de publicação. A suíte passou em 18/18 após incluir verificação automática de dimensão 1536 × 1024 e ausência de PNGs ativos idênticos no módulo 3. Essa automação não detecta poses repetidas nem erros de texto dentro da imagem; esses itens permanecem revisão humana obrigatória.

Correção da aula 12 em 27/09/2026: o revisor independente Level 99 aprovou P1 v3, reprovou P2 v3 por falta de evidências e aprovou P2 v4 e o par final. As imagens ativas são `aula-12-p1-v3.png` e `aula-12-p2-v4.png`, compostas de arte base sem texto e legendas/evidências vetoriais. Ambas responderam HTTP 200 no portal 4170; `node --check data/lessons-module-03.js` passou e `npm.cmd test` passou em 18/18. A revisão editorial cobre esse par, não a totalidade dos protótipos existentes.

Revisão de 26/09/2026: `npm.cmd test` passou em 13/13 casos após inclusão do módulo 2. O painel, a ajuda, TAB e o feedback persistente permaneceram cobertos pelos testes; as aulas 05–08 passaram pelo fluxo completo de evidências, escolha, três questões, decisão e diário no simulador. Para conferência de sintaxe foram usadas a [documentação CLI do PBS](https://pbs.proxmox.com/docs/command-syntax.html) e a [documentação do PVE](https://pve.proxmox.com/pve-docs/); para utilitários Linux, as páginas de manual disponíveis no próprio sistema continuam a referência operacional.

29/09/2026 — Aula 13: pareceres independentes em `AUDITORIA_PRANCHAS_13.md`; `pvesm status` mantido idêntico ao da aula 07 para o mesmo nó pve02; duas pranchas aprovadas com arte base sem texto e composição vetorial. A verificação final do portal e da suíte consta no handoff do projeto.

30/09/2026 — Aula 15: revisão técnica independente e portões visuais P1/P2/par aprovados em `AUDITORIA_PRANCHAS_15.md`. `npm.cmd test` passou 23/23, inclusive leituras de RAM do host com a VM rodando, parada e reiniciada, e `vmstat` antes/depois. Página e dois PNGs HTTP 200. Capacidade de memória confirmada na simulação; redução da latência sob a importação ainda pendente.

30/09/2026 — Aula 16: revisão técnica independente e portões P1/P2/par aprovados em `AUDITORIA_PRANCHAS_16.md`. `npm.cmd test` passou 25/25, inclusive limpeza de machine-id, shutdown antes do template, clone completo isolado, snapshot local e ajuda dos comandos. Página e os dois PNGs HTTP 200. Identidade pós-clone, backup externo e restauração continuam pendentes.

01/10/2026 — A auditoria cruzada revogou a aprovação comercial das artes de 15–16 datadas de 30/09 por repetição de encenação entre aulas. Novos pares ativos: 15 P1 v4/P2 v3 e 16 P1 v6/P2 v5. Cada prancha e cada par passaram por correção e aprovação independente, com comparação visual das aulas vizinhas e conferência dos estados técnicos. `npm.cmd test` 25/25; página e quatro novos PNGs HTTP 200 no portal 4170. Isso valida os pares corrigidos, não a prontidão comercial de todas as 32 pranchas.

01/10/2026 — Aula 17: conteúdo técnico aprovado após corrigir saídas simuladas de `pct list`/`pveam list local` para tabelas vazias sem prosa artificial. Revisor Level 99 reprovou P1 v1/v2 e P2 v1/v2/v3 por reencenação de quadros e deriva do Sênior; aprovou P1 v3, P2 v4 e o par após correções documentadas em `AUDITORIA_PRANCHAS_17.md`. `npm.cmd test` 26/26; página e dois PNGs HTTP 200 no portal 4170. A aula classifica A/Windows e C/Docker em VM e B/Linux apenas como candidato a LXC não privilegiado; não cria sistemas. Restam 31 aulas planejadas e auditoria editorial integral das antigas antes de venda.

01/10/2026 — Aulas 18–20: módulo LXC completo. A aula 18 separa armazenamento do template e rootfs, confere 1G livre em `local` e limita a prova HTTP ao host; a aula 19 verifica mapping efetivo de UID/GID e acesso dirigido a bind mount ro sem permissões globais; a aula 20 apenas simula o plano de patch e adia a mudança por falta de cópia independente do bind, restore testado e janela aprovada. Revisores independentes aprovaram os conteúdos e cada prancha/par após as correções em `AUDITORIA_PRANCHAS_18.md`, `AUDITORIA_PRANCHAS_19.md` e `AUDITORIA_PRANCHAS_20.md`. `npm.cmd test` passou 29/29, cobrindo 20 aulas, 40 PNGs distintos e fluxos completos; páginas 18–20 e PNGs ativos da aula 20 HTTP 200. Restam 28 aulas planejadas; auditoria comercial integral das anteriores continua pendente.

02/10/2026 — Revisão de balões e diálogo nas aulas 16–20: pares ativos 16 v8/v7, 17 v7/v8, 18 v5/v7, 19 v4/v7 e 20 v5/v3. A comparação encontrou redução real de falas (17–20 tinham 2–4 por par) e montagem artificial elipse+triângulo. As novas pranchas usam balões de contorno orgânico e texto SVG; têm, respectivamente, 7, 9, 7, 8 e 8 falas por par. O revisor independente reprovou versões por quadros reencenados e texto cortado antes de aprovar individualmente as pranchas e cada par. `npm.cmd test` passou 29/29; páginas 16–20 e os dez PNGs ativos responderam HTTP 200 no portal 4170. A revisão é editorial no cenário simulado, sem homologação comercial integral das aulas 01–15.

