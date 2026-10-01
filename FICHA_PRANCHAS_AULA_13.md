# Ficha prévia dos 12 quadros — aula 13

Ticket INF-113. Fonte factual: `data/lessons-module-04.js` e `data/command-guide-module-04.js`. Referência visual: par aprovado da aula 12. O material `linux-lab-uefi.iso` e os arquivos `/srv/` são objetos **simulados deste laboratório**. Não apresentar os requisitos como padrão universal de Linux/PVE.

Fatos permitidos: VMID 210; ISO `local:iso/linux-lab-uefi.iso` presente; perfil interno exige OVMF, disco EFI, q35, 2 vCPU, 4096 MiB e vmbr0. Configuração atual: SeaBIOS, pc-i440fx, 1 vCPU, 2048 MiB, vmbr9, sem entrada `efidisk0`. `local` e `local-lvm` estão ativos; `local` segue com 99G de 100G usados e 1G disponível, como na aula 07. Nenhuma modificação, boot ou teste de rede ocorreu. Não criar versões, IPs, checksum, resultados de boot ou status concluído.

| Quadro | Ação visual | Função e texto permitido | Estado |
| --- | --- | --- | --- |
| P1-Q1 | Junior observa VM 210 sem boot | Incidente; suspeita inicial na ISO | observado |
| P1-Q2 | Senior mostra perfil interno da imagem | UEFI/OVMF e disco EFI exigidos pelo caso | observado |
| P1-Q3 | Ambos veem inventário de ISO | ISO aprovada presente; presença não prova boot | observado |
| P1-Q4 | Junior compara configuração da VM | SeaBIOS, pc-i440fx, 1 vCPU, 2048 MiB, vmbr9 | observado |
| P1-Q5 | Senior traça dependências firmware→boot e bridge→rede | Problemas distintos, não atribuir tudo à ISO | inferido |
| P1-Q6 | Ambos anotam itens ainda não testados | Plano de revisão, sem aplicar mudança | proposto |
| P2-Q1 | Evidência ampliada do perfil e inventário | Saídas literais dos dois arquivos didáticos | observado |
| P2-Q2 | Evidência ampliada de `qm config 210` | Saída literal e ausência de `efidisk0` | observado |
| P2-Q3 | Inspeção de storage | `pvesm status` literal com capacidade; `local` ainda quase cheio; ativo não prova boot | observado |
| P2-Q4 | Revisão da escolha mínima | OVMF, EFI, q35, 2 vCPU, 4096 MiB, vmbr0 | proposto |
| P2-Q5 | Duas trilhas de testes: boot e rede | Testes futuros, indicadores neutros | pendente |
| P2-Q6 | Ticket aberto com checklist vazio | Nada aplicado ou homologado | pendente |

Portão: revisor independente após P1, depois após P2, revisão do par antes de ativação.
