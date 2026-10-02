export const lesson18 = {
  id: 18, title: 'Creare e verificare un LXC non privilegiato', module: 'Container LXC', duration: '70–90 min', xp: 300,
  summary: 'Controlla capacità e template, crea il CT 301 non privilegiato e verifica configurazione, rete e servizio dall’interno e dall’host.',
  ticket: 'Ticket INF-118 · Il sito interno Linux del caso B è stato approvato per una prova su pve02. Serve un container Debian 301 sulla rete di laboratorio, con Nginx raggiungibile dall’host. Nella lezione precedente local aveva solo 1G libero: prima di scaricare il template devi misurare lo spazio e tenere il disco root su local-lvm.',
  impact: 'Un download sullo storage sbagliato può esaurire local; un CT privilegiato amplia il rischio; un indirizzo o bridge errato fa sembrare guasto il servizio. Lo stato running da solo non prova che Nginx risponda sulla rete.',
  story: 'Il Junior stava per premere Create. Il Senior fermò la mano sul ticket: «Prima spazio, poi template, poi privilegi e rete. Il verde di running non è ancora la pagina HTTP». Il catalogo simulato offriva un template Debian da 140 MB; local aveva 1G libero e local-lvm restava il deposito del rootfs. Crearono il CT 301 non privilegiato, installarono Nginx nel laboratorio e lo interrogarono dall’host. La prova vale solo per il percorso del laboratorio, non per utenti remoti.',
  concepts: [
    ['Template LXC', 'Archivio di sistema scaricato con pveam; il nome esatto va letto dal catalogo del nodo, non indovinato.'],
    ['Rootfs e storage', 'Il template va su local; il filesystem del CT va su local-lvm. Capacità e margine vanno verificati separatamente.'],
    ['Container non privilegiato', 'Con --unprivileged 1 gli UID/GID del CT sono mappati su ID non privilegiati dell’host; non equivale a una VM.'],
    ['Prova del servizio', 'pct status e pct exec verificano CT e processo; una richiesta HTTP dall’host conferma una parte del percorso di rete.']
  ],
  analogy: 'Il template è il progetto, il rootfs è lo spazio costruito e il servizio è la porta aperta: vedere l’edificio non dimostra che la porta risponda.',
  recall: { question: 'Perché controlli local prima di scaricare il template, anche se il rootfs del CT sarà su local-lvm?', answer: 'Il file del template viene scaricato su local, che nella lezione 16 aveva 1G libero; template e rootfs occupano storage diversi.' },
  lab: {
    context: 'Simulazione didattica su pve02: catalogo e template Debian del caso sono fittizi ma la sintassi pct/pveam segue PVE. I comandi non modificano server reali. La prova HTTP parte dall’host, non da una rete utente esterna.',
    steps: ['Misura local e local-lvm; verifica che 140 MB di template lascino margine sul local da 1G.', 'Consulta il catalogo e scarica il nome mostrato, quindi conferma il volume locale.', 'Crea CT 301 non privilegiato, rootfs su local-lvm, rete vmbr0 e avvialo.', 'Installa Nginx nel laboratorio, osserva servizio e prova HTTP dall’host; non attribuire questa prova a utenti remoti.'],
    initialRuntime: { ct301: 'absent', template301: false, nginx301: false },
    expectedRuntime: { ct301: 'running', template301: true, nginx301: true },
    commands: [
      { host: 'pve02', input: 'pvesm status', output: 'Name        Type    Status   Total   Used   Available\nlocal       dir     active   100G    99G    1G\nlocal-lvm   lvmthin active   800G   260G  540G', key: 'capacity' },
      { host: 'pve02', input: 'pveam available --section system', output: 'system  debian-13-standard_13.1-1_amd64.tar.zst  140M  [catalogo simulato]', key: 'catalog', requires: ['capacity'] },
      { host: 'pve02', input: 'pveam download local debian-13-standard_13.1-1_amd64.tar.zst', output: 'download complete: local:vztmpl/debian-13-standard_13.1-1_amd64.tar.zst (140M)\nlocal: circa 860M liberi nel caso simulato', key: 'download', requires: ['catalog'], setRuntime: { template301: true } },
      { host: 'pve02', input: 'pveam list local', output: 'NAME                                                       SIZE\nlocal:vztmpl/debian-13-standard_13.1-1_amd64.tar.zst        140M', key: 'template', requires: ['download'] },
      { host: 'pve02', input: 'pct create 301 local:vztmpl/debian-13-standard_13.1-1_amd64.tar.zst --hostname web-int-ct --unprivileged 1 --cores 2 --memory 1024 --rootfs local-lvm:8 --net0 name=eth0,bridge=vmbr0,ip=10.10.10.31/24,gw=10.10.10.1,firewall=1', output: 'CT 301 created (stopped); rootfs 8G on local-lvm; unprivileged: 1', key: 'create', requires: ['template'], requiresRuntime: { template301: true, ct301: 'absent' }, setRuntime: { ct301: 'stopped' } },
      { host: 'pve02', input: 'pct config 301', output: 'hostname: web-int-ct\nunprivileged: 1\ncores: 2\nmemory: 1024\nrootfs: local-lvm:vm-301-disk-0,size=8G\nnet0: name=eth0,bridge=vmbr0,ip=10.10.10.31/24,gw=10.10.10.1,firewall=1', key: 'config', requires: ['create'] },
      { host: 'pve02', input: 'pct start 301', output: 'CT 301 started', key: 'start', requires: ['config'], requiresRuntime: { ct301: 'stopped' }, setRuntime: { ct301: 'running' } },
      { host: 'pve02', input: 'pct status 301', output: 'status: running', key: 'status', requires: ['start'], requiresRuntime: { ct301: 'running' } },
      { host: 'pve02', input: 'pct exec 301 -- ip -br address', output: 'lo    UNKNOWN  127.0.0.1/8\neth0  UP       10.10.10.31/24', key: 'insideNet', requires: ['status'], requiresRuntime: { ct301: 'running' } },
      { host: 'pve02', input: 'pct exec 301 -- apt-get update', output: 'Le liste dei pacchetti sono state aggiornate nel CT 301 (simulazione).', key: 'packages', requires: ['insideNet'] },
      { host: 'pve02', input: 'pct exec 301 -- apt-get install -y nginx', output: 'nginx installato nel CT 301 (simulazione); servizio avviato.', key: 'install', requires: ['packages'], setRuntime: { nginx301: true } },
      { host: 'pve02', input: 'pct exec 301 -- systemctl is-active nginx', output: 'active', key: 'service', requires: ['install'], requiresRuntime: { nginx301: true } },
      { host: 'pve02', input: 'curl -I http://10.10.10.31/', output: 'HTTP/1.1 200 OK\nServer: nginx', key: 'http', requires: ['service'], requiresRuntime: { ct301: 'running', nginx301: true } }
    ],
    choiceLabel: 'Quale stato puoi dichiarare?', choices: [
      { id: 'ready-global', label: 'Il sito è pronto per tutti gli utenti e il backup è validato: HTTP 200 basta.' },
      { id: 'measured', label: 'CT 301 non privilegiato e Nginx rispondono nel laboratorio; accesso remoto e recupero restano da provare.' },
      { id: 'privileged', label: 'Riavvio il CT privilegiato per evitare futuri problemi di permessi.' }
    ], correct: 'measured', success: 'CT 301 running, unprivileged=1, servizio active e HTTP 200 dall’host. Accesso utenti, backup e ripristino non sono stati testati.'
  },
  quizzes: [
    { question: 'Dove occupa spazio il template scaricato con pveam download local?', options: ['Su local', 'Solo su local-lvm', 'Nel PBS'], correct: 0, why: 'La destinazione esplicita del download è local; il rootfs da 8G viene allocato separatamente su local-lvm.', analogy: 'Il progetto resta in archivio; la costruzione usa un altro terreno.' },
    { question: 'Che cosa verifica --unprivileged 1 nella configurazione del CT?', options: ['Una VM con kernel proprio', 'La mappatura non privilegiata degli ID del container', 'Un backup automatico su PBS'], correct: 1, why: 'Il CT usa un mapping UID/GID non privilegiato. Ciò non crea un kernel indipendente e non configura backup.', analogy: 'La chiave ha permessi limitati, ma resta nello stesso edificio.' },
    { question: 'Che cosa NON prova curl -I dall’host?', options: ['La risposta HTTP nel percorso host→CT', 'Che Nginx risponde nel laboratorio', 'L’accesso dalla rete degli utenti e il ripristino'], correct: 2, why: 'La richiesta parte da pve02. Non misura firewall, routing degli utenti o recuperabilità dei dati.', analogy: 'Aprire la porta dall’interno non dimostra che il visitatore possa arrivare dalla strada.' }
  ],
  decision: { prompt: 'Il responsabile vede HTTP 200 e chiede di chiudere il ticket come produzione pronta. Come rispondi?', options: [
    { id: 'close', label: 'Chiudo: il CT running e HTTP 200 garantiscono servizio e recupero.', correct: false, why: 'La prova è limitata all’host e non include utenti remoti, backup o ripristino.' },
    { id: 'scope', label: 'Registro la prova host→CT e mantengo pendenti accesso utenti, backup e ripristino.', correct: true, why: 'Il rapporto distingue ciò che è stato osservato da ciò che resta da misurare.' },
    { id: 'priv', label: 'Cambio il CT a privilegiato per accelerare la consegna.', correct: false, why: 'Non risolve prove mancanti e amplia la superficie di rischio senza necessità.' }
  ] },
  procedure: ['Misura spazio e margine sullo storage destinato al template e al rootfs.', 'Leggi il catalogo pveam, scarica il nome effettivamente disponibile e conferma il volume.', 'Crea il CT con --unprivileged 1, risorse e rete esplicite; verifica pct config prima di avviare.', 'Controlla stato, IP e servizio dall’interno e HTTP dall’host; documenta il perimetro della prova.'],
  validation: 'Nel simulatore local aveva 1G libero e il template da 140M lascia circa 860M; il rootfs da 8G è su local-lvm. pct config 301 mostra unprivileged: 1 e vmbr0/10.10.10.31; il CT passa da stopped a running. Nginx è active e curl dall’host riceve HTTP 200. Nessun utente remoto, backup o ripristino è stato validato.',
  diaryPrompt: 'Annota storage del template e del rootfs, mapping dei privilegi, rete e prova HTTP. Specifica chi ha originato la richiesta e cosa resta fuori dal test.',
  closing: 'Hai avviato e verificato il primo LXC senza confondere running con servizio pronto per tutti. La prossima lezione investiga un bind mount e gli ID mappati.',
  images: ['assets/aula-18-p1-v5.png', 'assets/aula-18-p2-v7.png']
};

