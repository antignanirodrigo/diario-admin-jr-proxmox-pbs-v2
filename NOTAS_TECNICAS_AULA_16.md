# Aula 16 — notas técnicas de produção

**Tema:** ciclo de vida, template, clone completo e snapshot local. **Estado:** aula 16 ativa no portal, com P1 v5 e P2 v4 aprovadas individualmente e em par pelo revisor independente.

## Caso

No nó didático `pve02`, uma VM-base Linux 230 preparada para clonagem precisa gerar uma VM 231 de QA. Antes da conversão, a VM-base deve ser desligada de forma ordenada e o estado `stopped` confirmado. A imagem-base deve ter identidade e inicialização preparadas para clones; uma cópia de QA deve ficar isolada da rede de produção até a validação de hostname, identidade e IP. O clone completo será criado em `local-lvm`. Antes de uma atualização pontual, o aluno cria um snapshot local e confirma sua presença. A atualização e eventual rollback ficam fora da simulação; o snapshot não é um backup fora do host.

## Sequência e evidências propostas

1. Ler configuração e estado da VM 230, política da imagem e capacidade do storage. O time de imagens validou `ssh_deletekeys=true`, mas a limpeza do estado cloud-init e machine-id ainda deve ser feita no guest. Executar `cloud-init clean --logs --machine-id` e confirmar `/etc/machine-id` como `uninitialized`, sem reiniciar a base. Manter `local-lvm` coerente com as aulas 07, 13 e 15, sem inventar nova ocupação após clone thin-provisioned.
2. `qm shutdown 230`; confirmar `qm status 230 --verbose` como `stopped`. Não substituir por `qm stop` forçado.
3. `qm template 230`; confirmar `template: 1` e que a base não deve ser usada como VM de trabalho.
4. `qm clone 230 231 --name inventario-qa --full 1 --storage local-lvm`; verificar configuração do clone. Explicar que `--full 1` cria cópia independente do disco, enquanto o clone ligado mantém dependência do template. O clone permanece em rede de QA isolada até verificar identidade.
5. Iniciar o clone apenas na rede isolada; conferir estado. `qm snapshot 231 pre-update --description 'Prima aggiornamento QA'`; verificar por `qm listsnapshot 231`. A descrição não prova consistência aplicativa, `--vmstate` não foi usado e nenhuma atualização foi aplicada ainda.
6. A decisão final deve distinguir uso do snapshot para rollback pontual de uma cópia recuperável após perda do nó. O inventário didático informa que ainda não existe backup externo/restauração testada; essa lacuna impede declarar recuperação aprovada.

## Portões técnicos antes da arte

- Confirmar comandos e opções na [sinopse oficial `qm`](https://raw.githubusercontent.com/proxmox/pve-docs/master/generated/qm.1-synopsis.adoc), inclusive `clone --full --name --storage`, `snapshot --description`, `listsnapshot`, `shutdown` e `status`.
- A conversão `qm template <vmid>` foi confirmada na [sinopse oficial atual no GitHub da Proxmox](https://github.com/proxmox/pve-docs/blob/master/generated/qm.1-synopsis.adoc). A consulta ao texto bruto havia omitido a seção por limitação de indexação, não por remoção do comando. Explicar que a imagem-base deve estar desligada.
- Validar que a cópia completa e o snapshot local não sejam apresentados como backup off-host, e que a arte não represente upgrade, rollback ou restauração não executados.
- Planejar 12 quadros distintos, dois PNGs 1536 × 1024, personagens do par canônico da aula 01, balões ovais em italiano e cartões técnicos determinísticos; revisor Level 99 após cada prancha e par.
