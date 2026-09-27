# Direção e prompts finais — pranchas 01–04

Ferramenta: ImageGen integrado. Todos os PNGs finais foram copiados para esta pasta após inspeção visual. As pranchas de `CURSO_NETHSERVER_8/assets/aula-1.png` e `aula-1-p2.png` foram usadas como referência de personagens, paleta, cenário e composição; as cenas finais de Proxmox foram geradas como imagens novas. Nas gerações seguintes a referência direta foi removida porque rótulos de NS8 apareciam indevidamente nas telas.

Base comum dos prompts finais: HQ técnica original em italiano, seis quadros 3 × 2, datacenter corporativo azul/ciano, Júnior adulto de cabelo escuro e barba por fazer com hoodie grafite e crachá, Sênior adulto de barba grisalha e óculos pretos, racks reais, terminal e diagramas legíveis, texto curto, nenhum rótulo NS8.

| Arquivo | Direção de cena |
| --- | --- |
| `aula-01.png` | Incidente hipotético de falha do host; VM no PVE, limite do snapshot local, PBS em rack separado, arquitetura de backup planejada. |
| `aula-01-p2.png` | Inspeção dos papéis de `pve01` e `pbs01`, escolha de PVE + PBS separados e checklist de arquitetura; sem afirmar backup executado. |
| `aula-02.png` | Inventário de três candidatos; carga planejada de 24 GiB, VT-x/AMD-V, risco de disco único e host B com 64 GiB ECC. |
| `aula-02-p2.png` | Auditoria do servidor B: inventário, 64 GiB ECC, AMD-V, dois SSD, margem de RAM e aprovação do host. |
| `aula-03.png` | Ticket de gestão exposta, fluxo indevido de usuários e desenho das três redes de gestão, serviços e backup. |
| `aula-03-p2.png` | Inspeção de interfaces, rotas e portas; escolha de três redes separadas; nenhum teste de firewall real. |
| `aula-04.png` | Diferença entre RPO e RTO, metas de 15 e 120 minutos, preparação de prova de recuperação. |
| `aula-04-p2.png` | Perda observada de 10 minutos e recuperação em 75 minutos; comparação às metas e registro do teste. |

Ressalva: textos minúsculos em telas geradas são ilustração. Para comando, endereço, saída e valor canônico, o laboratório interativo prevalece. Revisar novamente cada prancha antes de distribuição comercial.
