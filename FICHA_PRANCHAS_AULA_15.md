# Ficha prévia dos 12 quadros — aula 15

Ticket INF-115, VM 212 `inventario-lab`. Fontes ativas: `data/lesson15.js` e `data/command-guide-15.js`. Referências visuais obrigatórias: `assets/aula-01.png` e `assets/aula-01-p2-hq-v3.png` para os personagens e balões; grade e composição técnica conferidas com as aulas vizinhas. Arte base sem texto, balões ovais em italiano e cartões de evidência compostos deterministicamente. Em 01/10, a aprovação visual anterior foi revogada por repetição editorial; o novo par ativo P1 v4/P2 v3 foi aprovado pelo revisor independente após correções e comparação com as aulas 14 e 16. Detalhes em `AUDITORIA_PRANCHAS_15.md`.

Fatos autorizados no caso: pve02 com 16 threads lógicos, 22 vCPU configuradas (relação 1,375), CPU host média 31%/pico 53% na janela observada, 64 GiB RAM instalada e 28 GiB `available` antes da intervenção, 30 GiB com VM parada e 26 GiB após reinício; margem mínima local 16 GiB. `local` 99G/100G, `local-lvm` 240G/800G e disco da VM em `local-lvm`. VM 212 com 2 vCPU, `memory: 2048`, `balloon: 2048`, scsi0 40G, running; guest com 120 MiB RAM available, swap 1250 MiB usada, `vmstat` si/so não zero nos últimos dois intervalos, carga média ~0,6 e `/` em 50%. Após diagnóstico e parada ordenada **simulados**, `memory`/`balloon` passam a 4096 MiB e a VM inicia; `qm config --current` e `MemTotal` confirmam capacidade, não melhora de latência. Os dados pós-reinício de `free -m` e `vmstat` são amostras em repouso, não comparação sob a mesma importação.

Fatos proibidos: CPU saturada apenas pelo número de vCPU, disco cheio, balão dinâmico 2–4 GiB, recuperação de performance já provada, alteração real em PVE, teste de importação posterior aprovado, uso de espaço de `local` como margem do disco em `local-lvm`, parada forçada, memória nominal igual à disponível integralmente no guest.

| Quadro | Cena visual e personagem | Texto técnico/fala permitida | Estado |
| --- | --- | --- | --- |
| P1-Q1 | Júnior recebe ticket e vê importação lenta, sem gráfico inventado | «L'importazione è lenta. Aumento tutto?» | observado |
| P1-Q2 | Sênior compara três cartões: vCPU, RAM, disco | «Misuriamo tre risorse separate.» | conceito |
| P1-Q3 | Diagrama de reservas CPU e uso real, sem LED de saturação | 22 vCPU/16 thread é overcommit, não prova de contesa | observado |
| P1-Q4 | Júnior lê memória e swap no guest | 120 MiB available e swap usada; hipótese de pressão | observado |
| P1-Q5 | Sênior aponta limites iguais em desenho de balão | memory=balloon=2048 MiB: dotação fissa no caso | conceito |
| P1-Q6 | Ambos preparam plano de uma única mudança | Alterar só RAM após checar margem e janela; melhora ainda pendente | proposto |
| P2-Q1 | Terminal PVE e inventário do host | `qm config 212`, `cat /srv/pve02-capacity.txt`, `free -h` | observado |
| P2-Q2 | Terminal guest com amostras | `free -m`, `vmstat 1 3`, CPU idle e swap; distinguir primeira linha | observado |
| P2-Q3 | Comparação de disco guest e datastore | `df -h /` 50%; `local-lvm` 560G disponível; disco não justifica aumento | observado |
| P2-Q4 | Júnior solicita shutdown e confirma estado | `qm shutdown 212` e `qm status 212 --verbose` stopped | executado no simulador |
| P2-Q5 | Sênior acompanha ajuste limitado e restart | `qm set 212 --memory 4096 --balloon 4096`, `qm start 212`; CPU/disco inalterados | executado no simulador |
| P2-Q6 | Terminal pós-reinício e ticket pendente | `qm config 212 --current`, `MemTotal` ~3,8 GiB; repetir importação e medir latência/margem | verificado parcialmente; desempenho pendente |

Portão: revisar conteúdo/saídas/ajuda e coerência de estado antes de gerar a arte. Revisor independente após P1, após P2 e no par; correção sem pedir nova autorização ao usuário.
