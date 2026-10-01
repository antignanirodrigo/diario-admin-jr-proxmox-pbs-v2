export const lesson17 = {
  id: 17, title: 'Scegliere tra VM e container LXC', module: 'Container LXC', duration: '55–70 min', xp: 250,
  summary: 'Valuta kernel condiviso, sistema operativo, isolamento e requisiti applicativi prima di scegliere una VM o un LXC non privilegiato.',
  ticket: 'Ticket INF-117 · Tre team chiedono una nuova istanza su pve02: un servizio Windows, un piccolo sito interno Linux gestito come servizio di sistema e uno stack Docker/OCI di terze parti. Il responsabile vorrebbe usare LXC per tutti e tre perché consuma meno risorse. Devi documentare una scelta separata per ogni carico prima di creare qualcosa.',
  impact: 'LXC usa il kernel Linux del nodo: non esegue Windows come sistema ospite. Un container non privilegiato riduce l’esposizione rispetto a uno privilegiato, ma non diventa una VM con kernel indipendente. Scegliere LXC soltanto per risparmiare RAM può violare compatibilità, supporto e isolamento richiesti.',
  story: 'Il Junior arrivò con tre schede e un’unica etichetta: «Metto tutto in LXC: è più leggero». Il Senior gli fece separare i requisiti. «Windows ha bisogno della sua VM. Il sito Linux semplice può essere candidato a un LXC non privilegiato, dopo una prova. Per lo stack Docker, la documentazione PVE raccomanda una VM: non forziamo nesting e privilegi solo per mantenere una regola comoda». Nessuna delle tre istanze venne creata durante quella revisione.',
  concepts: [
    ['VM KVM', 'Esegue un sistema ospite con kernel proprio e confine di virtualizzazione più forte; serve per Windows e per il caso Docker/OCI raccomandato dalla documentazione PVE.'],
    ['Container LXC', 'Container di sistema Linux che condivide il kernel del nodo. Il minor overhead non garantisce compatibilità con ogni applicazione o requisito di sicurezza.'],
    ['LXC non privilegiato', 'Mappa gli utenti del container su identificativi non privilegiati del nodo. È la scelta iniziale da valutare per un servizio Linux compatibile, non una garanzia di isolamento equivalente alla VM.'],
    ['Prova di compatibilità', 'Verifica distribuzione/template, dipendenze da kernel o dispositivi, porte, storage, backup e limiti prima di approvare la distribuzione.']
  ],
  analogy: 'La VM è una casa con impianti propri; LXC è una stanza separata che condivide l’impianto centrale. La stanza può essere efficiente, ma non può sostituire l’impianto con un sistema completamente diverso.',
  recall: { question: 'Quale limite impedisce di eseguire Windows come sistema ospite in LXC su PVE?', answer: 'LXC condivide il kernel Linux del nodo; Windows richiede un kernel proprio e quindi una VM KVM nel caso.' },
  lab: {
    context: 'Valutazione simulata su pve02. I file /srv/INF-117-* sono documenti didattici del ticket, non percorsi standard di PVE. Non viene creato alcun container o VM; la scelta resta subordinata a una prova di compatibilità e al processo di approvazione.',
    steps: [
      'Leggi i requisiti distinti dei tre servizi; non usare il solo consumo di RAM come criterio.',
      'Confronta i confini di VM e LXC e il requisito di container non privilegiato.',
      'Controlla l’inventario LXC e se esiste già un template locale; non scambiare un catalogo vuoto per un container pronto.',
      'Scegli l’architettura per i tre carichi e registra quali prove mancano prima di distribuire.'
    ],
    commands: [
      { host: 'pve02', input: 'cat /srv/INF-117-servizi.txt', output: 'A: servizio Windows; sistema ospite Windows richiesto\nB: sito interno Linux; servizio di sistema, nessun modulo kernel o device dedicato dichiarato\nC: stack Docker/OCI di terze parti; immagini applicative e isolamento da verificare', key: 'services' },
      { host: 'pve02', input: 'cat /srv/INF-117-criteri.txt', output: 'PVE LXC: condivide il kernel Linux del nodo; solo sistemi Linux supportati\nLXC non privilegiato: UID/GID mappati sul nodo; non equivale al confine di una VM\nDocker/OCI: la documentazione PVE raccomanda una VM QEMU\nPer B: testare template, porte, dipendenze, storage e backup prima di approvare', key: 'criteria' },
      { host: 'pve02', input: 'pct list', output: 'VMID  Status  Lock  Name', key: 'containers' },
      { host: 'pve02', input: 'pveam list local', output: 'NAME  SIZE', key: 'templates' }
    ],
    choiceLabel: 'Scelta per A, B e C', choices: [
      { id: 'all-lxc', label: 'A, B e C in LXC privilegiati: il risparmio di risorse basta come giustificazione.' },
      { id: 'separate', label: 'A in VM; B candidato a LXC non privilegiato dopo test; C in VM secondo la raccomandazione PVE.' },
      { id: 'all-vm', label: 'A, B e C obbligatoriamente in VM: Linux non può funzionare in LXC.' }
    ], correct: 'separate', success: 'Classificazione documentata: Windows in VM, sito Linux candidato a LXC non privilegiato e stack Docker/OCI in VM. Nessuna istanza è stata creata; compatibilità, template, rete e backup del candidato B restano da verificare.'
  },
  quizzes: [
    { question: 'Perché A non può essere un LXC Linux su PVE?', options: ['Perché LXC condivide il kernel Linux del nodo', 'Perché LXC non ha indirizzi IP', 'Perché Windows richiede sempre PBS'], correct: 0, why: 'Un container LXC non fornisce un kernel Windows indipendente. Il requisito del sistema ospite impone una VM nel caso.', analogy: 'Una stanza non sostituisce l’impianto centrale dell’edificio con un altro sistema.' },
    { question: 'B può essere dichiarato pronto soltanto perché è Linux?', options: ['Sì: ogni servizio Linux funziona automaticamente in LXC', 'No: servono test di dipendenze, rete, storage, backup e isolamento', 'Sì, se il container è privilegiato'], correct: 1, why: 'Linux rende B candidato a LXC, ma compatibilità e operatività non sono state provate. Un container privilegiato aggiungerebbe rischio senza giustificazione.', analogy: 'Il formato della chiave sembra giusto; bisogna comunque provarla nella serratura.' },
    { question: 'Qual è la scelta iniziale coerente con la raccomandazione PVE per C?', options: ['LXC privilegiato con nesting attivato senza test', 'Snapshot locale al posto di un sistema ospite', 'VM QEMU per lo stack Docker/OCI'], correct: 2, why: 'La documentazione PVE raccomanda una VM per application containers come Docker, combinando le funzioni OCI con isolamento da host più forte.', analogy: 'La piattaforma applicativa vive dentro una casa separata, non forzata nella sala macchine condivisa.' }
  ],
  decision: { prompt: 'Il responsabile insiste: «LXC usa meno RAM; approviamo tutti e tre oggi?». Come chiudi il ticket?', options: [
    { id: 'approve-all', label: 'Approvo i tre LXC e attivo privilegi aggiuntivi se un servizio non parte.', correct: false, why: 'Windows non può condividere il kernel Linux e i privilegi non risolvono il requisito. Lo stack Docker richiede una scelta motivata e test.' },
    { id: 'document', label: 'Documento VM per A e C, candidato LXC non privilegiato per B e le prove ancora necessarie.', correct: true, why: 'La scelta rispetta compatibilità e raccomandazione PVE senza fingere che la distribuzione o il backup siano già stati validati.' },
    { id: 'block-linux', label: 'Rifiuto ogni LXC perché nessun servizio Linux può usare il kernel del nodo.', correct: false, why: 'LXC è adatto a molti servizi Linux compatibili; B richiede valutazione, non un rifiuto automatico.' }
  ] },
  procedure: ['Elenca sistema operativo, dipendenze da kernel/device, confine di isolamento e supporto del fornitore.', 'Usa una VM quando serve kernel diverso o quando l’applicazione richiede il confine raccomandato per Docker/OCI.', 'Per un servizio Linux semplice, preferisci valutare un LXC non privilegiato e verifica template, UID/GID, rete e storage.', 'Prova il servizio, l’esposizione delle porte, il backup dei dati e il ripristino prima di dichiararlo pronto.'],
  validation: 'Le quattro letture del laboratorio mostrano tre requisiti differenti. Le tabelle vuote di pct list e pveam list local indicano che su pve02 non compare alcun CT né template locale nel caso simulato. La scelta tecnica separa Windows/VM, sito Linux/LXC candidato non privilegiato e Docker/OCI/VM. Non sono stati creati sistemi, né validati servizio, backup o ripristino: la classificazione è un piano, non una messa in produzione.',
  diaryPrompt: 'Registra per A, B e C la tecnologia scelta, il motivo tecnico e la prova che manca. In particolare, spiega perché “più leggero” non basta come criterio.',
  closing: 'Hai scelto il confine adatto a ciascun servizio senza scambiare efficienza per compatibilità. Nella prossima lezione creerai e verificherai il candidato LXC non privilegiato.',
  images: ['assets/aula-17-p1-v3.png', 'assets/aula-17-p2-v4.png']
};
