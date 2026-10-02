# Ficha prévia dos 12 quadros — aula 16

> **Atualização 02/10/2026:** esta ficha registra o planejamento e revisões anteriores. O par ativo agora é P1 `aula-16-p1-v8.png` / P2 `aula-16-p2-v7.png`, com balões orgânicos e cartões técnicos no lugar de falas sem emissor. Para o parecer final e estados visuais, consultar `AUDITORIA_PRANCHAS_16.md` e os PNGs ativos.

Ticket INF-116, base 230 e clone QA 231 em pve02. Fontes ativas: `data/lesson16.js` e `data/command-guide-16.js`; revisor independente aprovou o conteúdo antes da arte. Referência exata de personagens: `assets/aula-01.png` e `assets/aula-01-p2-hq-v3.png`; paleta e personagens comparados com as aulas vizinhas sem repetir suas composições. Duas pranchas 1536 × 1024, seis quadros cada, falas ovais em italiano e cartões narrativos para quadros sem falante; texto técnico determinístico. Em 01/10, a aprovação visual de P1 v5/P2 v4 foi revogada por repetição editorial. O novo par ativo P1 v6/P2 v5 foi aprovado em portões separados e na revisão conjunta; detalhes em `AUDITORIA_PRANCHAS_16.md`.

Fatos do caso: base 230 inicialmente running, scsi0 20G em local-lvm, net0 vmbr30 com link_down=1, cloud-init presente. local-lvm 800G total/240G used/560G available antes do clone; não inferir uso efetivo depois. Checklist de imagem aprovada pelo time e `ssh_deletekeys=true`; limpeza `cloud-init clean --logs --machine-id` e leitura `/etc/machine-id=uninitialized` são executadas **antes** do shutdown. Conversão a template só após stopped. Clone completo 231 com disco distinto e MAC distinto, ainda link_down=1; start isolado não prova hostname, machine-id, host key ou IP novos. Snapshot pre-update local sem `--vmstate` e sem upgrade executado. Inventário didático: backup externo ausente, restauração não testada.

Fatos proibidos: clone em produção, identidade do guest confirmada, teste de upgrade concluído, rollback realizado, backup PBS já integrado, recuperação após perda do host garantida, números inventados de uso do storage pós-clone, snapshot local apresentado como cópia externa.

| Quadro | Cena visual distinta | Fala/evidência permitida | Estado |
| --- | --- | --- | --- |
| P1-Q1 | Júnior recebe demanda de QA e aponta para snapshot como solução total | «Uno snapshot basta anche se perdiamo il nodo?» | problema |
| P1-Q2 | Sênior separa quatro camadas em mesa técnica, sem check de sucesso | Template, clone completo, snapshot local e backup externo têm papéis distintos | conceito |
| P1-Q3 | Base 230 ainda em execução, rede visualmente desligada | Base running; preparar identidade antes de desligar | observado |
| P1-Q4 | Júnior planeja limpeza cloud-init e machine-id no guest | `cloud-init clean --logs --machine-id`; depois `uninitialized`, sem reiniciar base | plano/ação explicada |
| P1-Q5 | Sênior mostra clone completo independente do volume base, ambos no mesmo rack | Full clone não é backup externo; rede QA continua isolada | conceito |
| P1-Q6 | Ambos distinguem ponto local de cópia em rack externo | Snapshot para rollback; recuperação do nó exige outra cópia e teste | hipótese/plano |
| P2-Q1 | Terminais PVE exibem configuração base, checklist e storage pré-clone | 230 running; scsi0 local-lvm 20G; link_down=1; local-lvm 560G available | observado |
| P2-Q2 | Terminal guest e botão de shutdown ordenado em sequência | clean + machine-id uninitialized; `qm shutdown 230`; `qm status 230 --verbose` stopped | executado no simulador |
| P2-Q3 | Transformação base→template e clone QA em área isolada | `qm template 230`; `qm clone 230 231 --full 1 --storage local-lvm` | executado no simulador |
| P2-Q4 | Configuração e início da VM 231 sem cabo de rede conectado | disco vm-231 distinto, MAC distinto, link_down=1; `qm start 231`; identidade guest pendente | verificado parcialmente |
| P2-Q5 | Snapshot local pre-update aparece em lista, sem símbolo de backup externo | `qm snapshot ... --description ...`; `qm listsnapshot 231`; RAM não incluída | executado no simulador |
| P2-Q6 | Ticket mostra duas lacunas sem selo de concluído | upgrade não executado; backup externo e restauração ausentes; host key/machine-id/hostname/IP ainda a verificar | pendente |

Portão: revisor independente da P1 antes de criar P2; revisor da P2 e do par antes da ativação. As telas desenhadas não substituem saída literal da aula. Sem pedir nova autorização para corrigir rejeições.
