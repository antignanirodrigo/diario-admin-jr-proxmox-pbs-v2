# Roteiro pré-produção — Módulo 6, armazenamento e integridade (21–24)

Estado: **PRONTO PARA DIREÇÃO DE ARTE E IMPLEMENTAÇÃO, AINDA NÃO PARA GERAR PRANCHAS**. Este roteiro não cria storage, não modifica os nós e não ativa aulas. Data: 2026-10-02. Falas, legendas e conteúdo ao aluno devem ser em italiano; comandos e saídas conservam a sintaxe técnica. Todos os dados numéricos, nomes, nós, caminhos, endereços e resultados abaixo são **cenário simulado**, não inventário de produção. Cada saída terá de ser implementada identicamente no simulador antes de desenhar texto técnico. Este portão é deliberado: os painéis não devem prometer um resultado que o laboratório não mede.

## Base técnica e continuidade

O [guia oficial PVE](https://pve.proxmox.com/pve-docs/pve-admin-guide.pdf), capítulo Storage, especifica tipos de conteúdo `iso`, `vztmpl`, `images`, `rootdir`, `backup` e `snippets`. O exemplo padrão usa `dir: local` para `iso,vztmpl,backup` e `lvmthin: local-lvm` para `rootdir,images`; LVM-thin é local, com snapshots/clones, não compartilhado. O backend `zfspool` local aceita `images,rootdir`; NFS aceita tipos de arquivo e é compartilhado; iSCSI é bloco e sozinho não oferece gestão dinâmica de espaço. Thin provisioning aloca conforme gravações e o guia avisa que pool esgotado pode causar erro de I/O e inconsistência. A seção ZFS do mesmo guia define mirror e RAIDZ, `zpool status`, scrub e substituição. A [referência oficial `pvesm`](https://pve.proxmox.com/pve-docs/pvesm.1.html) define `status`, `list`, `scan nfs`, `scan iscsi` e `help`. A [referência OpenZFS de `zpool status`](https://openzfs.github.io/openzfs-docs/man/master/8/zpool-status.8.html) confirma `-v` (erros detalhados) e `-P` (paths completos), e a de [`zpool replace`](https://openzfs.github.io/openzfs-docs/man/master/8/zpool-replace.8.html) confirma a sequência old/new device e resilver. A documentação deve ser reconferida na versão-alvo quando as aulas forem implementadas, já que a referência online é mutável.

Aula 20 termina com CT 301 em `pve02`, rootfs `local-lvm:vm-301-disk-0`, bind host `/mnt/bindmounts/web-int` em modo somente leitura, sem backup independente do bind, sem restauração testada e sem autorização de patch. Este módulo **não** resolve essas pendências fora de cena. A 21 pode usar a ISO de VM 100 como outro artefato e preservar CT 301; a 22–23 usam pool didático **novo** `tank-lab` em `pve03`, jamais discos de `pve02`; a 24 planeja storage compartilhado sem migrar a VM e diagnostica pressão no `local-lvm` já existente. Os dispositivos de disco `/dev/disk/by-id/...` precisam ser inventados explicitamente para o simulador, nunca apresentados como discos físicos reais. Nenhum quadro diz que mirror/RAIDZ, snapshot, NFS ou iSCSI substituem PBS ou cópia off-site.

Convenção visual: duas pranchas de seis quadros 3×2 por aula; balões orgânicos integrados, uma única forma com cauda curta; diálogo adulto natural, em torno de 6–8 falas por **par** se a ação comportar. A primeira prancha contém incidente/hipótese, a segunda evidência/decisão/pendência. Evitar repetir abertura com Júnior pensativo diante do mesmo monitor, três cartões A/B/C, lista com três checks e encerramento com tela verde das aulas 17–20. Nomes e saídas nos quadros vêm apenas do simulador. Não exibir `zpool create`, `zpool replace`, montagem NFS, login iSCSI ou migração como executados se o laboratório só os planejar.

## Aula 21 — Tipi di storage e contenuti ammessi

**Ticket INF-121.** O Júnior tenta usar `local-lvm` como destino de uma ISO Debian destinada à próxima VM de teste e a seleção não oferece conteúdo `iso`. Objetivo observável: classificar `local` e `local-lvm` pelo backend/conteúdo, localizar o volume de VM e a ISO no storage certo, sem alterar configuração nem fazer upload real. Estado inicial: `pve02` contém `local` e `local-lvm`; VM 100 e CT 301 continuam como antes; uma ISO didática `debian-12.8.0-amd64-netinst.iso` já está em `local` para evitar fluxo de rede/upload simulado. Estado final permitido: **diagnóstico e seleção de destino**, sem cópia ou criação de volume. A versão da ISO é dado do cenário, não recomendação de versão atual.

Laboratório, entradas e saídas **simuladas** (sem inventar uma CLI que faça upload):

```text
pve02# cat /etc/pve/storage.cfg
dir: local
        path /var/lib/vz
        content iso,vztmpl,backup
lvmthin: local-lvm
        vgname pve
        thinpool data
        content images,rootdir

pve02# pvesm status
Name       Type     Status     Total       Used       Available
local      dir      active     104857600   31457280   73400320
local-lvm  lvmthin  active     209715200   104857600  104857600

pve02# pvesm list local --content iso
Volid                                      Format  Type  Size
local:iso/debian-12.8.0-amd64-netinst.iso iso     iso   692060160

pve02# pvesm list local-lvm --content images
Volid                      Format  Type    Size
local-lvm:vm-100-disk-0     raw     images  34359738368

pve02# pvesm list local-lvm --content rootdir
Volid                      Format  Type     Size
local-lvm:vm-301-disk-0     raw     rootdir  8589934592
```

`cat` lê configuração sem mudar; `pvesm status` mostra disponibilidade sem identificar conteúdo; `pvesm list ID --content TIPO` filtra o conteúdo (não converte o backend). `pvesm help` e `pvesm help list` são apenas consultas de ajuda, sem marcar evidência. A decisão correta escolhe `local` para ISO existente, `local-lvm` para discos/rootfs. **Proibido:** dizer que o comando `pvesm list` envia ISO, que `local-lvm` armazena `iso`, que todos os storages `dir` são automaticamente compartilhados, ou que a capacidade mostrada prova margem para qualquer crescimento futuro.

| Quadro | Ação / evidência e função | Fala/legenda italiana proposta | Estado |
| --- | --- | --- | --- |
| P1-Q1 | Júnior segura checklist de instalação ao lado de seletor ISO sem `local-lvm`; incidente, câmera lateral nova | J: «Perché non trovo local-lvm per l’ISO?» | observado |
| P1-Q2 | Sênior aponta fisicamente a diferença arquivo/bloco, sem selos de aprovação | S: «Prima leggiamo il tipo e i contenuti.» | hipótese |
| P1-Q3 | Mapa de `local` como diretório com pasta `template/iso`; conceito | legenda `dir: local · iso,vztmpl,backup` | observado |
| P1-Q4 | Corte de `local-lvm` como thin pool com discos VM/CT, sem ícone ISO | J: «Qui vanno dischi e rootfs, giusto?» | hipótese |
| P1-Q5 | Terminal `cat /etc/pve/storage.cfg` em foco; linhas exatas | S: «La configurazione risponde.» | observado |
| P1-Q6 | Cursor separa destinos possíveis; nenhuma ação de upload | legenda `Verificare inventario e capacità` | pendente |
| P2-Q1 | Terminal com `pvesm status` e bytes sem barra verde enganosa; nova evidência | J: «Lo stato dice spazio, non il contenuto.» | observado |
| P2-Q2 | Terminal filtrado `pvesm list local --content iso`, ISO existente | legenda `ISO già presente su local` | observado |
| P2-Q3 | Visão de VM 100 e CT 301 ligada a `images` e `rootdir`, sem repetição de P1-Q3 | S: «Controlliamo anche i volumi esistenti.» | observado |
| P2-Q4 | Comparação concreta do ID `vm-100-disk-0` com `vm-301-disk-0` | legenda `images ≠ rootdir` | observado |
| P2-Q5 | Júnior seleciona destino em folha de decisão, sem botão `upload` | J: «Scelgo local per l’ISO.» | proposto |
| P2-Q6 | Registro INF-121 com classificação e nenhuma tarefa de mutação | legenda `Diagnosi chiusa · Nessun volume spostato` | observado |

## Aula 22 — ZFS: pool, vdev e ridondanza locale

**Ticket INF-122.** `pve03` precisa de um pool de laboratório para discos de VM; há quatro discos didáticos de 1 TiB (`/dev/disk/by-id/ata-LAB-01` a `04`), vazios **somente no inventário simulado**. A equipe compara dois mirrors em stripe com RAIDZ2. Objetivo: escolher topologia com base em falhas toleradas e capacidade aproximada e documentar pré-requisitos, sem executar `zpool create`. Estado inicial/final: sem `tank-lab` e sem volume criado. Com quatro discos iguais, duas cópias/stripe de mirrors rendem cerca de 2 TiB antes de overhead; RAIDZ2 também cerca de 2 TiB antes de overhead, mas a tolerância é diferente: RAIDZ2 tolera quaisquer dois discos; dois mirrors podem tolerar dois discos apenas se pertencerem a mirrors distintos. **Não prometer capacidade útil exata, desempenho ou sobrevivência a três falhas.** Um único mirror de quatro vias renderia ~1 TiB e não é a opção proposta.

Saídas **simuladas**:

```text
pve03# lsblk -o NAME,SIZE,TYPE,MOUNTPOINT
NAME  SIZE TYPE MOUNTPOINT
sda   256G disk
├─sda1   1G part /boot/efi
└─sda2 255G part /
sdb     1T disk
sdc     1T disk
sdd     1T disk
sde     1T disk

pve03# zpool status
no pools available

pve03# cat /srv/INF-122-inventario.txt
sdb=ata-LAB-01 1TiB vuoto (simulato)
sdc=ata-LAB-02 1TiB vuoto (simulato)
sdd=ata-LAB-03 1TiB vuoto (simulato)
sde=ata-LAB-04 1TiB vuoto (simulato)
Boot sda: ESCLUSO; confermare seriali e stato SMART prima di agire
```

`lsblk -o` seleciona colunas, não certifica disco vazio; `zpool status` confirma ausência de pool, não saúde SMART; `cat` lê ficha exclusiva do cenário, não ferramenta PVE. `zpool help`/`zpool help status` podem ser simulados como ajuda sem progresso. O operador deve escolher **RAIDZ2** para requisito de tolerar quaisquer dois discos; documentar que a decisão ainda exige validação de serial, SMART, RAM, controladora e janela antes de comandos destrutivos. **Proibido:** `zpool create` aplicado na arte; chamar redundância de backup; afirmar que RAIDZ2 protege exclusão lógica/ransomware/incêndio; dizer que dois mirrors resistem a quaisquer dois discos.

| Quadro | Ação / evidência | Fala/legenda italiana proposta | Estado |
| --- | --- | --- | --- |
| P1-Q1 | Quatro caddies lacrados e boot em rack distinto; novo enquadramento | J: «Quattro dischi: quanto perdiamo se uno cede?» | inventário |
| P1-Q2 | Sênior desenha `pool → vdev → dischi` em vidro; conceito | S: «La topologia decide il rischio.» | explicação |
| P1-Q3 | Dois pares mirror mostrados com pareamentos claros 01/02 e 03/04 | legenda `Due mirror · circa 2 TiB prima degli overhead` | hipótese |
| P1-Q4 | Falhas 01+02 simuladas no mesmo mirror, não ícone de pool verde | J: «Due guasti nello stesso mirror fermano il pool.» | hipótese |
| P1-Q5 | RAIDZ2 de quatro discos, duas paridades sem retratar backup remoto | S: «Qui qualsiasi coppia può mancare.» | hipótese |
| P1-Q6 | Cartão de requisito `2 dischi qualsiasi`; comparação ainda aberta | legenda `Scegliere in base al requisito` | pendente |
| P2-Q1 | `lsblk` com boot sda isolado, dados sdb–sde | J: «Il disco di boot resta fuori.» | observado |
| P2-Q2 | `zpool status`: no pools available, terminal seco | legenda `Nessun tank-lab creato` | observado |
| P2-Q3 | Inventário de serial/SMART com campos de validação, sem checks falsos | S: «Vuoto nel ticket non basta: verifica gli ID fisici.» | pendente |
| P2-Q4 | Tabela de falha 2 no mesmo mirror versus RAIDZ2 | legenda `RAIDZ2: tollera qualunque coppia` | decisão |
| P2-Q5 | Júnior assina desenho proposto RAIDZ2, lápis e carimbo `proposta` | J: «Propongo RAIDZ2, non lo creo oggi.» | proposto |
| P2-Q6 | Plano de backup separado do rack, não backup concluído | S: «Ridondanza locale non è una copia esterna.» | pendente |

## Aula 23 — Manutenzione ZFS: errore, scrub e sostituzione

**Ticket INF-123.** Caso novo e explícito: `tank-lab` de `pve03` foi provisionado **entre as aulas no ambiente simulado, sob mudança INF-122 aprovada**, com RAIDZ2 em quatro discos; o ticket declara esse salto, pois a aula 22 apenas planejou o pool. Um disco apresenta erros de leitura e o pool entra em `DEGRADED`. Um sobressalente `ata-LAB-05` de 1 TiB está fisicamente disponível **somente no cenário simulado**. O aluno interpreta o estado, executa scrub, confirma que o erro de device persiste, valida identidade e saúde do sobressalente, simula a substituição supervisionada e acompanha o resilver até `ONLINE`. A confirmação física e a troca do caddy são eventos explícitos do ticket; a CLI não finge executá-los.

Objetivo: diferenciar `DEGRADED` de `ONLINE`, erros, scrub e resilver; demonstrar que scrub verifica/repara o que a redundância permite, enquanto substituição exige selecionar dispositivo correto e observar a reconstrução. O simulador bloqueia `zpool replace` até o aluno ler a identificação antiga/nova, o registro da troca física autorizada e o registro da cópia independente consultada. Essa leitura **não** certifica integridade ou restore do backup. A passagem de tempo do resilver é um avanço explícito da simulação, não promessa de duração real. Estado final permitido: `ONLINE`, `errors: No known data errors` e `scan: resilvered ... with 0 errors` **somente depois** das evidências e do avanço simulado. O ticket fica encerrado quanto à saúde do pool, com ressalva de que redundância local não elimina a necessidade de cópia externa/restauração.

Saídas **simuladas**, com contadores consistentes (não saída prometida de uma versão específica):

```text
pve03# zpool status tank-lab
  pool: tank-lab
 state: DEGRADED
status: One or more devices has experienced an unrecoverable error.
  scan: none requested
config:
        NAME                 STATE     READ WRITE CKSUM
        tank-lab             DEGRADED     0     0     0
          raidz2-0           DEGRADED     0     0     0
            ata-LAB-01       ONLINE       0     0     0
            ata-LAB-02       ONLINE       0     0     0
            ata-LAB-03       DEGRADED     3     0     0
            ata-LAB-04       ONLINE       0     0     0
errors: No known data errors

pve03# zpool scrub tank-lab

pve03# zpool status -v tank-lab
  pool: tank-lab
 state: DEGRADED
  scan: scrub repaired 0B in 00:04:10 with 0 errors
config:
        NAME                 STATE     READ WRITE CKSUM
        tank-lab             DEGRADED     0     0     0
          raidz2-0           DEGRADED     0     0     0
            ata-LAB-01       ONLINE       0     0     0
            ata-LAB-02       ONLINE       0     0     0
            ata-LAB-03       DEGRADED     3     0     0
            ata-LAB-04       ONLINE       0     0     0
errors: No known data errors

pve03# cat /srv/INF-123-troca-autorizada.txt
Modifica INF-123: autorizzata nel laboratorio simulato
Guasto: ata-LAB-03; caddy 03 e seriale verificati
Ricambio installato: /dev/disk/by-id/ata-LAB-05; seriale, capacità e salute verificati
Copia indipendente: registro consultato prima della sostituzione

pve03# zpool replace tank-lab ata-LAB-03 /dev/disk/by-id/ata-LAB-05

pve03# zpool status -P tank-lab
  pool: tank-lab
 state: DEGRADED
  scan: resilver in progress, 26.0% done
config:
        NAME                 STATE     READ WRITE CKSUM
        tank-lab             DEGRADED     0     0     0
          raidz2-0           DEGRADED     0     0     0
            /dev/disk/by-id/ata-LAB-01       ONLINE       0     0     0
            /dev/disk/by-id/ata-LAB-02       ONLINE       0     0     0
            replacing-2      DEGRADED     0     0     0
              /dev/disk/by-id/ata-LAB-03     DEGRADED     3     0     0
              /dev/disk/by-id/ata-LAB-05     ONLINE       0     0     0
            /dev/disk/by-id/ata-LAB-04       ONLINE       0     0     0
errors: No known data errors

pve03# cat /srv/INF-123-avanzamento-simulato.txt
Il laboratorio avanza al completamento del resilver; nessuna durata reale dedotta.

pve03# zpool status -v -P tank-lab
  pool: tank-lab
 state: ONLINE
  scan: resilvered 812G in 01:12:33 with 0 errors
config:
        NAME                 STATE     READ WRITE CKSUM
        tank-lab             ONLINE       0     0     0
          raidz2-0           ONLINE       0     0     0
            /dev/disk/by-id/ata-LAB-01       ONLINE       0     0     0
            /dev/disk/by-id/ata-LAB-02       ONLINE       0     0     0
            /dev/disk/by-id/ata-LAB-05       ONLINE       0     0     0
            /dev/disk/by-id/ata-LAB-04       ONLINE       0     0     0
errors: No known data errors
```

`zpool scrub POOL` inicia verificação, não troca disco; a saída vazia do comando é plausível, acompanhamento é por `zpool status`. `zpool replace POOL OLD NEW` instrui ZFS a substituir o device antigo pelo novo; deve ser bloqueado antes da prova de identidade, aprovação, sobressalente instalado e registro de backup. O cenário usa quatro minutos de scrub e 01:12:33 de resilver **fictícios**, sem promessa real de tempo. `zpool status -P` exibe paths completos `/dev/disk/by-id/...` nos nós de device, como implementado em `lesson23.js`; o quadro pode destacar apenas linhas escolhidas dessa saída, nunca reescrevê-las. `zpool status` após scrub permanece `DEGRADED`; contadores históricos do disco antigo não somem. `ONLINE` só aparece após avanço explícito da simulação e após `ata-LAB-03` sair da árvore. `zpool help` só ajuda. **Proibido:** `ONLINE` sem substituição/resilver, zerar `READ 3` antes da troca, confundir scrub com backup, trocar pelo nome volátil `sdd`, afirmar que `ONLINE` prova cópia externa ou recuperação.

| Quadro | Ação / evidência | Fala/legenda italiana proposta | Estado |
| --- | --- | --- | --- |
| P1-Q1 | Alerta físico âmbar no caddy 03, perspectiva dentro do rack, sem choque cinemático repetido | J: «Il pool segnala DEGRADED.» | observado |
| P1-Q2 | Terminal `zpool status tank-lab` com `READ 3` no 03 | S: «Prima separa errori del device e dati persi.» | observado |
| P1-Q3 | Zoom de `errors: No known data errors`, separado do estado do disco | legenda `Nessun errore dati noto ≠ disco sano` | observado |
| P1-Q4 | Esquema de paridade RAIDZ2 sustentando leitura, sem “100% seguro” | J: «Il servizio regge, ma il margine è ridotto.» | inferência |
| P1-Q5 | Checklist IDs físicos e saúde, ainda em branco | S: «Non estrarre un disco finché l’ID non coincide.» | pendente |
| P1-Q6 | Plano de scrub diante do terminal, botão ainda não clicado | legenda `Scrub ≠ sostituzione` | proposto |
| P2-Q1 | Operador executa `zpool scrub tank-lab`, ação única do laboratório | J: «Avvio la verifica del pool.» | executado simulado |
| P2-Q2 | Linha `scan: scrub repaired 0B ... 0 errors` | legenda `Risultato simulato: 0 errori dati` | observado |
| P2-Q3 | `state: DEGRADED` permanece central, sem check verde | S: «Il device resta degradato.» | observado |
| P2-Q4 | Ordem de serviço e IDs `ata-LAB-03`/`ata-LAB-05` conferidos; execução simulada de `zpool replace`, com selo `LAB` | J: «L’ID è verificato; ora sostituisco nel laboratorio.» | executado simulado |
| P2-Q5 | Dois instantes distintos no mesmo quadro: `replacing-2`/resilver em curso e avanço didático explícito; não fingir segundos reais | legenda `Ricostruzione simulata · attesa completamento` | em curso simulado |
| P2-Q6 | `zpool status` final `ONLINE` e `ata-LAB-05`, nota de risco/cópia externa separada | S: «Pool ONLINE; il backup resta una prova diversa.» | validado simulado |

## Aula 24 — NFS, iSCSI e pressione del thin pool

**Ticket INF-124.** Equipe quer migrar VM 100 de `pve02` para outro nó usando storage compartilhado, enquanto `local-lvm` apresenta alta ocupação de dados **e** metadados. Entre INF-121 e INF-124, a ocupação do pool cresceu de 50% para 95%; a causa não é demonstrada e precisa ser investigada, sem atribuí-la automaticamente a snapshots ou à VM 100. Objetivo: evitar migração precipitada, distinguir NFS (arquivos) de iSCSI (blocos/LUN, eventualmente LVM em cima com regras de cluster) e diagnosticar pressão do thin pool antes de decisão. Não conectar NFS/iSCSI nem migrar, pois não existem nó destino, rede, export, LUN, autorização e backup comprovados no cenário. `local-lvm` é local apesar do nome; não assumir que snapshots liberam capacidade. Estado inicial/final: VM 100 permanece no `local-lvm` de `pve02`; CT 301 não é tocado; proposta de investigação e contenção.

Entradas/saídas **simuladas**:

```text
pve02# pvesm status
Name       Type     Status    Total      Used       Available
local      dir      active    104857600  31457280   73400320
local-lvm  lvmthin  active    209715200  199229440  10485760

pve02# lvs -o lv_name,vg_name,lv_size,data_percent,metadata_percent pve/data
  LV    VG   LSize    Data%  Meta%
  data  pve  200.00g  95.00  88.00

pve02# pvesm scan nfs 192.0.2.20
No exports found (simulazione: endpoint non configurato)

pve02# pvesm scan iscsi 192.0.2.30
No targets found (simulazione: endpoint non configurato)

pve02# qm config 100
scsi0: local-lvm:vm-100-disk-0,size=32G
```

IP `192.0.2.0/24` é bloco de documentação, sem servidor real. Saídas dos scans representam **ausência configurada no simulador**, não resultado geral de `pvesm scan` em qualquer instalação. `lvs -o` solicita colunas; `Data%`/`Meta%` referem-se ao thin pool, não uso dentro do guest e não equivalem a `pvesm status` de forma aritmética exata (aqui 95% está alinhado a 190/200 GiB; cabeçalho de `pvesm status` usa KiB no cenário). `pvesm scan nfs|iscsi` consulta; `qm config` lê disco. `pvesm help scan`, `lvs --help`, `qm help config` apenas ajuda. Resposta certa: segurar migração, verificar crescimento/snapshots/capacidade e infraestrutura alvo, proteger dados; depois escolher backend conforme necessidade e validar acesso de **todos** os nós. **Proibido:** dizer que iSCSI puro oferece snapshots PVE ou arquivos ISO, marcar share acessível só por haver IP, tratar LVM-thin local como compartilhado, ignorar Meta%, executar `qm migrate`, prometer live migration sem cluster/rede/storage e disponibilidade verificados.

| Quadro | Ação / evidência | Fala/legenda italiana proposta | Estado |
| --- | --- | --- | --- |
| P1-Q1 | Solicitação de migração da VM 100 sobre mesa com mapa de nós incompleto, sem repetir monitor de incidente | J: «Possiamo spostarla ora?» | demanda |
| P1-Q2 | Sênior vira monitor de capacidade `local-lvm` âmbar, não vermelho “falha” | S: «Prima guardiamo spazio e metadati.» | hipótese |
| P1-Q3 | Terminal `pvesm status` 95% e 10 GiB disponíveis, sem dizer disco do guest cheio | legenda `Pool locale · margine ridotto` | observado |
| P1-Q4 | Terminal `lvs` Data 95%, Meta 88%, índices diferentes | J: «Anche i metadati crescono.» | observado |
| P1-Q5 | Linha VM100 `scsi0: local-lvm...`, mapa `pve02` isolado | S: «Il disco è locale a pve02.» | observado |
| P1-Q6 | Portão `verifica capacità/backup/destinazione`, sem botão migrate | legenda `Migrazione sospesa` | decisão |
| P2-Q1 | NFS representado como share de arquivos com export ainda não configurado | J: «NFS condivide file, ma qui non c’è export.» | observado |
| P2-Q2 | `pvesm scan nfs 192.0.2.20`: No exports found | legenda `Endpoint didattico non configurato` | observado |
| P2-Q3 | iSCSI representado como LUN de blocos, sem pasta ISO | S: «iSCSI espone blocchi, non una cartella ISO.» | explicação |
| P2-Q4 | `pvesm scan iscsi 192.0.2.30`: No targets found | legenda `Nessun target visibile nel laboratorio` | observado |
| P2-Q5 | Júnior desenha matriz NFS/iSCSI com validação por nó e capacidade, sem repetição de cartões A/B/C | J: «Scelgo solo dopo i test su entrambi i nodi.» | proposto |
| P2-Q6 | Ticket INF-124 aberto: contenção thin pool e projeto storage compartilhado | S: «Niente migrazione finché manca la prova.» | pendente |

## Parecer e portões antes da arte

**ROTEIRO TÉCNICO PRONTO PARA PARECER CRUZADO; ARTE AINDA NÃO LIBERADA.** As quatro aulas agora têm incidente, comandos, saídas e estados coerentes para virar conteúdo interativo; nenhuma prancha deve ser gerada antes de a implementação dos laboratórios congelar esses valores e de o diretor de arte aprovar o storyboard. A aula 23 inclui troca e resilver **simulados** com verificação `ONLINE`, conforme o plano. O salto entre 22 (não cria pool) e 23 (pool existe) está declarado como provisionamento autorizado entre tickets. O revisor deve bloquear qualquer prancha que comprima scrub, troca e resilver em uma ação sem estado intermediário.

Riscos restantes para diretor de arte e revisor: `zpool status` é verboso para quadro; selecionar linhas exatas sem falsificar estado; símbolos mirror/RAIDZ2 não podem sugerir backup; `No known data errors` não equivale a dispositivo bom; NFS/iSCSI da aula 24 são endpoints não configurados no cenário; nenhuma migração, recuperação do CT 301, patch ou backup PBS ocorreu. A direção de arte deve reprovar storyboards que reutilizem a pose/função de quadros 17–20. O revisor independente ainda terá de aprovar cada prancha e o par antes da ativação.

## Parecer técnico cruzado sobre `DIRECAO_ARTE_MODULO_06_21-24.md`

Lido em 2026-10-02. **APROVÁVEL APÓS AJUSTES OBJETIVOS, NÃO LIBERADO PARA GERAÇÃO AGORA.** A gramática visual e a proibição de clonar 17–20 estão coerentes. Antes de imagem, o diretor precisa alinhar os seguintes quadros às saídas congeladas acima:

- **21 P2-Q2:** a arte não pode colocar a ficha ISO em destino correto como ação concluída antes de `pvesm list local --content iso`; representar a escolha como proposta ou deslocar a evidência filtrada antes dela. Em 21 P1-Q2, quatro tipos de storage são conceito; os únicos storages observados no cenário são `local` e `local-lvm`.
- **22 P1-Q4 e P2-Q4:** desenhar precisamente dois mirrors (01/02, 03/04) versus RAIDZ2 com quatro discos e ~2 TiB antes de overhead; mostrar que dois defeitos no mesmo mirror derrubam o primeiro arranjo. A arte não deve ilustrar uma falha real, pois o laboratório só planeja.
- **23 P1-Q4 e P2-Q2–Q6:** distinguir ID antigo `ata-LAB-03`, novo `/dev/disk/by-id/ata-LAB-05`, scrub, troca autorizada, `replacing-2` e avanço de tempo simulado até `ONLINE`. Uma linha temporal vazia em P2-Q1 pode ser usada, mas P2-Q2 não pode condensar scrub e replace como o mesmo comando. P2-Q6 deve mostrar `ONLINE` só depois do `zpool status` final, nunca check gerado no bitmap.
- **24 P2-Q1–Q4:** evidenciar `pvesm status` 95% do local-lvm e `lvs` Data 95%/Meta 88%, sem reutilizar 6G do CT 301; o gráfico de tendência P2-Q4 não existe no roteiro e deve ser apenas esquema sem curva de medições históricas. NFS/iSCSI são alternativas consultadas com resultado negativo no cenário, não storage disponível para a VM.

Após o diretor registrar esses ajustes e emitir parecer por aula, o roteirista pode marcar pré-produção `PRONTA`; mesmo assim é obrigatório implementar conteúdo interativo e passar revisão por prancha antes de ativar o módulo.

