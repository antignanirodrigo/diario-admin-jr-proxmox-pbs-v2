# Auditoria independente — aula 19 (01/10/2026)

**Ativos em 01/10:** `assets/aula-19-p1-v2.png` e `assets/aula-19-p2-v2.png`, 1536 × 1024, seis quadros cada; substituídos em 02/10 pelo par registrado ao final. Parecer independente e somente leitura; comparação quadro a quadro com pares 16–18.

Conteúdo técnico inicialmente reprovado e corrigido antes da arte: subuid/subgid isolados não provam mapping ativo, por isso o laboratório lê `uid_map` e `gid_map`; mede diretório **e arquivo** antes/depois; rotula exit status como anotação do simulador; troca a ajuda falsa `test --help` por `help test` e corrige trechos portugueses. O revisor aprovou então a aula: mapeamento efetivo 0→100000/65536, www-data 33→100033, fonte dedicada sem symlink, modos 750/640, mount ro=1. Conteúdo bind continua fora de vzdump.

**P1 v1 reprovada:** Q6 reencenava o close frontal de dupla com dois balões da aula 18 P2-Q6 e dizia “Leggiamo il mapping” depois de Q5 já tê-lo lido. **P1 v2 aprovada:** câmera diagonal sobre o ombro do Júnior; Sênior impede abertura global e aponta opção restrita. Fala responde ao mapa já observado. Só depois do parecer foi gerada P2.

**P2 v1 reprovada:** Q5 dizia “Dati bind esclusi dal CT”, incorreto porque o bind está acessível dentro do CT. **P2 v2 e par aprovados:** corrigido para “Contenuto bind fuori da vzdump”; Q1–Q4 distinguem propriedade restrita, stat de diretório/arquivo, leitura como www-data e ro=1; Q5 avisa que o esquema não representa backup executado; Q6 deixa backup/restauração pendentes. Revisor não encontrou reencenação bloqueante frente a 16–18. Parecer visual/documental, sem operação PVE real.

## Reabertura por diálogo e repetição — 02/10/2026

Nova **P1 `aula-19-p1-v4.png`** aprovada isoladamente: quatro falas orgânicas, diagnóstico de `Permission denied`, UID/GID 33 e mapa efetivo 33→100033 antes da correção. A P2 inicial repetia o Júnior diante de monitor; Q3 passou a tomada alta no corredor com tablet. O par reprovou duas versões de Q6: primeiro repetia dupla diante de tela da aula 18, depois dupla andando entre racks da aula 16. **P2 `aula-19-p2-v7.png`** fecha em conversa frontal no escritório azul, com plano em branco e mídia fechada. O revisor independente aprovou P2 e o par (oito falas). Correção restrita à fonte dedicada, modos 750/640, leitura exit 0 e `ro=1` permanecem corretos; backup/restore dos dados bind seguem planejados. `npm.cmd test` 29/29; página e PNGs HTTP 200.
