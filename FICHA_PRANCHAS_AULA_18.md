# Ficha de 12 quadros — aula 18

> **Atualização 02/10/2026:** a tabela abaixo é o planejamento anterior. O par ativo P1 `aula-18-p1-v5.png` / P2 `aula-18-p2-v7.png` substituiu cenas repetidas por checklist físico, ação em rack/tablet, evidência `pct config 301` e mapa do limite host→CT. O parecer final está em `AUDITORIA_PRANCHAS_18.md`.

**Ticket INF-118.** Continuação do candidato B da aula 17. O CT 301 só passa de `absent` a `stopped` depois de conferir espaço e obter template; depois passa a `running`, recebe Nginx e responde HTTP 200 visto de pve02. `local` tinha 1G livre; template didático de 140M é descarregado ali, rootfs de 8G em `local-lvm`. Acesso externo, backup e restauro continuam pendentes. Nome do template é do catálogo simulado, não promessa de versão disponível em PVE real.

**Referências:** `assets/aula-01.png` e `assets/aula-01-p2-hq-v3.png`; comparar composição/pose/função dos três pares anteriores 15–17. 1536 × 1024, seis quadros 3×2 por prancha, balões italianos com caudas corretas e cartões determinísticos para números/comandos. Sem terminal inventado em bitmap. P1 exige parecer independente antes de gerar P2.

| Quadro | Ação/evidência visual própria | Texto vetorial autorizado | Estado |
| --- | --- | --- | --- |
| P1-Q1 | Macro lateral de medidor de capacidade `local` quase cheio, Júnior em reflexo pequeno; evitar duas pessoas ante tela | local: 1G libero | observado |
| P1-Q2 | Plano lateral do Júnior consultando catálogo de templates numa estação isolada, sem mão no queixo; cartão determinístico mostra tamanho do caso | Catalogo simulato: Debian, 140M | observado no cenário |
| P1-Q3 | Visão lateral de duas unidades de armazenamento separadas por divisor; objetos são metáfora esquemática de volumes PVE, não discos físicos dedicados | Template su local; rootfs 8G su local-lvm | plano |
| P1-Q4 | Close das mãos do Júnior selecionando o selo `unprivileged`, sem apertar botão físico de servidor | `--unprivileged 1` | execução simulada |
| P1-Q5 | Plano lateral do Sênior e Júnior com tablet de configuração; balão do Sênior declara estado parado sem cobrir rostos | Per ora è fermo; controlla config e rete | observado |
| P1-Q6 | Close no terminal com `pct config 301` e `unprivileged: 1` compostos deterministicamente, indicador neutro; a saída da criação mantém o CT parado | CT 301: stopped | transição |
| P2-Q1 | Macro baixo das mãos do Júnior digitando no console, sem repetir seu retrato lateral da P1; indicador passa a ativo | CT 301: running | executado |
| P2-Q2 | Close do terminal no interior do CT com eth0/IP e sem prose artificial | 10.10.10.31/24 | observado |
| P2-Q3 | Bancada técnica com ícone de pacote Nginx transferido para o CT, sem falsa rede externa | Nginx installato nel simulatore | executado |
| P2-Q4 | Painel operacional plano com engrenagem/estado ativo, sem mais um cubo no rack; não confundir processo com conectividade | nginx: active | observado |
| P2-Q5 | Requisição HTTP pve02→CT com resposta 200, seta apenas entre esses dois | HTTP/1.1 200 OK dall’host | observado |
| P2-Q6 | Sênior e Júnior discutem fronteira da prova ante corredor, sem recriar pose/vidro das 15–17 | Utenti remoti e restore non verificati | pendente |

**Proibido:** CT privilegiado, rootfs em `local`, acesso da VLAN usuários validado, backup pronto, template real garantido, Nginx rodando antes da instalação, HTTP 200 antes do serviço, seta PVE→PBS como se backup existisse.
