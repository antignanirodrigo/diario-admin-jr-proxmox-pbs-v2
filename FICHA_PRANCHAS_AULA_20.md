# Ficha de 12 quadros — aula 20

> **Atualização 02/10/2026:** a tabela abaixo é o planejamento anterior. O par ativo P1 `aula-20-p1-v5.png` / P2 `aula-20-p2-v3.png` usa socket local sem globo, simulação pausada, objetos de backup/autorizações pendentes e sequência futura no piso. O parecer final está em `AUDITORIA_PRANCHAS_20.md`.

Ticket INF-120. CT 301 está running, unprivileged=1, mp0 ro=1, Nginx active e porta 80 escuta dentro do CT. Rootfs tem 6G livres no cenário. `apt-get -s upgrade` anuncia três pacotes, nenhum instalado. Documento do ticket relata snapshot local do rootfs, mas falta cópia independente da fonte bind, restauração testada, janela aprovada e prova dos usuários remotos. **A aula não executa upgrade, backup ou restore.** Comparar pranchas 17–19 e personagens canônicos da aula 01; seis quadros 3×2 em cada, 1536×1024, sem repetir câmera/pose/função. P1 aprovada antes de gerar P2; par aprovado antes de ativar.

| Quadro | Cena/ação distinta | Informação permitida |
| --- | --- | --- |
| P1-Q1 | Notificação de patch chega como alerta abstrato em console de manutenção, nenhum botão de upgrade pressionado | Ticket INF-120, patch pendente |
| P1-Q2 | Sênior examina barreiras do CT em painel lateral, não dois cubos em rack | unprivileged=1; mp0 ro=1 |
| P1-Q3 | Visualização de porta TCP 80 escutando **dentro** do CT, sem usuário remoto/rota externa | nginx active; `ss -ltn` porta 80 |
| P1-Q4 | Terminal técnico plano, rootfs com 6G disponíveis; não usar gauge de aula 15/18 | `df -h /`: 6G avail |
| P1-Q5 | Júnior lê plano de três pacotes em interface âmbar sem check de conclusão | `apt-get -s upgrade`: 3 pacchetti, 0 installati |
| P1-Q6 | Sênior bloqueia avanço do cronograma ao notar lacuna de retorno, câmera não reencena alavanca de 19 | Snapshot locale ≠ recupero completo |
| P2-Q1 | Arte técnica do bind host fora do perímetro de snapshot/vzdump, composição diferente da mala/esquema de 19 | bind senza copia esterna |
| P2-Q2 | Espaço de restauração de laboratório preparado, ainda vazio, sem indicador verde | restore da provare |
| P2-Q3 | Quadro documental de aprovação com assinatura ausente e janela sem data, sem checklist repetido | finestra non approvata |
| P2-Q4 | Diagrama de caminho de usuários ao CT com ponto de teste ainda vazio, sem seta de sucesso | utenti remoti non testati |
| P2-Q5 | Sênior e Júnior definem sequência futura em composição diferente das aulas 18/19, com balões | copie → restore → finestra → update |
| P2-Q6 | Estado final do ticket em pausa, terminal sem upgrade executado e placa de plano pendente | aggiornamento rinviato |

Terminais, endereços, estados e números via SVG; arte-base sem texto gerado. Proibido: backup/restauro/upgrade concluído, acesso remoto confirmado, firewall=1 como garantia de regras, dados bind dentro do snapshot rootfs, CT privilegiado ou nesting ativado.
