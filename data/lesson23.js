// Bozza tecnica: simulazione di guasto, sostituzione autorizzata e resilver.
const degraded = '  pool: tank-lab\n state: DEGRADED\n  scan: none requested\nconfig:\n        NAME           STATE     READ WRITE CKSUM\n        tank-lab       DEGRADED     0     0     0\n          raidz2-0     DEGRADED     0     0     0\n            ata-LAB-01 ONLINE       0     0     0\n            ata-LAB-02 ONLINE       0     0     0\n            ata-LAB-03 DEGRADED     3     0     0\n            ata-LAB-04 ONLINE       0     0     0\nerrors: No known data errors';
const scrubbed = degraded.replace('scan: none requested', 'scan: scrub repaired 0B in 00:04:10 with 0 errors');
const replacing = '  pool: tank-lab\n state: DEGRADED\n  scan: resilver in progress, 26.0% done\nconfig:\n        NAME           STATE     READ WRITE CKSUM\n        tank-lab       DEGRADED     0     0     0\n          raidz2-0     DEGRADED     0     0     0\n            ata-LAB-01 ONLINE       0     0     0\n            ata-LAB-02 ONLINE       0     0     0\n            replacing-2 DEGRADED    0     0     0\n              ata-LAB-03 DEGRADED   3     0     0\n              ata-LAB-05 ONLINE     0     0     0\n            ata-LAB-04 ONLINE       0     0     0\nerrors: No known data errors'.replaceAll('ata-LAB-', '/dev/disk/by-id/ata-LAB-');
const online = '  pool: tank-lab\n state: ONLINE\n  scan: resilvered 812G in 01:12:33 with 0 errors\nconfig:\n        NAME           STATE     READ WRITE CKSUM\n        tank-lab       ONLINE       0     0     0\n          raidz2-0     ONLINE       0     0     0\n            ata-LAB-01 ONLINE       0     0     0\n            ata-LAB-02 ONLINE       0     0     0\n            ata-LAB-05 ONLINE       0     0     0\n            ata-LAB-04 ONLINE       0     0     0\nerrors: No known data errors'.replaceAll('ata-LAB-', '/dev/disk/by-id/ata-LAB-');

export const lesson23 = {
  id: 23, title: 'Manutenzione ZFS: scrub e sostituzione', module: 'Archiviazione e integrità', duration: '70–90 min', xp: 340,
  summary: 'Interpreta un pool DEGRADED, esegui scrub, applica una sostituzione autorizzata nella simulazione e verifica ONLINE solo dopo resilver.',
  ticket: 'Ticket INF-123 · Dopo la lezione 22, la modifica simulata INF-122 ha creato tank-lab RAIDZ2 su pve03. Ora ata-LAB-03 mostra tre errori READ e il pool è DEGRADED. È disponibile il ricambio didattico ata-LAB-05. Prima della sostituzione servono conferma del caddy, identità e salute del disco nuovo, autorizzazione e registro della copia indipendente.',
  impact: 'La ridondanza consente ancora accesso ai dati noti, ma il margine di guasto è ridotto. Uno scrub senza sostituzione non risolve un device guasto; rimuovere il disco sbagliato o dichiarare ONLINE prima del resilver espone il pool a perdita dei dati.',
  story: 'Il Junior vide DEGRADED e propose di estrarre subito il terzo caddy. Il Senior lo fermò: «Il nome in console va legato al seriale fisico». Lo scrub simulato non trovò errori dati, ma il device rimase degradato. Dopo la lettura del gate autorizzato, la sostituzione con ata-LAB-05 fu simulata; seguirono lo stato replacing, il passaggio didattico del tempo e una verifica finale ONLINE. Il registro mantenne il backup come prova separata.',
  concepts: [
    ['DEGRADED', 'Il pool opera con ridondanza ridotta; No known data errors non significa che il device sia sano.'],
    ['Scrub', 'Legge/verifica dati del pool e ripara quando la ridondanza lo consente; non sostituisce il disco.'],
    ['Replace e resilver', 'La sostituzione usa identificativi controllati; il resilver ricostruisce i dati sul nuovo device e va seguito fino al termine.'],
    ['Verifica finale', 'ONLINE dopo resilver è la prova dello stato del pool simulato, distinta da backup e restore indipendenti.']
  ],
  analogy: 'Uno scrub è un controllo accurato dei libri sugli scaffali; cambiare uno scaffale rotto e ricollocarvi i libri richiede un’altra operazione e una nuova verifica.',
  recall: { question: 'Perché lo scrub con zero errori non chiude INF-123?', answer: 'Dopo lo scrub il device ata-LAB-03 e il pool restano DEGRADED; servono sostituzione, resilver e stato ONLINE verificato.' },
  lab: {
    context: 'Intero flusso su pve03 è simulato. La modifica INF-122 ha creato tank-lab fra i ticket; il file di autorizzazione rappresenta controlli fisici che la CLI non esegue. I tempi sono didattici.',
    steps: ['Leggi stato iniziale e separa errori del device da errori dati noti.', 'Esegui scrub e verifica che il pool rimanga DEGRADED.', 'Leggi gate autorizzato e IDs; solo allora sostituisci nella simulazione.', 'Osserva replacing/resilver, avanza il tempo didattico e verifica ONLINE con ata-LAB-05.'],
    initialRuntime: { poolPhase: 'degraded' }, expectedRuntime: { poolPhase: 'online' },
    commands: [
      { host: 'pve03', input: 'zpool status tank-lab', output: degraded, key: 'initial' },
      { host: 'pve03', input: 'zpool scrub tank-lab', output: '', key: 'scrub', requires: ['initial'], requiresRuntime: { poolPhase: 'degraded' }, setRuntime: { poolPhase: 'scrubbed' } },
      { host: 'pve03', input: 'zpool status -v tank-lab', output: scrubbed, key: 'scrubStatus', requires: ['scrub'], requiresRuntime: { poolPhase: 'scrubbed' } },
      { host: 'pve03', input: 'cat /srv/INF-123-troca-autorizada.txt', output: 'Modifica INF-123: autorizzata nel laboratorio simulato\nGuasto: ata-LAB-03; caddy 03 e seriale verificati\nRicambio installato: /dev/disk/by-id/ata-LAB-05; seriale, capacità e salute verificati\nCopia indipendente: registro consultato prima della sostituzione', key: 'gate', requires: ['scrubStatus'] },
      { host: 'pve03', input: 'zpool replace tank-lab ata-LAB-03 /dev/disk/by-id/ata-LAB-05', output: '', key: 'replace', requires: ['gate'], requiresRuntime: { poolPhase: 'scrubbed' }, setRuntime: { poolPhase: 'replacing' } },
      { host: 'pve03', input: 'zpool status -P tank-lab', output: replacing, key: 'rebuilding', requires: ['replace'], requiresRuntime: { poolPhase: 'replacing' } },
      { host: 'pve03', input: 'cat /srv/INF-123-avanzamento-simulato.txt', output: 'Il laboratorio avanza al completamento del resilver; nessuna durata reale dedotta.', key: 'advance', requires: ['rebuilding'], requiresRuntime: { poolPhase: 'replacing' }, setRuntime: { poolPhase: 'online' } },
      { host: 'pve03', input: 'zpool status -v -P tank-lab', output: online, key: 'final', requires: ['advance'], requiresRuntime: { poolPhase: 'online' } }
    ],
    choiceLabel: 'Come chiudi il ticket dopo la verifica?', choices: [
      { id: 'scrub-only', label: 'Scrub senza errori: il device è sano e la sostituzione non serve' },
      { id: 'verified', label: 'Sostituzione simulata, resilver finito, pool ONLINE; backup resta prova distinta' },
      { id: 'early', label: 'Il comando replace basta; non attendo il resilver' }
    ], correct: 'verified', success: 'Nel laboratorio simulato ata-LAB-05 sostituisce ata-LAB-03 e tank-lab torna ONLINE dopo resilver. La salute futura e il ripristino da copia esterna richiedono verifiche separate.'
  },
  quizzes: [
    { question: 'Che cosa significa No known data errors mentre il pool è DEGRADED?', options: ['Non risultano errori dati noti, ma il device resta degradato', 'Il disco è sicuramente sano', 'Il backup esterno è stato verificato'], correct: 0, why: 'È una riga relativa agli errori dati noti; lo stato del device e i contatori READ restano evidenze distinte.', analogy: 'Nessun libro mancante non ripara lo scaffale rotto.' },
    { question: 'Che cosa avvia zpool scrub tank-lab?', options: ['La sostituzione fisica del caddy', 'Una scansione/verifica del pool', 'La migrazione della VM'], correct: 1, why: 'Scrub controlla i dati; non seleziona un nuovo device né sposta carichi.', analogy: 'Una revisione dei libri non cambia lo scaffale.' },
    { question: 'Quando è corretto registrare ONLINE nel caso?', options: ['Appena il comando replace viene accettato', 'Dopo aver letto solo il gate', 'Quando il resilver simulato termina e zpool status finale mostra ONLINE'], correct: 2, why: 'Il replace avvia una transizione; la conferma finale richiede conclusione della ricostruzione e nuova lettura dello stato.', analogy: 'Il pezzo nuovo installato non prova che la macchina abbia passato il collaudo.' }
  ],
  decision: { prompt: 'Il manager chiede di dichiarare chiuso appena lo scrub mostra zero errori. Risposta?', options: [
    { id: 'close-early', label: 'Chiudo: zero errori dello scrub equivalgono a disco sano.', correct: false, why: 'Il pool resta DEGRADED e il device continua a mostrare errori READ.' },
    { id: 'gate', label: 'Completo gate, sostituzione e resilver simulati, poi leggo ONLINE e registro limiti.', correct: true, why: 'Conserva sequenza causale e distinzione tra salute del pool e recuperabilità del backup.' },
    { id: 'pull', label: 'Estraggo sdd subito perché è il terzo disco elencato.', correct: false, why: 'Il nome sdd è volatile e non sostituisce conferma dell’ID persistente/caddy.' }
  ] },
  procedure: ['Isola stato del pool, contatori READ e riga degli errori dati.', 'Esegui scrub e ricontrolla che il device sia ancora DEGRADED.', 'Verifica autorizzazione, ID fisici, salute del ricambio e registro della copia.', 'Simula replace, osserva replacing/resilver e verifica ONLINE solo dopo il completamento.'],
  validation: 'Evidenze nel laboratorio simulato: tank-lab e ata-LAB-03 DEGRADED con READ 3; scrub con zero errori dati non sana il device; gate identifica ricambio ata-LAB-05; replace avvia resilver; solo dopo avanzamento didattico lo stato finale è ONLINE con il nuovo ID. Nessuna durata realista è dedotta e lo stato ONLINE non certifica backup o restore.',
  diaryPrompt: 'Registra stato prima e dopo scrub, ID del disco rimosso e del ricambio, prova di autorizzazione, stato durante resilver e limite della verifica ONLINE.',
  closing: 'Hai seguito un incidente ZFS fino alla prova finale senza scambiare scrub, sostituzione e backup. L’ultima lezione del modulo passa alla pressione di capacità e allo storage condiviso.',
  images: []
};


