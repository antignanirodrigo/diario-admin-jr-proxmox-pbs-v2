export const lesson14 = {
  id: 14, title: 'Disco VirtIO e QEMU Guest Agent', module: 'Macchine virtuali KVM', duration: '45–55 min', xp: 230,
  summary: 'Distingui il controller del disco configurato in PVE dal servizio Guest Agent che deve funzionare dentro la VM per fornire dati al nodo.',
  ticket: 'Ticket INF-114 · La VM Linux 211 è accesa e usa un disco SCSI con controller VirtIO SCSI single, ma la scheda Summary di PVE non mostra l’indirizzo IP del guest. Un collega vuole cambiare la scheda di rete. Devi diagnosticare il Guest Agent, correggere il servizio nel guest e verificare che PVE riceva l’IP.',
  impact: 'Cambiare net0 senza prova può interrompere una VM che ha già un indirizzo funzionante. Il controller del disco e il Guest Agent risolvono problemi diversi: uno presenta lo storage, l’altro permette comunicazione e osservabilità tra host e guest.',
  story: 'Il Junior vide il campo IP vuoto nella GUI e pensò a una rete guasta. Il Senior aprì la configurazione della VM: «L’opzione Agent è attiva, ma non basta. Controlliamo lo stato del servizio nel guest e il suo indirizzo prima di toccare net0. E non confondiamo il controller del disco con il canale dell’agente».',
  concepts: [['VirtIO SCSI single', 'Tipo di controller SCSI paravirtualizzato configurato per il disco della VM; il guest deve disporre dei driver adatti.'], ['QEMU Guest Agent', 'Servizio nel sistema ospite che consente al nodo PVE di ottenere informazioni e coordinare alcune operazioni.'], ['Opzione Agent in PVE', 'Abilita il canale lato hypervisor; non dimostra che il pacchetto e il servizio funzionino nel guest.'], ['IP nella GUI', 'Dato di osservabilità: l’assenza nella GUI non prova, da sola, l’assenza di rete dentro la VM.']],
  analogy: 'Il disco è il magazzino della VM; il Guest Agent è un citofono verso l’amministratore. Un citofono spento non significa che il magazzino sia vuoto o che la strada sia chiusa.',
  recall: { question: 'Quale differenza c’è tra agent: 1 in PVE e un Guest Agent funzionante?', answer: 'agent: 1 abilita il canale lato PVE; nel guest servono pacchetto e servizio attivo. La prova va fatta anche dentro la VM.' },
  lab: {
    context: 'Nodo pve02 e guest Debian-based 211 simulati. I comandi di modifica operano solo nello stato del simulatore; nessuna macchina reale viene modificata. Esegui diagnosi, intervento e prove nell’ordine richiesto.',
    steps: ['Leggi controller, disco, net0 e opzione Agent nella configurazione PVE.', 'Conferma che la VM sia accesa e controlla servizio, pacchetto, IP e disco dentro il guest.', 'Avvia il servizio nel simulatore dopo la diagnosi completa.', 'Conferma lo stato attivo nel guest e interroga l’agente da PVE per ottenere l’IP.'],
    commands: [
      { host: 'pve02', input: 'qm config 211', output: 'name: report-lab\nagent: 1\nscsihw: virtio-scsi-single\nscsi0: local-lvm:vm-211-disk-0,size=40G\nnet0: virtio=BC:24:11:21:00:11,bridge=vmbr0', key: 'config' },
      { host: 'pve02', input: 'qm status 211', output: 'status: running', key: 'status' },
      { host: 'guest211', input: 'systemctl is-active qemu-guest-agent', output: 'inactive', afterKey: 'startAgent', outputAfter: 'active', key: 'agentService' },
      { host: 'guest211', input: 'ip -br addr', output: 'lo      UNKNOWN  127.0.0.1/8\nens18   UP       10.10.10.21/24', key: 'guestIp' },
      { host: 'guest211', input: 'lsblk -o NAME,SIZE,TYPE', output: 'NAME  SIZE TYPE\nsda    40G disk\n└─sda1 40G part', key: 'disk' },
      { host: 'guest211', input: 'dpkg -s qemu-guest-agent', output: 'Package: qemu-guest-agent\nStatus: install ok installed', key: 'package' },
      { host: 'guest211', input: 'systemctl start qemu-guest-agent', output: 'Simulatore: servizio avviato.', key: 'startAgent', requires: ['config', 'status', 'agentService', 'guestIp', 'disk', 'package'] },
      { host: 'guest211', input: 'systemctl show -p ActiveState qemu-guest-agent', output: 'ActiveState=active', key: 'activeAgent', requires: ['startAgent'] },
      { host: 'pve02', input: 'qm guest cmd 211 ping', output: 'Simulatore: comando riuscito, exit 0; il comando reale non stampa necessariamente una risposta.', key: 'agentPing', requires: ['activeAgent'] },
      { host: 'pve02', input: 'qm guest cmd 211 network-get-interfaces', output: '[{"name":"ens18","ip-addresses":[{"ip-address":"10.10.10.21","ip-address-type":"ipv4","prefix":24}]}]', key: 'agentIp', requires: ['agentPing'] }
    ],
    choiceLabel: 'Prossimo intervento', choices: [
      { id: 'net', label: 'Cambiare subito net0: l’IP assente nella GUI prova che la rete non funziona.' },
      { id: 'agent', label: 'Verificare installazione e avviare Guest Agent nel guest; poi confermare comunicazione e IP in PVE.' },
      { id: 'disk', label: 'Cambiare controller del disco per far apparire l’IP nella GUI.' }
    ], correct: 'agent', success: 'Nel simulatore il pacchetto era installato, il servizio Guest Agent è stato avviato e risulta active; PVE ha ricevuto 10.10.10.21 via agente. net0 e disco non sono stati cambiati. La connettività remota resta da provare separatamente.'
  },
  quizzes: [
    { question: 'Che cosa prova agent: 1 nella configurazione PVE?', options: ['Il canale lato PVE è abilitato', 'Il servizio nel guest è sicuramente attivo', 'Il disco è un backup'], correct: 0, why: 'L’opzione prepara il lato hypervisor; la presenza e lo stato del servizio dentro il guest richiedono una verifica separata.', analogy: 'Installare il citofono nel portone non accende automaticamente quello nell’appartamento.' },
    { question: 'L’IP manca nella GUI, ma ip -br addr dentro il guest mostra 10.10.10.21/24. Che cosa concludi?', options: ['La VM non ha rete', 'Il dato non arriva alla GUI; serve controllare il Guest Agent', 'Il disco VirtIO è guasto'], correct: 1, why: 'L’indirizzo nel guest è una prova locale della configurazione IP; l’assenza nella GUI segnala un problema di osservabilità, non dimostra assenza di rete end-to-end.', analogy: 'Un indicatore guasto non cancella il valore misurato alla sorgente.' },
    { question: 'Che cosa mostra scsihw: virtio-scsi-single?', options: ['Il controller SCSI scelto per la VM', 'Che il Guest Agent è attivo', 'Che il backup è verificato'], correct: 0, why: 'La riga descrive la configurazione del controller lato PVE; lsblk mostra il disco nel guest, ma non certifica da solo il driver in uso.', analogy: 'Il tipo di presa sulla parete e il citofono sono componenti diversi.' }
  ],
  decision: { prompt: 'Dopo aver avviato Guest Agent nel guest, l’IP compare in PVE. Puoi chiudere il ticket?', options: [
    { id: 'yes', label: 'Sì, senza altre verifiche: un campo popolato prova tutta la rete.', correct: false, why: 'La visualizzazione dell’IP non prova automaticamente l’accesso remoto né la stabilità del servizio.' },
    { id: 'verify', label: 'Solo dopo controllare che il servizio resti attivo e che comunicazione e rete attese funzionino.', correct: true, why: 'Lo stato del processo e un test di comunicazione completano la prova di osservabilità; la rete richiede un test adeguato.' },
    { id: 'disk', label: 'No: bisogna sostituire il disco, anche se funziona.', correct: false, why: 'Il controller del disco non è la causa dimostrata del campo IP vuoto.' }
  ] },
  procedure: ['Separa sintomo nella GUI e stato reale del guest.', 'Controlla agent: 1, controller, disco e net0 in qm config.', 'Leggi stato del servizio, pacchetto e indirizzo nel guest.', 'Avvia il servizio dopo la diagnosi completa; conferma ActiveState=active e una risposta qm guest cmd dal nodo.', 'Interroga network-get-interfaces e prova separatamente la connettività remota prima di chiudere il ticket.'],
  validation: 'La VM 211 è running; agent: 1 è configurato, ma inizialmente il servizio è inactive. Il guest mostra ens18 con 10.10.10.21/24 e sda da 40G. Il pacchetto è installato; dopo l’intervento simulato, ActiveState=active e PVE riceve l’IP dall’agente. La connettività remota e la stabilità successiva restano da verificare.',
  diaryPrompt: 'Registra prove prima e dopo: controller e disco, IP locale, pacchetto, servizio inattivo e poi attivo, risposta dell’agente in PVE e test remoto ancora necessario.',
  closing: 'Hai separato lo stato reale del guest dai dati mostrati dall’hypervisor. La prossima lezione analizzerà vCPU, memoria e spazio senza ricette universali.',
  images: ['assets/aula-14-p1-v4.png', 'assets/aula-14-p2-v5.png']
};
