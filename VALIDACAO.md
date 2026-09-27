# Validação — módulos 1 e 2

Estado da entrega: **protótipo jogável das aulas 01–12**; as aulas 13–48 continuam planejadas. Arte sujeita a revisão editorial final antes de uso comercial.

- Conteúdo: 12 aulas em italiano, 36 questões comentadas, 12 decisões e 12 laboratórios simulados.
- Arte: 24 pranchas ativas em PNG, duas por aula, seis quadros cada. As oito novas pranchas 09–12 mantêm o traço HQ escuro do módulo anterior e separam narrativa de evidência. As ressalvas das aulas 01–08 estão em `AUDITORIA_PRANCHAS_05-08.md` e no plano geral.
- Visibilidade da arte: as duas pranchas aparecem logo após a história e têm atalho no topo. As imagens ativas usam nomes novos para evitar cache de rascunhos antigos; o módulo 3 foi conferido no portal em 27/09/2026.
- Lógica: comandos em host errado não contam; escolhas erradas e evidência incompleta bloqueiam validação; XP é atribuído uma vez.
- Pedagogia de comandos: todos os comandos das aulas 01–12 têm finalidade, decomposição da sintaxe, opções/argumentos, interpretação da saída e ajuda correspondente. Consultas de ajuda funcionam no simulador sem preencher evidências. `simula-ripristino` está identificado como comando fictício.
- Interface restaurada em 26/09/2026: painel de objetivos ao lado do terminal (abaixo em tela estreita), TAB para completar comandos do nó, `help`/`--help` para listar os comandos disponíveis e feedback persistente sob cada questão, inclusive para erros e após recarga.
- Navegação: acesso local pelo portal 4170, grupos de quatro aulas por módulo, seções renderizadas no navegador e prancha ampliada em diálogo. Os testes verificam a presença dos 24 arquivos; as oito imagens 09–12 responderam HTTP 200 no portal.
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

Revisão de 26/09/2026: `npm.cmd test` passou em 13/13 casos após inclusão do módulo 2. O painel, a ajuda, TAB e o feedback persistente permaneceram cobertos pelos testes; as aulas 05–08 passaram pelo fluxo completo de evidências, escolha, três questões, decisão e diário no simulador. Para conferência de sintaxe foram usadas a [documentação CLI do PBS](https://pbs.proxmox.com/docs/command-syntax.html) e a [documentação do PVE](https://pve.proxmox.com/pve-docs/); para utilitários Linux, as páginas de manual disponíveis no próprio sistema continuam a referência operacional.
