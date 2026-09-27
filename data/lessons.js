import { module02 } from './lessons-module-02.js';
import { module03 } from './lessons-module-03.js';

export const lessons = [
  {
    id: 1,
    title: 'Che cosa risolvono Proxmox VE e PBS',
    module: 'Fondamenti e progetto del laboratorio',
    duration: '35–45 min',
    xp: 100,
    summary: 'Distingui hypervisor, macchina virtuale, container e server di backup prima di progettare il laboratorio.',
    ticket: 'Ticket INF-101 · La filiale deve ospitare un gestionale e poter recuperare i dati dopo il guasto del nodo. Un collega propone di salvare una copia sullo stesso disco del server. Devi identificare i ruoli dei componenti e presentare un percorso di ripristino credibile.',
    impact: 'Se il backup dipende dallo stesso host che può guastarsi, la perdita del nodo può rendere indisponibili sia il servizio sia la sua copia.',
    story: 'Il Junior osservò il rack e chiese: «Se la VM gira su Proxmox, non basta uno snapshot?». Il Senior aprì il diagramma dell’incidente: «Uno snapshot locale aiuta a tornare indietro durante una modifica. Se perdiamo il nodo o lo storage, ci serve una copia recuperabile altrove. Prima separiamo i ruoli, poi scegliamo gli strumenti».',
    concepts: [
      ['Proxmox VE', 'Gestisce host, VM KVM, container LXC, rete e storage delle applicazioni.'],
      ['Proxmox Backup Server', 'Riceve e organizza backup, verifica l’integrità e consente il ripristino dei dati.'],
      ['Snapshot', 'Punto di ritorno legato allo storage e alla disponibilità dell’ambiente che lo ospita.'],
      ['Backup recuperabile', 'Copia con una procedura di ripristino verificata, idealmente separata dal guasto principale.']
    ],
    analogy: 'PVE è l’edificio in cui lavorano i servizi; PBS è l’archivio di emergenza in un luogo separato. Una fotografia dell’ufficio non ricostruisce l’edificio dopo un incendio.',
    recall: { question: 'Quale prodotto ospita la VM e quale conserva i suoi backup?', answer: 'Proxmox VE ospita e gestisce la VM; Proxmox Backup Server conserva e gestisce le copie da cui ripristinarla.' },
    lab: {
      context: 'Console simulate dei nodi pve01 e pbs01. Nessun comando tocca macchine reali.',
      steps: ['Esamina versione e carichi del nodo PVE.', 'Esamina la versione del nodo PBS.', 'Scegli l’architettura che separa servizio e backup.', 'Convalida la scelta e leggi l’evidenza.'],
      commands: [
        { host: 'pve01', input: 'pveversion -v', output: 'proxmox-ve: 9.2\npve-manager: 9.2\nNodo: pve01', key: 'pveVersion' },
        { host: 'pve01', input: 'qm list', output: 'VMID  NAME          STATUS\n100   gestionale    running', key: 'vmList' },
        { host: 'pbs01', input: 'proxmox-backup-manager versions', output: 'proxmox-backup-server: 4.2\nNodo: pbs01', key: 'pbsVersion' }
      ],
      choiceLabel: 'Architettura proposta',
      choices: [
        { id: 'same-disk', label: 'VM e unica copia sullo stesso disco di pve01' },
        { id: 'separate-pbs', label: 'VM su pve01 e backup su pbs01 separato' },
        { id: 'snapshot-only', label: 'Solo snapshot locale della VM' }
      ],
      correct: 'separate-pbs',
      success: 'Ruoli separati: pve01 eroga il servizio; pbs01 conserva una copia da verificare e ripristinare.'
    },
    quizzes: [
      { question: 'Quale componente esegue la VM del gestionale?', options: ['PBS', 'PVE', 'Il browser dell’operatore'], correct: 1, why: 'PVE gestisce la VM KVM; PBS è il server dedicato ai backup.', analogy: 'La VM lavora nell’edificio, non nell’archivio.' },
      { question: 'Perché uno snapshot locale non basta contro la perdita del nodo?', options: ['Perché dipende dall’infrastruttura locale', 'Perché spegne sempre la VM', 'Perché usa soltanto la rete'], correct: 0, why: 'La perdita dell’host o dello storage può rendere indisponibile anche lo snapshot.', analogy: 'Una foto conservata dentro l’edificio perso non è il piano di emergenza.' },
      { question: 'Quando un backup offre una prova operativa di recuperabilità?', options: ['Quando il file ha un nome corretto', 'Quando la barra arriva al 100%', 'Quando integrità e ripristino sono verificati'], correct: 2, why: 'Il successo del job da solo non dimostra che il servizio tornerà utilizzabile.', analogy: 'Un estintore acquistato va anche controllato e provato.' }
    ],
    decision: { prompt: 'Il responsabile vuole ridurre i costi eliminando pbs01. Quale risposta presenti?', options: [
      { id: 'approve', label: 'Approvo: gli snapshot locali sono equivalenti a un backup separato.', correct: false, why: 'La perdita del nodo potrebbe eliminare servizio e punto di ritorno.' },
      { id: 'explain', label: 'Spiego il rischio e mantengo una copia recuperabile fuori dal guasto del nodo.', correct: true, why: 'La decisione lega l’architettura al rischio reale di indisponibilità.' },
      { id: 'ignore', label: 'Non documento nulla finché non avviene un incidente.', correct: false, why: 'Senza piano e prova, non esiste un tempo di recupero affidabile.' }
    ] },
    procedure: ['Identifica i servizi e i dati da proteggere.', 'Distingui host di produzione, storage e destinazione dei backup.', 'Verifica che la destinazione sopravviva al guasto considerato.', 'Prevedi verifica d’integrità e prova di ripristino.'],
    validation: 'Evidenze: versione PVE, VM presente, versione PBS e architettura separata con ruoli espliciti. Non abbiamo ancora eseguito un backup: arriverà nel modulo PBS.',
    diaryPrompt: 'Annota che cosa gira su PVE, che cosa conserva PBS e quale guasto rimane scoperto da uno snapshot locale.',
    closing: 'Hai separato produzione e protezione. Nella prossima lezione sceglierai un host capace di sostenere davvero i carichi previsti.',
    images: ['assets/aula-01.png', 'assets/aula-01-p2-hq-v3.png']
  },
  {
    id: 2,
    title: 'Hardware e limiti reali della virtualizzazione',
    module: 'Fondamenti e progetto del laboratorio',
    duration: '35–45 min',
    xp: 120,
    summary: 'Valuta CPU, memoria, dischi e rete prima di approvare un host PVE per due VM e un container.',
    ticket: 'Ticket INF-102 · Tre server sono disponibili per il laboratorio. Il gestionale richiede 8 GiB, il database 12 GiB e i servizi ausiliari 4 GiB, oltre alla memoria del nodo. Devi scegliere un host con virtualizzazione hardware attiva e margine operativo.',
    impact: 'Un host senza accelerazione hardware o con RAM quasi esaurita può impedire l’avvio delle VM o provocare forte pressione di memoria durante il carico.',
    story: 'Il Junior indicò il server più economico. Il Senior gli chiese di sommare la memoria richiesta e di controllare il firmware. «Il prezzo non ci dice se KVM può partire. E 24 GiB assegnati su 24 GiB fisici non lasciano spazio al sistema, alla cache né agli imprevisti».',
    concepts: [
      ['VT-x / AMD-V', 'Estensioni della CPU necessarie alla virtualizzazione KVM accelerata.'],
      ['RAM disponibile', 'Capacità fisica da ripartire tra host, VM, container, cache e margine operativo.'],
      ['Ridondanza dei dischi', 'Continuità locale in caso di guasto di un disco; non sostituisce i backup.'],
      ['Capacità di rete', 'Banda e interfacce coerenti con gestione, applicazioni e flusso di backup.']
    ],
    analogy: 'Un camion può avere un motore potente, ma se il carico occupa già tutto lo spazio e non restano freni affidabili, non è pronto per il viaggio.',
    recall: { question: 'Perché 24 GiB di RAM fisica non bastano per assegnare 24 GiB ai carichi?', answer: 'Anche il nodo, i servizi di gestione, la cache e i picchi hanno bisogno di memoria. Serve un margine operativo misurato.' },
    lab: {
      context: 'Console simulata di inventario hardware del datacenter. Il profilo selezionato viene approvato solo dopo l’audit.',
      steps: ['Leggi l’inventario dei tre server.', 'Controlla accelerazione CPU, RAM e dischi del candidato.', 'Seleziona il server che lascia margine operativo.', 'Convalida la scelta tecnica.'],
      commands: [
        { host: 'inventario', input: 'cat /srv/inventario-host.txt', output: 'A: 24 GiB RAM, VT-x disattivato, 1 disco\nB: 64 GiB RAM ECC, AMD-V attivo, 2 SSD mirror, 2 NIC\nC: 32 GiB RAM, AMD-V attivo, 1 disco, 1 NIC', key: 'inventory' },
        { host: 'inventario', input: 'lscpu', output: 'Architecture: x86_64\nCPU(s): 16\nVirtualization: AMD-V', key: 'cpu' },
        { host: 'inventario', input: 'free -h', output: '              total   used   free   available\nMem:           64Gi   3Gi   59Gi   59Gi', key: 'memory' },
        { host: 'inventario', input: 'lsblk -o NAME,SIZE,TYPE', output: 'NAME       SIZE TYPE\nnvme0n1   960G disk\nnvme1n1   960G disk', key: 'disks' }
      ],
      choiceLabel: 'Host da approvare',
      choices: [
        { id: 'A', label: 'Server A · 24 GiB, VT-x disattivato, disco singolo' },
        { id: 'B', label: 'Server B · 64 GiB ECC, AMD-V attivo, due SSD, due NIC' },
        { id: 'C', label: 'Server C · 32 GiB, AMD-V attivo, disco singolo' }
      ],
      correct: 'B',
      success: 'Server B approvato: 24 GiB richiesti dai carichi e margine residuo per host e crescita. Il backup richiederà comunque una destinazione separata.'
    },
    quizzes: [
      { question: 'Quale verifica precede la creazione di VM KVM?', options: ['Solo il colore del rack', 'Estensioni VT-x o AMD-V attive', 'Il numero di finestre del browser'], correct: 1, why: 'KVM richiede supporto di virtualizzazione hardware utilizzabile dal nodo.', analogy: 'Prima di caricare il camion, controlli che il motore si accenda.' },
      { question: 'Che cosa manca quando tutta la RAM fisica è assegnata ai guest?', options: ['Il margine per host e picchi', 'Il nome del server', 'La porta 8007'], correct: 0, why: 'Il nodo e la cache consumano memoria; l’assegnazione totale crea pressione e possibili blocchi.', analogy: 'Un magazzino pieno fino alla porta non ha spazio per le operazioni.' },
      { question: 'Un mirror locale sostituisce il PBS?', options: ['Sì, sempre', 'Solo se ci sono due NIC', 'No, protegge da un guasto di disco ma non da tutti gli incidenti'], correct: 2, why: 'Il mirror non risolve cancellazioni, corruzione logica o perdita dell’intero host.', analogy: 'Due chiavi della stessa stanza non sono una copia dell’archivio in un altro luogo.' }
    ],
    decision: { prompt: 'Il reparto acquisti preferisce il server A. Come rispondi?', options: [
      { id: 'cheap', label: 'Lo approvo senza controllare il firmware: costa meno.', correct: false, why: 'La virtualizzazione hardware è disattivata e manca margine adeguato.' },
      { id: 'audit', label: 'Documento i requisiti e scelgo B per accelerazione, memoria e margine.', correct: true, why: 'La scelta è motivata dai carichi e dalle capacità verificabili.' },
      { id: 'all', label: 'Assegno 24 GiB ai guest e ignoro il consumo del nodo.', correct: false, why: 'L’host rimarrebbe senza spazio operativo per gestire i carichi.' }
    ] },
    procedure: ['Calcola il carico nominale e il margine necessario.', 'Controlla nel firmware e nel sistema il supporto VT-x/AMD-V.', 'Valuta dischi, controller e rete in base al rischio.', 'Registra ipotesi e limiti: la capacità andrà misurata durante l’uso.'],
    validation: 'Evidenze: inventario letto, accelerazione confermata, memoria e dischi controllati, scelta B giustificata. Le stime non sono una garanzia di prestazioni.',
    diaryPrompt: 'Registra carico totale previsto, host scelto, margine di RAM e motivo per cui il mirror non sostituisce il backup.',
    closing: 'Hai scelto un host con margine. Nella prossima lezione disegnerai le reti prima di collegare le prime VM.',
    images: ['assets/aula-02.png', 'assets/aula-02-p2-hq-v3.png']
  },
  {
    id: 3,
    title: 'Topologia, indirizzi e isolamento del laboratorio',
    module: 'Fondamenti e progetto del laboratorio',
    duration: '35–45 min',
    xp: 130,
    summary: 'Separa gestione, servizi e backup in una topologia verificabile senza esporre il pannello amministrativo.',
    ticket: 'Ticket INF-103 · La prima VM risponde sulla rete degli utenti, ma anche la porta di amministrazione del nodo è raggiungibile da lì. Disegna una topologia che consenta gestione autorizzata, traffico applicativo e backup senza mescolare le funzioni.',
    impact: 'Esporre la gestione sulla rete sbagliata amplia la superficie di attacco e rende più difficile distinguere problemi di accesso, servizio e backup.',
    story: 'Il Junior vide tre cavi e propose di collegarli tutti allo stesso switch senza segmentazione. Il Senior disegnò tre flussi sulla lavagna: «Prima decidiamo chi deve parlare con chi. Solo dopo scegliamo bridge, VLAN e regole. Il cavo da solo non definisce la fiducia».',
    concepts: [
      ['Rete di gestione', 'Percorso usato dagli amministratori per raggiungere i nodi PVE e PBS.'],
      ['Rete dei servizi', 'Percorso usato dagli utenti o dai sistemi per accedere alle applicazioni nelle VM.'],
      ['Rete di backup', 'Percorso pianificato per trasferire le copie verso PBS senza confondere i ruoli.'],
      ['Bridge e segmentazione', 'La bridge collega interfacce; VLAN, switch e regole definiscono i confini del traffico.']
    ],
    analogy: 'La portineria, gli uffici e il deposito possono stare nello stesso complesso, ma non devono condividere indistintamente porte e permessi.',
    recall: { question: 'Quale rete deve poter raggiungere normalmente l’interfaccia di gestione del PVE?', answer: 'Solo la rete di gestione o un percorso amministrativo esplicitamente autorizzato, secondo la topologia e le regole definite.' },
    lab: {
      context: 'Console simulata del nodo pve01. Gli indirizzi 10.10.x.0/24 sono esempi privati di laboratorio.',
      steps: ['Ispeziona interfacce e route.', 'Controlla su quale porta ascolta la gestione.', 'Seleziona il disegno con flussi separati.', 'Convalida il percorso previsto.'],
      commands: [
        { host: 'pve01', input: 'ip -br addr', output: 'vmbr0  UP  10.10.10.11/24\nvmbr1  UP  10.10.20.11/24\nvmbr2  UP  10.10.30.11/24', key: 'interfaces' },
        { host: 'pve01', input: 'ip route', output: 'default via 10.10.10.1 dev vmbr0\n10.10.20.0/24 dev vmbr1\n10.10.30.0/24 dev vmbr2', key: 'routes' },
        { host: 'pve01', input: 'ss -lnt', output: 'State   Recv-Q Send-Q Local Address:Port\nLISTEN  0      4096   0.0.0.0:8006', key: 'ports' }
      ],
      choiceLabel: 'Disegno di rete',
      choices: [
        { id: 'flat', label: 'Una rete piatta: utenti, gestione e backup senza confini' },
        { id: 'segmented', label: '10.10.10.0/24 gestione; 10.10.20.0/24 servizi; 10.10.30.0/24 backup' },
        { id: 'no-management', label: 'Nessun percorso amministrativo verso PVE' }
      ],
      correct: 'segmented',
      success: 'Topologia approvata: i tre flussi hanno ruoli espliciti. L’accesso reale richiederà anche configurazione di switch, firewall e test.'
    },
    quizzes: [
      { question: 'A che cosa serve la rete di gestione?', options: ['A pubblicare tutte le VM', 'A trasportare solo file ISO', 'A raggiungere i nodi per amministrazione autorizzata'], correct: 2, why: 'La gestione ha un pubblico ristretto e un percorso da proteggere.', analogy: 'La chiave della sala controllo va agli operatori autorizzati.' },
      { question: 'La presenza di 8006 in ascolto prova che la rete utenti possa raggiungerla?', options: ['Sì, sempre', 'No, servono anche percorso e regole di accesso', 'Solo se PBS è spento'], correct: 1, why: 'Un socket locale in ascolto non descrive da solo firewall, route o filtraggio di rete.', analogy: 'Una porta costruita non significa che ogni visitatore possa attraversarla.' },
      { question: 'Quale componente collega le interfacce delle VM alla rete del nodo?', options: ['Linux bridge', 'Verify Job', 'Prune Job'], correct: 0, why: 'Una bridge collega porte virtuali e fisiche; la sicurezza dipende dalla topologia completa.', analogy: 'La bridge è il corridoio; badge e porte definiscono l’accesso.' }
    ],
    decision: { prompt: 'Il collega vuole spostare la GUI PVE nella VLAN utenti per comodità. Che cosa fai?', options: [
      { id: 'open', label: 'La espongo a tutti: così evitiamo il percorso amministrativo.', correct: false, why: 'Aumenti inutilmente la superficie di accesso alla gestione.' },
      { id: 'controlled', label: 'Mantengo un percorso di gestione controllato e verifico gli accessi necessari.', correct: true, why: 'La scelta conserva operabilità e separazione dei ruoli.' },
      { id: 'disconnect', label: 'Tolgo ogni accesso amministrativo, anche agli operatori.', correct: false, why: 'Il nodo deve restare amministrabile da un percorso autorizzato.' }
    ] },
    procedure: ['Elenca flussi e soggetti autorizzati.', 'Assegna reti e indirizzi senza sovrapposizioni.', 'Verifica bridge, VLAN, route e filtri sui dispositivi coinvolti.', 'Prova un accesso ammesso e uno negato prima di approvare.'],
    validation: 'Evidenze: interfacce, route e porta ispezionate; gestione, servizi e backup separati nel disegno. La simulazione non applica regole reali di firewall.',
    diaryPrompt: 'Registra le tre sottoreti, i loro ruoli e il test che farai per dimostrare che gli utenti non raggiungono la gestione.',
    closing: 'Hai definito il percorso dei dati. Nella prossima lezione tradurrai il rischio aziendale in obiettivi misurabili di recupero.',
    images: ['assets/aula-03.png', 'assets/aula-03-p2-hq-v3.png']
  },
  {
    id: 4,
    title: 'Rischio, RPO, RTO e criteri di accettazione',
    module: 'Fondamenti e progetto del laboratorio',
    duration: '40–50 min',
    xp: 150,
    summary: 'Definisci quanta perdita di dati e quanto fermo il business può tollerare, poi confronta una prova di ripristino con queste soglie.',
    ticket: 'Ticket INF-104 · Il gestionale registra ordini tutto il giorno. La direzione accetta al massimo 15 minuti di dati persi e 2 ore di indisponibilità. Una prova simulata recupera 10 minuti indietro e riporta il servizio in 75 minuti. Devi giudicare il risultato senza confondere obiettivo e misura.',
    impact: 'Senza soglie scritte e una prova cronometrata, “abbiamo un backup” non indica quanta attività andrà persa né quando il servizio tornerà disponibile.',
    story: 'Il Junior scrisse «backup ogni sera» nel piano. Il Senior gli mostrò la coda degli ordini: «Se il guasto arriva alle 17:00, quante ore perdi? Chiediamo alla direzione la perdita massima accettabile, poi misuriamo il recupero. Non promettiamo tempi che non abbiamo provato».',
    concepts: [
      ['RPO', 'Massima distanza temporale accettabile tra il guasto e l’ultimo dato recuperabile.'],
      ['RTO', 'Tempo massimo accettabile per rimettere il servizio in funzione dopo il guasto.'],
      ['Obiettivo', 'Soglia concordata con chi usa il servizio; guida frequenza e architettura.'],
      ['Misura', 'Risultato osservato in una prova di ripristino con inizio, fine e dati controllati.']
    ],
    analogy: 'RPO è quanto indietro torna l’orologio dei dati; RTO è quanto tempo resta chiuso lo sportello prima di riaprire.',
    recall: { question: 'Se l’ultimo punto valido è di 10 minuti prima del guasto e il servizio torna dopo 75 minuti, quali sono i valori misurati?', answer: 'Perdita temporale osservata di 10 minuti e tempo di ritorno del servizio di 75 minuti. Entrambi sono sotto le soglie richieste di 15 minuti e 120 minuti.' },
    lab: {
      context: 'Console simulata del piano di continuità. I numeri della prova sono didattici e non garantiscono prestazioni reali.',
      steps: ['Leggi le soglie approvate dalla direzione.', 'Leggi gli orari dell’incidente simulato.', 'Esegui la prova di ripristino.', 'Scegli il giudizio coerente con RPO e RTO e convalida.'],
      commands: [
        { host: 'piano-dr', input: 'cat /srv/soglie.txt', output: 'RPO massimo: 15 min\nRTO massimo: 120 min\nServizio: gestionale ordini', key: 'targets' },
        { host: 'piano-dr', input: 'cat /srv/incidente.txt', output: 'Guasto: 17:00\nUltimo dato recuperabile: 16:50\nServizio riaperto: 18:15', key: 'timeline' },
        { host: 'piano-dr', input: 'simula-ripristino', output: 'Prova terminata: perdita osservata 10 min; ripristino 75 min.\nVerifica applicativa: ordine di test presente.', key: 'restore' }
      ],
      choiceLabel: 'Giudizio della prova',
      choices: [
        { id: 'pass', label: 'Conforme: 10 ≤ 15 min di RPO e 75 ≤ 120 min di RTO' },
        { id: 'fail-rto', label: 'Non conforme: il RTO misurato è 10 minuti' },
        { id: 'promise', label: 'Conforme per sempre, senza altre prove o monitoraggio' }
      ],
      correct: 'pass',
      success: 'Prova conforme alle soglie di questo scenario. Registra tempi, punto recuperato e verifica applicativa; ripeti il test quando l’ambiente cambia.'
    },
    quizzes: [
      { question: 'RPO misura principalmente...', options: ['La perdita temporale massima di dati accettabile', 'La temperatura del rack', 'Il tempo di avvio del browser'], correct: 0, why: 'RPO guarda la distanza tra guasto e ultimo punto di dati recuperabile.', analogy: 'È il tratto di strada che potresti dover ripercorrere.' },
      { question: 'RTO misura principalmente...', options: ['Il numero di VM', 'Il tempo massimo per riportare il servizio in funzione', 'La quantità di snapshot'], correct: 1, why: 'RTO è il limite di indisponibilità concordato con il business.', analogy: 'È il tempo massimo per riaprire lo sportello.' },
      { question: 'Quale evidenza vale più della sola dicitura “backup riuscito”?', options: ['Un’icona verde senza dettagli', 'Una promessa del fornitore', 'Una prova di ripristino con tempi e servizio verificati'], correct: 2, why: 'Solo una prova completa mostra dati disponibili e servizio utilizzabile entro le soglie.', analogy: 'Una prova antincendio misura l’uscita reale, non solo la presenza del cartello.' }
    ],
    decision: { prompt: 'Il responsabile chiede di scrivere “recupero garantito in 5 minuti” senza test. Come rispondi?', options: [
      { id: 'promise', label: 'Scrivo il numero: una promessa aumenta la fiducia.', correct: false, why: 'Un tempo inventato può portare a decisioni sbagliate durante un incidente.' },
      { id: 'measure', label: 'Registro la soglia richiesta e il risultato misurato, con limiti della prova.', correct: true, why: 'Separa impegno di business ed evidenza tecnica osservata.' },
      { id: 'omit', label: 'Elimino RPO e RTO dal piano.', correct: false, why: 'Senza soglie non puoi verificare se la protezione soddisfa il bisogno.' }
    ] },
    procedure: ['Ottieni soglie RPO e RTO dal responsabile del servizio.', 'Definisci quali dati e funzioni devono tornare disponibili.', 'Esegui una prova isolata e registra orari e punto recuperato.', 'Confronta misure e soglie; documenta correzioni e nuova prova se necessario.'],
    validation: 'Evidenze: soglie 15/120 minuti, guasto alle 17:00, dato recuperato delle 16:50, servizio alle 18:15 e ordine di test presente. La prova soddisfa lo scenario, non certifica automaticamente l’intera infrastruttura.',
    diaryPrompt: 'Scrivi RPO e RTO richiesti, valori misurati, servizio verificato e una condizione che richiederebbe ripetere il test.',
    closing: 'Hai chiuso il primo modulo con criteri misurabili. Il modulo successivo inizierà con la preparazione dell’host PVE.',
    images: ['assets/aula-04.png', 'assets/aula-04-p2-hq-v2.png']
  },
  ...module02,
  ...module03
];

export const getLesson = id => lessons.find(lesson => lesson.id === Number(id));
