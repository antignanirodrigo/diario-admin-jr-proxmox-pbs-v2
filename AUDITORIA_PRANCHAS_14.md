# Auditoria independente — aula 14

Data: 30/09/2026. Ticket INF-114, VM 211. Fontes: `data/lesson14.js`, `data/command-guide-14.js`, `FICHA_PRANCHAS_AULA_14.md` e padrão do curso. Arte base sem texto, composição SVG de legendas/evidências e PNG final 1536 × 1024.

| Etapa | Parecer Level 99 | Bloqueio e resolução |
| --- | --- | --- |
| Conteúdo inicial | REPROVADO | O planejamento exigia corrigir o Guest Agent, mas o laboratório só diagnosticava. Adicionadas intervenção simulada e provas posteriores. |
| Conteúdo revisado | REPROVADO | `systemctl enable --now` prometia habilitar unidade Debian static; repetição de `is-active` contradizia estado posterior; ação podia anteceder diagnóstico. Corrigidos para `systemctl start`, saída dependente de estado e pré-requisitos completos. |
| Conteúdo final | APROVADO | Sequência diagnóstico → início do serviço → `ActiveState=active` → `qm guest cmd 211 ping` → IP via agente. Teste remoto permanece pendente. |
| P1 v1 | REPROVADA | Q5 mostrava indicador verde antes de verificar o serviço. |
| P1 v2 | APROVADA | Indicador neutro `?`; seis quadros coerentes e legíveis. |
| P2 v2 | REPROVADA | Globo sugeria acesso externo sem prova; cartão Q2 cobria rosto. |
| P2 v3 | REPROVADA | Painel corretivo Q5 ainda cobria parcialmente o rosto do Júnior. |
| P2 v4 e par | APROVADOS | Diagrama AGENTE → PVE termina antes do rosto, sem símbolo de Internet; Q2 deixa o personagem visível. Saídas e estados coerentes. |
| P1 v3, após pedido de balões | REPROVADA | Balões e falas estavam corretos, mas a arte base ainda descaracterizava os dois personagens em relação às imagens canônicas da aula 01. |
| P1 v4 | APROVADA | Nova base com rostos, cabelos, idade e roupas da aula 01; seis balões ovais de diálogo, caudas corretas e estado técnico preservado. |
| P2 v5 e par | APROVADOS | Nova base com os mesmos personagens de P1 e da aula 01; seis balões, terminais legíveis, sequência técnica íntegra e teste remoto pendente. |

**Par ativo:** `assets/aula-14-p1-v4.png` + `assets/aula-14-p2-v5.png`. A correção visual usou `assets/aula-01.png` e `assets/aula-01-p2-hq-v3.png` como referências canônicas de personagem e balão. Nenhuma VM real é alterada. O laboratório usa serviço inicialmente `inactive`, IP local `10.10.10.21/24` e disco `40G`; após `systemctl start` simulado, valida estado e canal do Guest Agent. `qm guest cmd ... ping` aqui testa QGA, não ICMP. A conectividade remota e a persistência posterior do serviço não são declaradas comprovadas.

Verificação de entrega: 21/21 testes, incluindo pré-requisitos e repetição de `is-active`; portal respondeu HTTP 200 para aula e os dois PNGs. Para sintaxe, conferir [qm guest cmd no synopsis Proxmox](https://github.com/proxmox/pve-docs/blob/master/generated/qm.1-synopsis.adoc) e [systemctl no manual systemd](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html).
