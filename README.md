> **Jogar online:** https://antignanirodrigo.github.io/diario-admin-jr-proxmox-pbs-v2/  
> Parte da coleção [Diário de um Admin Jr.](https://antignanirodrigo.github.io/diario-admin-jr/)

# Diario di un Admin Jr. — Proxmox VE + PBS (nuova edizione)

Protótipo interativo **em italiano** dos quatro primeiros módulos e da primeira aula do módulo LXC. As aulas 01–17 estão jogáveis; o plano curricular completo prevê 48 aulas. O curso anterior `CURSO_PROXMOX_INTERATIVO` permanece independente na porta 4175.

## Abrir

Com o servidor unificado do projeto ativo, acesse:

**[Abrir o protótipo local](http://127.0.0.1:4170/CURSO_PROXMOX_VE_PBS_V2/)**

Na rede local da máquina hospedeira: `http://192.168.1.151:4170/CURSO_PROXMOX_VE_PBS_V2/`, desde que o endereço e o acesso à porta 4170 continuem válidos.

Também é possível servir apenas esta pasta com `python -m http.server 4177 --bind 127.0.0.1` e abrir `http://127.0.0.1:4177/`. Não abra `index.html` diretamente por `file://`, pois a aplicação usa módulos JavaScript.

## Aulas disponíveis

| Aula | Tema | Laboratório |
| --- | --- | --- |
| 01 | Papéis de PVE e PBS | Inspecionar os dois nós e escolher arquitetura separada |
| 02 | Hardware e capacidade | Auditar CPU, RAM e discos; aprovar host B |
| 03 | Topologia e isolamento | Inspecionar interfaces, rotas e portas; separar três redes |
| 04 | RPO e RTO | Comparar metas de negócio com uma recuperação simulada |
| 05 | Preparação do host | Conferir firmware, discos, checksum da ISO e relógio antes de instalar |
| 06 | Primeira instalação | Escolher FQDN e rede de gestão; verificar nome, IP, rota e HTTPS |
| 07 | GUI, terminal e tarefas | Investigar backup falho por UPID, log e espaço do storage |
| 08 | Repositórios e manutenção | Revisar fontes e pacotes; exigir backup, aviso e janela aprovada |
| 09 | Linux bridge e primeira VM | Diagnosticar net0 na vmbr9 sem uplink; planejar vmbr0 |
| 10 | Gestão, gateway e bond | Entender failover active-backup e a dependência do switch |
| 11 | VLAN e bridge VLAN-aware | Localizar tag 20 errado na VM 202; preservar VLAN 30 server |
| 12 | Firewall e conectividade | Corrigir a fonte permitida na porta 8006 e testar allow/deny |
| 13 | Criar uma VM com escolhas conscientes | Confrontar perfil UEFI, ISO, firmware, recursos e bridge antes do boot |
| 14 | Disco VirtIO e Guest Agent | Diagnosticar agente inativo, aplicar correção simulada e separar IP observado de conectividade testada |
| 15 | Capacidade: vCPU, memória e espaço | Medir CPU, RAM, swap e disco; ajustar só a RAM e manter a prova de latência pendente |
| 16 | Template, clone, snapshot e backup | Preparar a base, clonar em rede isolada e separar snapshot local de recuperação externa |
| 17 | Escolher entre VM e LXC | Classificar três serviços, consultar o inventário LXC e documentar testes pendentes sem criar instâncias |

Cada aula possui dez seções pedagógicas, três questões comentadas, uma decisão técnica, diário de bordo, laboratório simulado com bloqueio de validação prematura e duas pranchas italianas de seis quadros. O progresso e XP ficam no armazenamento local do navegador. **Os comandos do laboratório são simulações educativas; nenhuma configuração real é alterada.**

O laboratório agora mostra, para cada comando, sua finalidade, a função dos argumentos e opções, a leitura da saída e a forma correta de consultar ajuda. O botão **Prova l’aiuto** preenche o terminal; a ajuda pode ser executada sem contar como evidência. `simula-ripristino` é um comando inventado apenas para a aula 04.

Ao lado do terminal, **Obiettivi verificabili** mostra quais comandos já foram executados. Clique em um item para preencher o terminal, use **TAB** para completar um comando digitado ou execute `help`/`--help` para ver os comandos do nó. As explicações das questões permanecem abaixo da pergunta e são preservadas ao recarregar a página. Em telas pequenas, o painel de objetivos aparece abaixo do terminal.

As 34 pranchas ativas estão em `assets/`, duas por aula. No módulo 3, as aulas 09–11 usam `aula-XX.png` e `aula-XX-p2-v2.png`; a aula 12 usa o par revisado `aula-12-p1-v3.png` e `aula-12-p2-v4.png`. A aula 13 usa `aula-13-p1-v2.png` e `aula-13-p2-v3.png`; a aula 14 usa `aula-14-p1-v4.png` e `aula-14-p2-v5.png`; a aula 15 usa `aula-15-p1-v4.png` e `aula-15-p2-v3.png`; a aula 16 usa `aula-16-p1-v6.png` e `aula-16-p2-v5.png`; a aula 17 usa `aula-17-p1-v3.png` e `aula-17-p2-v4.png`. As aulas 14–17 usam personagens refeitos a partir do par canônico da aula 01; os pares novos 15–17 foram aprovados por revisor independente após comparação de poses e enquadramentos com aulas vizinhas. As falas usam balões, enquanto quadros sem personagem falante usam cartões narrativos. Após a auditoria de quadros repetidos, a segunda prancha ativa das aulas 01–03 e 05–07 é `aula-XX-p2-hq-v3.png`; a aula 04 mantém `aula-04-p2-hq-v2.png`. As versões antigas permanecem como histórico. O controle geral está em `../PLANO_AUDITORIA_E_MELHORIA_CONTINUA_PRANCHAS.md`.

As duas pranchas de cada aula aparecem logo após **La storia del Senior**. O atalho **Tavole** no início da aula leva diretamente a elas; cada prancha abre ampliada ao clicar.

Na aula 08, o par ativo é `aula-08-hq-v2.png` e `aula-08-p2-hq-v4.png`, refeito para acompanhar o traço das aulas 05–07 sem copiar suas poses. A segunda prancha apresenta as verificações do laboratório e mantém a atualização adiada.

A revisão visual e técnica das novas aulas está em `AUDITORIA_PRANCHAS_09-12.md`. Os resultados do terminal na aplicação são a referência para valores exatos; as telas desenhadas são ilustrações.

Para os próximos lotes, `PADRAO_PRANCHAS.md` fixa a direção de arte e a ficha de 12 quadros. `REVISOR_LEVEL99.md` exige parecer independente após cada prancha: uma reprovação bloqueia a próxima, e o par só entra na aula após a revisão conjunta. Valores técnicos devem vir da aula; terminais e legendas devem ser compostos de forma determinística quando a arte deixar de ser protótipo.

## Validação

Execute `npm.cmd test` nesta pasta. O arquivo `VALIDACAO.md` registra as verificações do lote. O planejamento das 48 aulas está em `PLANO_CURSO.md`.

## Fontes técnicas

- [Documentação oficial do Proxmox VE](https://pve.proxmox.com/pve-docs/)
- [Documentação oficial do PBS](https://pbs.proxmox.com/docs/)
- [Requisitos e instalação do PBS](https://pbs.proxmox.com/docs/installation.html)


