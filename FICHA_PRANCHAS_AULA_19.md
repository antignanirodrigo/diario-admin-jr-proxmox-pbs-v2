# Ficha de 12 quadros — aula 19

> **Atualização 02/10/2026:** a tabela abaixo é o planejamento anterior. O par ativo P1 `aula-19-p1-v4.png` / P2 `aula-19-p2-v7.png` fecha em conversa frontal sobre cópia/restore ainda não executados, após substituir cenas repetidas em tela e corredor. O parecer final está em `AUDITORIA_PRANCHAS_19.md`.

Ticket INF-119. CT 301 não privilegiado continua da aula 18. Pasta host dedicada `/mnt/bindmounts/web-int`, sem symlink, um arquivo `index.html`. Antes: diretório 0:0 750, arquivo 0:0 640; www-data UID/GID 33 no CT não lê. Mapas efetivos `/proc/self/uid_map` e `gid_map` mostram base 100000, extensão 65536, logo host 100033. Após `chown -R 100033:100033` somente nessa pequena fonte, ambos mantêm modos e leitura passa. `mp0` é `ro=1`. Conteúdo bind não entra em vzdump.

Pranchas 1536×1024, seis quadros 3×2, personagens da aula 01. Comparar os três pares anteriores 16–18 e os quadros internos; nenhum reaproveitamento de câmera/pose/função. Texto técnico exato em SVG, balões com cauda atribuível. Parecer independente de P1 antes de gerar P2.

| Quadro | Cena/função | Estado/texto vetorial |
| --- | --- | --- |
| P1-Q1 | Macro de diretório dedicado e arquivo vistos como objetos isolados, sem corredor/monitor | fonte dedicada, 0:0, 750/640 |
| P1-Q2 | Corte lateral do host até o CT por único caminho mp0, seta somente de leitura; sem dois cubos em rack | `mp0 ... ro=1` configurado após shutdown |
| P1-Q3 | www-data tenta ler índice e encontra portão fechado; rosto Júnior em reação lateral nova | Permission denied observado |
| P1-Q4 | Close em identidade do serviço dentro do CT, número 33 determinístico | UID/GID 33 |
| P1-Q5 | Fita de tradução 0→100000, 33→100033, distinguindo mapa efetivo de subuid | uid_map e gid_map |
| P1-Q6 | Plano diagonal sobre o ombro do Júnior, Sênior de perfil impede alavanca vermelha de permissão global e indica controle restrito; decisão depois do mapa, sem executá-la | Apriamo tutto? No, solo la fonte dedicata; non usare chmod 777 |
| P2-Q1 | Close específico da fonte host antes da alteração, mão seleciona só sua etiqueta | chown solo fonte dedicata |
| P2-Q2 | Terminal exibe stat de diretório e arquivo corrigidos, sem bitmap textual gerado | 100033:100033, 750/640 |
| P2-Q3 | Portão agora abre para leitura de www-data; nenhuma escrita | test -r: exit 0 (simulatore) |
| P2-Q4 | Cadeado de escrita preservado, leitura liberada, composição distinta da P1-Q3 | ro=1, scrittura negata |
| P2-Q5 | Backup CT ilustrado em uma mala que NÃO recolhe dados bind; fonte continua do lado host | dati bind esclusi da vzdump |
| P2-Q6 | Cena de plano operacional: Junior anota proteção separada do conteúdo, Sênior observa | backup separato da progettare; restore pendente |

Proibido: `chmod 777`, `unprivileged: 0`, backup de dados bind já executado, teste HTTP após mount se não houver comando no laboratório, mapear UID 33 apenas pelo arquivo subuid sem ler uid_map efetivo.
