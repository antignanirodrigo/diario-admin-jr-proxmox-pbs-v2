# Ficha prévia dos 12 quadros — aula 14

Ticket INF-114. Fontes: `data/lesson14.js` e `data/command-guide-14.js`, integradas ao módulo 4. Referência canônica de personagens e balões: `assets/aula-01.png` e `assets/aula-01-p2-hq-v3.png`; seis quadros 3 × 2 por prancha, datacenter azul escuro, arte base sem texto e composição vetorial.

Fatos permitidos: VM 211 `report-lab` running; `agent: 1` em PVE; `scsihw: virtio-scsi-single`; `scsi0` com 40G em `local-lvm`; `net0` em vmbr0. Inicialmente, `systemctl is-active qemu-guest-agent` retorna `inactive`; `ip -br addr` mostra `ens18 UP 10.10.10.21/24`; `lsblk` mostra sda 40G; `dpkg -s` confirma pacote instalado. **Só após** `systemctl start qemu-guest-agent` simulado, `ActiveState=active`, `qm guest cmd 211 ping` bem-sucedido e `network-get-interfaces` retorna o IP. O início automático não é demonstrado. Disco e net0 não mudam; conectividade remota ainda não foi provada.

| Quadro | Cena | Função e texto controlado | Estado |
| --- | --- | --- | --- |
| P1-Q1 | Júnior nota campo IP vazio na GUI, sem tela de falha de rede | Sintoma: IP ausente em PVE | observado |
| P1-Q2 | Sênior separa disco/controlador, Agent e rede em diagrama comum | Três componentes não equivalentes | conceito |
| P1-Q3 | Ambos inspecionam a configuração da VM | `agent: 1` e VirtIO SCSI lado PVE | observado |
| P1-Q4 | Júnior acessa console do guest | Verificação dentro do sistema, sem alterar | proposto |
| P1-Q5 | Sênior aponta diferença entre “configurado” e “em execução” em quadro plano | Agent em PVE não prova serviço ativo | conceito |
| P1-Q6 | Checklist ainda vazio para serviço, IP e disco | Diagnóstico antes de mudar net0 | pendente |
| P2-Q1 | Terminal técnico grande da configuração PVE | Saída literal de `qm config 211` e `qm status 211` | observado |
| P2-Q2 | Terminal do guest sobre serviço e IP | Saídas iniciais de `systemctl is-active`, `ip -br addr`, `lsblk` e `dpkg -s` | observado |
| P2-Q3 | Júnior inicia serviço no console do guest | `systemctl start qemu-guest-agent`, após diagnóstico | executado no simulador |
| P2-Q4 | Sênior inspeciona estado e canal de agente | `ActiveState=active` e `qm guest cmd 211 ping` bem-sucedido | verificado no simulador |
| P2-Q5 | PVE recebe interfaces do guest | `network-get-interfaces` retorna ens18 e 10.10.10.21/24 | verificado no simulador |
| P2-Q6 | Ticket com um teste remoto ainda aberto | Observabilidade corrigida; conectividade externa não provada | pendente |

Portão concluído: conteúdo revisado antes da arte; revisor independente aprovou P1 v4, P2 v5 e o par após refazer personagens e acrescentar balões. Histórico completo em `AUDITORIA_PRANCHAS_14.md`.
