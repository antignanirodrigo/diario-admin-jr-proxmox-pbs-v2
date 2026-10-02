// Bozza tecnica: nessuna migrazione o storage di rete viene attivato.
export const lesson24 = {
  id: 24, title: 'Storage condiviso e pressione di capacità', module: 'Archiviazione e integrità', duration: '65–85 min', xp: 340,
  summary: 'Distingui NFS e iSCSI, leggi pressione di dati/metadati nel thin pool e sospendi una migrazione senza destinazione condivisa verificata.',
  ticket: 'Ticket INF-124 · Si propone di migrare la VM 100 da pve02 a un altro nodo. Fra INF-121 e questo ticket l’occupazione di local-lvm è aumentata; la causa resta da indagare. Il disco VM è ancora locale; il thin pool arriva al 95% dei dati e all’88% dei metadati. Gli endpoint didattici NFS e iSCSI non sono configurati e il nodo destinatario non è stato validato.',
  impact: 'Un thin pool quasi pieno può restituire errori I/O ai guest e compromettere i dati. Uno storage dichiarato shared senza rete, server e accesso da entrambi i nodi non rende sicura una migrazione. NFS e iSCSI richiedono modelli operativi diversi.',
  story: 'Il Junior disegnò una freccia di migrazione da pve02. Il Senior mostrò due percentuali: «95% dei dati e 88% dei metadati. E il disco della VM è locale». Cercarono export NFS e target iSCSI; nel laboratorio nessuno era configurato. Registrarono la necessità di contenere la pressione e progettare l’accesso condiviso, lasciando la VM dov’era.',
  concepts: [
    ['NFS', 'Backend a file condiviso tramite export; può conservare diversi tipi di contenuto, ma richiede server, export e accesso verificati.'],
    ['iSCSI', 'Espone LUN a blocchi; non è una cartella ISO e il protocollo da solo non gestisce allocazione di volumi PVE.'],
    ['LVM-thin locale', 'local-lvm supporta dischi VM e CT, ma il thin pool non è storage condiviso tra nodi.'],
    ['Dati e metadati', 'Sono metriche distinte di un thin pool; esaurimento dello spazio può produrre errori I/O, perciò servono margine e monitoraggio.']
  ],
  analogy: 'Una corsia condivisa funziona soltanto se entrambi gli edifici hanno accesso alla stessa strada. Il cartello “condiviso” non costruisce il collegamento, e un serbatoio al 95% non diventa più grande spostando il cartello.',
  recall: { question: 'Perché la VM 100 non viene migrata nel caso INF-124?', answer: 'Il disco resta su local-lvm locale, i target NFS/iSCSI non sono configurati e la capacità thin è sotto pressione; manca prova di destinazione condivisa e sicura.' },
  lab: {
    context: 'Diagnosi simulata su pve02. 192.0.2.20 e 192.0.2.30 sono indirizzi di documentazione senza server reali. Nessun comando migra, monta o crea storage.',
    steps: ['Leggi stato e capacità di local-lvm.', 'Confronta Data% e Meta% del thin pool con lo spazio PVE.', 'Consulta export NFS e target iSCSI didattici senza configurarli.', 'Leggi disco VM 100 e scegli contenimento/progetto prima di migrazione.'],
    commands: [
      { host: 'pve02', input: 'pvesm status', output: 'Name       Type     Status    Total      Used       Available\nlocal      dir      active    104857600  31457280   73400320\nlocal-lvm  lvmthin  active    209715200  199229440  10485760', key: 'status' },
      { host: 'pve02', input: 'lvs -o lv_name,vg_name,lv_size,data_percent,metadata_percent pve/data', output: '  LV    VG   LSize    Data%  Meta%\n  data  pve  200.00g  95.00  88.00', key: 'thin', requires: ['status'] },
      { host: 'pve02', input: 'pvesm scan nfs 192.0.2.20', output: 'No exports found (simulazione: endpoint non configurato)', key: 'nfs', requires: ['thin'] },
      { host: 'pve02', input: 'pvesm scan iscsi 192.0.2.30', output: 'No targets found (simulazione: endpoint non configurato)', key: 'iscsi', requires: ['nfs'] },
      { host: 'pve02', input: 'qm config 100', output: 'scsi0: local-lvm:vm-100-disk-0,size=32G', key: 'vm', requires: ['iscsi'] }
    ],
    choiceLabel: 'Quale decisione operativa prendi adesso?', choices: [
      { id: 'migrate', label: 'Migro subito: il nome local-lvm significa condiviso' },
      { id: 'hold', label: 'Sospendo la migrazione, affronto la pressione thin e verifico un progetto shared per entrambi i nodi' },
      { id: 'iscsi-iso', label: 'Monto l’ISO direttamente su iSCSI e considero risolto lo spazio' }
    ], correct: 'hold', success: 'Migrazione sospesa: VM 100 resta su pve02. Pressione dati/metadati e assenza di export/target sono documentate; progettazione e verifica restano da fare.'
  },
  quizzes: [
    { question: 'Che cosa indica Meta% nella lettura lvs del thin pool?', options: ['Occupazione dei metadati del pool', 'Spazio libero dentro la VM', 'Qualità del backup PBS'], correct: 0, why: 'Meta% è una metrica del pool LVM-thin, distinta dai dati allocati e dallo spazio del filesystem guest.', analogy: 'L’indice del magazzino occupa spazio diverso dalle scatole.' },
    { question: 'Che cosa fornisce iSCSI puro al nodo?', options: ['Una directory condivisa di ISO', 'LUN a blocchi, senza gestione PVE automatica dello spazio da solo', 'Un backup verificato'], correct: 1, why: 'iSCSI espone dispositivi a blocchi; spesso serve un livello come LVM sopra la LUN per gestire volumi.', analogy: 'Consegna un terreno, non gli scaffali già organizzati.' },
    { question: 'Che cosa dimostrano gli scan NFS/iSCSI del caso?', options: ['Che entrambi sono pronti alla migrazione', 'Che local-lvm è shared', 'Che gli endpoint didattici non espongono export/target nel simulatore'], correct: 2, why: 'Il risultato negativo è limitato agli indirizzi fittizi del caso; non è un giudizio universale sui protocolli.', analogy: 'Una porta chiusa qui non significa che tutte le porte siano chiuse.' }
  ],
  decision: { prompt: 'Il responsabile chiede una live migration oggi. Quale risposta è sostenuta dalle evidenze?', options: [
    { id: 'promise', label: 'Prometto la migrazione: pvesm status mostra active.', correct: false, why: 'active non prova storage shared né accesso dal destinatario; la capacità è critica.' },
    { id: 'pause', label: 'Sospendo, contengo il rischio del thin pool e richiedo destinazione, rete e accesso validati.', correct: true, why: 'Separa diagnosi misurata da progetto/operazione ancora non eseguiti.' },
    { id: 'rename', label: 'Rinomino local-lvm in shared e avvio la VM altrove.', correct: false, why: 'Un nome o flag non rende fisicamente condiviso un pool LVM-thin locale.' }
  ] },
  procedure: ['Leggi capacità PVE e Data%/Meta% del thin pool.', 'Conferma dove risiede il disco della VM 100.', 'Consulta export e target di rete, poi valida server, rete e accesso da entrambi i nodi prima di progetto condiviso.', 'Tratta la pressione di capacità e proteggi i dati prima di autorizzare una migrazione.'],
  validation: 'Nel caso simulato local-lvm è active ma locale; pvesm status mostra 10 GiB disponibili su 200 GiB, lvs Data 95% e Meta 88%. La VM 100 usa local-lvm. Gli endpoint documentali NFS/iSCSI non espongono export/target. Nessuna migrazione, mount, LUN, backup o espansione è stata eseguita.',
  diaryPrompt: 'Registra Data%, Meta%, volume della VM, esito dei due scan e quali prove mancano per autorizzare una migrazione condivisa.',
  closing: 'Hai chiuso il modulo distinguendo infrastruttura condivisa progettata da capacità reale osservata. Il prossimo modulo tratterà cluster e disponibilità senza promettere HA da un semplice nome di storage.',
  images: []
};

