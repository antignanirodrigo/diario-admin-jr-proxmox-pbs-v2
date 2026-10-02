// Bozza tecnica: l'arte e l'attivazione richiedono approvazione separata.
export const lesson22 = {
  id: 22, title: 'ZFS: pool, vdev e ridondanza locale', module: 'Archiviazione e integrità', duration: '60–80 min', xp: 320,
  summary: 'Confronta due mirror e RAIDZ2 su quattro dischi didattici, scegliendo il progetto che tollera qualsiasi coppia di guasti senza chiamarlo backup.',
  ticket: 'Ticket INF-122 · pve03 deve ricevere uno storage ZFS di laboratorio. Quattro dischi dati da 1 TiB sono elencati nell’inventario simulato. Il requisito è sopportare il guasto di qualsiasi coppia di dischi. Il disco di boot sda va escluso; seriali, SMART e finestra dovranno essere ricontrollati prima di creare il pool.',
  impact: 'Due mirror possono perdere il pool se due dischi dello stesso mirror cedono. RAIDZ2 a quattro dischi conserva tolleranza a qualsiasi coppia, ma resta nello stesso sito: cancellazione, compromissione e perdita del nodo richiedono protezioni indipendenti.',
  story: 'Il Junior contò quattro dischi e pensò che due mirror avrebbero sempre tollerato due guasti. Il Senior disegnò le coppie 01/02 e 03/04: «Se perdi entrambi i membri della stessa coppia, perdi quel vdev». Confrontarono il requisito con RAIDZ2 e scelsero un progetto, non un comando di creazione. Il registro lasciò verifiche fisiche e backup come prerequisiti.',
  concepts: [
    ['Pool e vdev', 'Il pool combina vdev; ogni vdev definisce una geometria di ridondanza che condiziona la sopravvivenza ai guasti.'],
    ['Due mirror', 'Con quattro dischi in due coppie, la capacità nominale prima degli overhead è circa 2 TiB; due guasti nello stesso mirror sono fatali.'],
    ['RAIDZ2', 'Con quattro dischi uguali offre doppia parità e tollera qualsiasi coppia di dischi; capacità nominale circa 2 TiB prima degli overhead.'],
    ['Ridondanza non è backup', 'Protegge disponibilità locale da alcuni guasti di dischi, non da cancellazione logica o perdita dell’intero sito.']
  ],
  analogy: 'Due ponti con due travi ciascuno possono reggere una trave persa per ponte, ma non la perdita di entrambe le travi dello stesso ponte. La parità doppia segue un’altra geometria.',
  recall: { question: 'Quale schema soddisfa il requisito di sopravvivere a qualsiasi coppia di guasti nel caso dei quattro dischi?', answer: 'RAIDZ2; due mirror non garantiscono la sopravvivenza se i due guasti colpiscono lo stesso mirror.' },
  lab: {
    context: 'Pianificazione simulata su pve03; nessun zpool create, partizionamento o intervento fisico. I dischi LAB e la loro condizione sono dati del ticket, non inventario reale.',
    steps: ['Identifica disco di boot e quattro dischi dati con lsblk.', 'Conferma che il pool tank-lab non esiste ancora.', 'Leggi inventario didattico e prerequisiti fisici.', 'Confronta due mirror e RAIDZ2 e registra solo il progetto proposto.'],
    commands: [
      { host: 'pve03', input: 'lsblk -o NAME,SIZE,TYPE,MOUNTPOINT', output: 'NAME  SIZE TYPE MOUNTPOINT\nsda   256G disk\n├─sda1   1G part /boot/efi\n└─sda2 255G part /\nsdb     1T disk\nsdc     1T disk\nsdd     1T disk\nsde     1T disk', key: 'blocks' },
      { host: 'pve03', input: 'zpool status', output: 'no pools available', key: 'pool', requires: ['blocks'] },
      { host: 'pve03', input: 'cat /srv/INF-122-inventario.txt', output: 'sdb=ata-LAB-01 1TiB vuoto (simulato)\nsdc=ata-LAB-02 1TiB vuoto (simulato)\nsdd=ata-LAB-03 1TiB vuoto (simulato)\nsde=ata-LAB-04 1TiB vuoto (simulato)\nBoot sda: ESCLUSO; confermare seriali e stato SMART prima di agire', key: 'inventory', requires: ['pool'] }
    ],
    choiceLabel: 'Progetto che soddisfa due guasti qualsiasi', choices: [
      { id: 'mirror', label: 'Due mirror 01/02 e 03/04: sempre resistenti a qualsiasi coppia' },
      { id: 'raidz2', label: 'RAIDZ2 su 01–04, con verifica fisica e backup ancora necessari' },
      { id: 'stripe', label: 'Stripe senza parità: tutta la capacità nominale' }
    ], correct: 'raidz2', success: 'RAIDZ2 proposto per il requisito di qualsiasi coppia. Nessun pool è stato creato; seriali, salute, finestra e copia indipendente restano prerequisiti.'
  },
  quizzes: [
    { question: 'Che cosa succede se cedono 01 e 02 nello stesso mirror?', options: ['Quel vdev perde tutti i membri e il pool non è disponibile', 'Il pool diventa automaticamente RAIDZ2', 'La capacità raddoppia'], correct: 0, why: 'La sopravvivenza di due mirror dipende da quali dischi falliscono; due nello stesso mirror eliminano il vdev.', analogy: 'Le due travi dello stesso ponte non possono mancare entrambe.' },
    { question: 'Quale protezione offre RAIDZ2 a quattro dischi nel caso proposto?', options: ['Sopporta la perdita del sito', 'Tollera qualsiasi coppia di dischi guasti', 'Sostituisce la prova di ripristino'], correct: 1, why: 'La doppia parità tollera due guasti di dischi del vdev, ma non è una copia separata né una prova di restore.', analogy: 'Due ruote di scorta non salvano il veicolo se il garage brucia.' },
    { question: 'Che cosa dimostra lsblk da solo?', options: ['Che ogni disco è sano e vuoto', 'Che il backup è valido', 'Nomi, dimensioni, tipi e mountpoint richiesti'], correct: 2, why: 'lsblk non certifica identità fisica, SMART o che un disco possa essere cancellato; serve verifica separata.', analogy: 'L’etichetta del cassetto non descrive lo stato di ciò che contiene.' }
  ],
  decision: { prompt: 'Il responsabile vuole creare subito tank-lab sui quattro nomi sdb–sde. Che cosa firmi?', options: [
    { id: 'create', label: 'Autorizzo zpool create senza verificare seriali e backup.', correct: false, why: 'Un nome di device non basta a escludere errore di disco; creare il pool è distruttivo.' },
    { id: 'plan', label: 'Approvo solo il disegno RAIDZ2 e richiedo seriali, SMART, finestra e copia indipendente.', correct: true, why: 'Il requisito di due guasti è soddisfatto dal progetto, ma l’esecuzione ha prerequisiti ulteriori.' },
    { id: 'mirror', label: 'Scelgo due mirror perché tollerano sempre qualsiasi coppia.', correct: false, why: 'Due guasti nella stessa coppia di mirror perdono un vdev.' }
  ] },
  procedure: ['Escludi il disco di boot e mappa gli ID persistenti dei quattro dischi dati.', 'Confronta geometria e combinazioni di guasto di due mirror e RAIDZ2.', 'Scegli RAIDZ2 per il requisito di due guasti qualsiasi e registra la capacità solo come stima.', 'Richiedi verifica SMART/seriali, finestra e backup indipendente prima di qualsiasi creazione.'],
  validation: 'Nel caso simulato pve03 mostra sda come boot e sdb–sde come dischi dati inventariati. zpool status indica che nessun pool esiste ancora. RAIDZ2 è la proposta coerente con due guasti qualsiasi; circa 2 TiB è stima nominale prima degli overhead. Nessun disco è stato cancellato, nessun pool creato, nessun backup o restore eseguito.',
  diaryPrompt: 'Disegna la geometria di due mirror e RAIDZ2, marca due guasti nello stesso mirror e lista le verifiche necessarie prima di creare un pool reale.',
  closing: 'Hai scelto una topologia conforme al rischio richiesto senza distruggere dati. La prossima lezione partirà da un pool creato in una modifica simulata separata e mostrerà come reagire a un device degradato.',
  images: []
};

