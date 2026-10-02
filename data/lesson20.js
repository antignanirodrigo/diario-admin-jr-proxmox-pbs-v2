export const lesson20 = {
  id: 20, title: 'Sicurezza e manutenzione di LXC', module: 'Container LXC', duration: '65–85 min', xp: 300,
  summary: 'Rivedi privilegi, mount, superficie del servizio e pacchetti prima di una finestra di manutenzione; non approvare un upgrade senza proteggere anche i dati bind.',
  ticket: 'Ticket INF-120 · CT 301 risponde dall’host e legge /srv/content dal bind mount della lezione 19. Una patch Nginx è disponibile. Il responsabile vuole applicarla oggi perché esiste uno snapshot del rootfs su local-lvm. Non risulta una copia indipendente della directory host né una prova di ripristino; la finestra non è stata approvata.',
  impact: 'Un aggiornamento può interrompere il servizio. Lo snapshot locale non copre la perdita dello storage e il contenuto del bind mount non entra nel backup vzdump del CT. `firewall=1` nella scheda di rete non dimostra da solo che regole e percorsi siano corretti.',
  story: 'Il Junior aveva già preparato apt-get upgrade -y. Il Senior gli mostrò tre righe: unprivileged: 1, mp0 in sola lettura e nessuna copia verificata della fonte host. «La simulazione dei pacchetti ci dice che cosa cambierà. Non ci dà una via di ritorno». Verificarono lo stato del servizio, l’esposizione locale e lo spazio, poi registrarono un piano: backup indipendente di rootfs e dati bind, ripristino provato, finestra autorizzata e controlli prima/dopo. L’upgrade restò pendente.',
  concepts: [
    ['Minimo privilegio', 'Mantieni CT non privilegiato, mount ro quando possibile e niente nesting o device aggiuntivi senza requisito documentato.'],
    ['Superficie del servizio', 'Processo active e porta 80 in ascolto sono prove locali; l’accesso dalla rete degli utenti richiede verifiche separate di regole e percorso.'],
    ['Anteprima dell’upgrade', 'apt-get -s upgrade simula la transazione dei pacchetti; mostra il piano, non installa aggiornamenti.'],
    ['Recupero completo', 'Proteggi il rootfs e la fonte host del bind mount con copie indipendenti, e prova un ripristino prima di promettere RTO/RPO.']
  ],
  analogy: 'Aggiornare senza copia del bind mount è cambiare il motore dopo aver fotografato solo il cruscotto: la parte essenziale del viaggio può restare fuori dalla prova.',
  recall: { question: 'Perché uno snapshot del rootfs non basta a dichiarare recuperabile il sito del CT 301?', answer: 'È sullo storage locale e non include il contenuto del bind mount host; servono copie indipendenti e ripristino provato.' },
  lab: {
    context: 'Audit simulato prima della manutenzione su pve02. Nessun upgrade, backup o ripristino viene eseguito. I documenti /srv/INF-120-* sono artefatti didattici del ticket, non percorsi standard PVE.',
    steps: ['Leggi la configurazione: unprivileged, mp0 ro e rete; non confondere firewall=1 con regole verificate.', 'Controlla processo e porta in ascolto solo nel CT, stato del rootfs e piano di pacchetti.', 'Leggi il piano di protezione: rootfs e contenuto bind hanno rischi diversi.', 'Scegli se approvare la patch ora o preparare copie, restore e finestra prima di agire.'],
    commands: [
      { host: 'pve02', input: 'pct config 301', output: 'hostname: web-int-ct\nunprivileged: 1\ncores: 2\nmemory: 1024\nrootfs: local-lvm:vm-301-disk-0,size=8G\nmp0: /mnt/bindmounts/web-int,mp=/srv/content,ro=1\nnet0: name=eth0,bridge=vmbr0,ip=10.10.10.31/24,gw=10.10.10.1,firewall=1', key: 'config' },
      { host: 'pve02', input: 'pct status 301', output: 'status: running', key: 'status', requires: ['config'] },
      { host: 'pve02', input: 'pct exec 301 -- systemctl is-active nginx', output: 'active', key: 'service', requires: ['status'] },
      { host: 'pve02', input: 'pct exec 301 -- ss -ltn', output: 'State  Recv-Q Send-Q Local Address:Port Peer Address:Port\nLISTEN 0      511    0.0.0.0:80         0.0.0.0:*', key: 'listener', requires: ['service'] },
      { host: 'pve02', input: 'pct exec 301 -- df -h /', output: 'Filesystem                            Size Used Avail Use% Mounted on\n/dev/mapper/pve-vm--301--disk--0        8G   2G   6G   25% /', key: 'disk', requires: ['listener'] },
      { host: 'pve02', input: 'pct exec 301 -- apt-get update', output: 'Le liste dei pacchetti sono state aggiornate nel CT 301 (simulazione). Nessun pacchetto installato.', key: 'indexes', requires: ['disk'] },
      { host: 'pve02', input: 'pct exec 301 -- apt-get -s upgrade', output: 'Simulazione: 3 pacchetti verrebbero aggiornati, incluso nginx; 0 installati ora.', key: 'plan', requires: ['indexes'] },
      { host: 'pve02', input: 'cat /srv/INF-120-protezione.txt', output: 'Snapshot locale rootfs: presente, non copia indipendente\nBind mount /mnt/bindmounts/web-int: nessuna copia esterna verificata\nProva di ripristino CT + dati bind: assente', key: 'protection', requires: ['plan'] },
      { host: 'pve02', input: 'cat /srv/INF-120-finestra.txt', output: 'Finestra di manutenzione: non approvata\nTest da utenti remoti: pendente\nPiano di ritorno e proprietario: da documentare', key: 'window', requires: ['protection'] }
    ],
    choiceLabel: 'Autorizzi l’upgrade ora?', choices: [
      { id: 'now', label: 'Sì: snapshot locale del rootfs e processo active bastano.' },
      { id: 'prepare', label: 'No: preparo copie indipendenti di rootfs e bind, provo restore e concordo la finestra.' },
      { id: 'privilege', label: 'Sì, ma prima abilito nesting e privilegi per rendere il CT più flessibile.' }
    ], correct: 'prepare', success: 'Upgrade rinviato: sono documentati esposizione locale, piano pacchetti e lacune di protezione. Backup indipendenti, restore, finestra e prova utenti restano azioni da eseguire.'
  },
  quizzes: [
    { question: 'Che cosa prova `apt-get -s upgrade`?', options: ['I pacchetti che verrebbero aggiornati senza installarli', 'Che il restore dei dati bind funziona', 'Che la finestra è approvata'], correct: 0, why: 'L’opzione -s simula la transazione. Non cambia i pacchetti e non verifica recupero o autorizzazione.', analogy: 'È una lista della spesa, non la consegna e neppure la garanzia.' },
    { question: 'Che cosa significa `firewall=1` in net0?', options: ['Tutte le regole e i percorsi sono validati', 'Il firewall PVE è abilitato per l’interfaccia, ma servono regole e test', 'Il sito è raggiungibile da ogni utente'], correct: 1, why: 'L’opzione abilita il punto di applicazione; non dimostra da sola che policy e percorso da ogni origine siano corretti.', analogy: 'Mettere un guardiano alla porta non dice a chi farà passare.' },
    { question: 'Quale parte rimane fuori dal backup vzdump del CT quando mp0 è bind mount?', options: ['Il rootfs gestito', 'Le opzioni del CT', 'Il contenuto della directory host montata'], correct: 2, why: 'I file del bind mount non sono volume PVE gestito nel backup CT; vanno protetti separatamente.', analogy: 'La scheda del magazzino non contiene la merce.' }
  ],
  decision: { prompt: 'La patch è urgente, ma mancano copia del bind e restore provato. Quale approvazione firmi?', options: [
    { id: 'sign', label: 'Approvo subito l’upgrade: lo snapshot locale garantisce il ritorno.', correct: false, why: 'Lo snapshot non protegge il bind mount e può andare perso con lo stesso storage.' },
    { id: 'gate', label: 'Autorizzo solo la preparazione: copie indipendenti, restore testato, finestra e verifiche prima/dopo.', correct: true, why: 'Il gate distingue anteprima da modifica e protegge tutti i dati necessari al servizio.' },
    { id: 'skip', label: 'Rimuovo mp0 e abilito il CT privilegiato così il backup sarà completo.', correct: false, why: 'Cambiare privilegi e rimuovere dati non è un piano di recupero e può interrompere il sito.' }
  ] },
  procedure: ['Inventaria privilegi, mp0, rete, servizio, listener e spazio prima della modifica.', 'Aggiorna gli indici e simula la transazione; leggi l’elenco dei pacchetti senza eseguire l’upgrade.', 'Prepara backup indipendente di rootfs e fonte bind, con test di ripristino e responsabilità chiare.', 'Ottieni finestra, verifica accesso utenti e definisci controlli post-patch e ritorno prima di autorizzare la modifica.'],
  validation: 'Nel caso CT 301 è running, unprivileged=1, mp0 ro=1, nginx active e porta 80 ascolta nel CT. Il rootfs mostra 6G disponibili e l’anteprima elenca tre pacchetti, ma nessuno è aggiornato. Lo snapshot locale non è copia indipendente; i dati del bind mount non hanno copia esterna verificata né restore testato. La finestra manca e l’accesso degli utenti remoti resta pendente. Nessun backup, upgrade o ripristino è stato eseguito.',
  diaryPrompt: 'Scrivi il piano di manutenzione con prerequisiti misurabili: copie del rootfs e del bind, prova di ripristino, finestra, verifica utenti, controlli post-patch e responsabile del ritorno.',
  closing: 'Hai chiuso il modulo LXC con un gate operativo verificabile: aggiornare è una decisione dopo prova di recupero, non dopo un solo indicatore verde.',
  images: ['assets/aula-20-p1-v5.png', 'assets/aula-20-p2-v3.png']
};

