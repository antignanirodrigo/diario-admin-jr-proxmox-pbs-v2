export const module03 = [
  {
    id: 9, title: 'Linux bridge e prima VM in rete', module: 'Rete dell’ipervisore', duration: '40–50 min', xp: 180,
    summary: 'Segui il percorso tra scheda virtuale, bridge Linux e porta fisica per diagnosticare una VM senza connettività.',
    ticket: 'Ticket INF-109 · La VM 201 è accesa ma non raggiunge la rete di gestione del laboratorio. Il collega propone di cambiare indirizzo IP dentro la VM. Prima devi verificare a quale bridge è collegata la sua scheda virtuale.',
    impact: 'Cambiare IP senza conoscere il percorso di livello 2 nasconde il difetto e può creare conflitti. Una scheda VM collegata a una bridge priva di uplink non raggiunge la rete esterna.',
    story: 'Il Junior vide la VM accesa e pensò al gateway. Il Senior indicò il percorso sul rack: «Prima della route c’è il collegamento. La scheda virtuale entra in una bridge; la bridge deve avere l’uplink giusto. Seguiamo questi tre punti prima di modificare l’ospite».',
    concepts: [['Scheda virtuale', 'net0 rappresenta l’interfaccia della VM nella configurazione PVE.'], ['Linux bridge', 'vmbr0 agisce da switch virtuale fra interfacce virtuali e porta fisica.'], ['Uplink', 'La porta fisica collega la bridge alla rete esterna quando prevista dalla topologia.'], ['Livello 2 prima del livello 3', 'Una route corretta non ripara una scheda collegata alla bridge sbagliata.']],
    analogy: 'Una stanza può avere un indirizzo corretto, ma se la sua porta apre su un corridoio senza uscita il postino non arriva.',
    recall: { question: 'Quali tre collegamenti controlli prima di cambiare IP nella VM?', answer: 'Controllo net0 della VM, la bridge indicata in net0 e la porta fisica collegata a quella bridge.' },
    lab: {
      context: 'Nodo pve02 simulato. La VM 201 usa una rete di laboratorio; i file di configurazione e gli output sono esempi didattici. Nessun collegamento reale viene modificato.',
      steps: ['Leggi la scheda virtuale della VM 201.', 'Confronta bridge e uplink configurati sul nodo.', 'Scegli la correzione minima e convalida il ragionamento.'],
      commands: [
        { host: 'pve02', input: 'qm config 201', output: 'name: vm-test-201\nnet0: virtio=BC:24:11:00:02:01,bridge=vmbr9', key: 'vmnic' },
        { host: 'pve02', input: 'ip -br link', output: 'enp1s0 UP\nvmbr0 UP\nvmbr9 UP\ntap201i0 UP', key: 'links' },
        { host: 'pve02', input: 'bridge link', output: 'enp1s0 master vmbr0 state forwarding\ntap201i0 master vmbr9 state forwarding', key: 'members' },
        { host: 'pve02', input: 'cat /etc/network/interfaces', output: 'iface enp1s0 inet manual\nauto vmbr0\niface vmbr0 inet static\n  address 10.10.10.12/24\n  bridge-ports enp1s0\nauto vmbr9\niface vmbr9 inet manual\n  bridge-ports none', key: 'config' }
      ],
      choiceLabel: 'Correzione della rete della VM 201', choices: [
        { id: 'ip', label: 'Cambiare subito l’IP della VM senza toccare il collegamento.' },
        { id: 'bridge', label: 'Pianificare net0 su vmbr0, poi verificare connettività e policy.' },
        { id: 'all', label: 'Collegare tutte le bridge a tutte le reti per sicurezza.' }
      ], correct: 'bridge', success: 'La causa è net0 su vmbr9, bridge senza uplink. La correzione scelta è minima; resta da applicare e testare in ambiente autorizzato.'
    },
    quizzes: [
      { question: 'Che cosa indica bridge=vmbr9 in qm config?', options: ['La scheda net0 usa vmbr9', 'La VM usa automaticamente vmbr0', 'Il DNS è vmbr9'], correct: 0, why: 'La proprietà bridge di net0 indica il collegamento virtuale della VM, non il suo DNS.', analogy: 'È il numero del corridoio a cui apre la porta.' },
      { question: 'Un’interfaccia UP dimostra accesso alla rete esterna?', options: ['Sì, sempre', 'No, mostra stato locale; serve verificare percorso e test remoto', 'Solo se la VM ha un nome'], correct: 1, why: 'UP non prova che la bridge possieda uplink, che la route funzioni o che i filtri permettano traffico.', analogy: 'Una porta aperta può dare su una stanza isolata.' },
      { question: 'Quale bridge ha la porta fisica enp1s0 nel laboratorio?', options: ['vmbr9', 'Nessuna', 'vmbr0'], correct: 2, why: 'bridge link e interfaces collegano enp1s0 a vmbr0; vmbr9 non ha porta fisica.', analogy: 'Solo un corridoio arriva all’uscita del palazzo.' }
    ],
    decision: { prompt: 'Il responsabile vuole una correzione immediata senza prova. Come chiudi il ticket?', options: [
      { id: 'claim', label: 'Dico che la rete è ripristinata senza test.', correct: false, why: 'La diagnosi non è una prova di connettività ristabilita.' },
      { id: 'plan', label: 'Registro bridge errata, correzione proposta e test da eseguire.', correct: true, why: 'Separa causa osservata, modifica pianificata e verifica ancora pendente.' },
      { id: 'dhcp', label: 'Attivo DHCP a caso nella VM.', correct: false, why: 'DHCP non risolve la bridge isolata.' }
    ] },
    procedure: ['Leggi qm config della VM.', 'Confronta i membri delle bridge con l’uplink previsto.', 'Modifica solo la scheda della VM dopo approvazione.', 'Verifica connettività e segmentazione dal guest.'],
    validation: 'Evidenze simulate: net0 su vmbr9, tap201i0 membro di vmbr9 e enp1s0 membro di vmbr0. La correzione resta proposta, non eseguita: serve prova dal guest dopo la modifica.',
    diaryPrompt: 'Disegna il percorso net0 → bridge → uplink, indica il punto interrotto e il test necessario dopo la modifica.',
    closing: 'Hai localizzato un errore di collegamento senza cambiare indirizzi a caso. La prossima aula protegge la rete di gestione dalla perdita di una porta fisica.',
    images: ['assets/aula-09.png', 'assets/aula-09-p2-v2.png']
  },
  {
    id: 10, title: 'Gestione, gateway e bond senza perdere accesso', module: 'Rete dell’ipervisore', duration: '45–55 min', xp: 190,
    summary: 'Distingui rete di gestione, gateway e ridondanza delle porte, verificando un bond active-backup durante il guasto di un link.',
    ticket: 'Ticket INF-110 · Una porta dell’host pve02 è caduta. Il nodo continua a rispondere sulla rete di gestione, ma un collega vuole cambiare il bond in 802.3ad senza verificare gli switch. Devi spiegare perché l’accesso è rimasto disponibile.',
    impact: 'Una modifica improvvisata del bond o del gateway può tagliare l’unico accesso amministrativo. La ridondanza del nodo richiede che porte, switch e configurazione concordino.',
    story: 'Il LED di enp1s0 si spense. Il Junior preparò un riavvio. Il Senior lo fermò davanti ai due uplink: «Il bond active-backup ha già scelto la seconda porta. Prima di toccare il mode, controlliamo slave attivo, route e cablaggio dello switch».',
    concepts: [['Rete di gestione', 'vmbr0 porta l’indirizzo amministrativo stabile del nodo.'], ['Gateway', 'La route di default indica il prossimo salto per reti esterne.'], ['Bond active-backup', 'Un solo slave trasmette alla volta; l’altro può subentrare quando il primo cade.'], ['802.3ad', 'L’aggregazione LACP richiede compatibilità e configurazione coerente anche sugli switch.']],
    analogy: 'Due porte d’uscita aiutano solo se entrambe conducono a una strada utile; cambiare il sistema di porte durante l’emergenza può chiuderle tutte.',
    recall: { question: 'Perché non convertire automaticamente un bond active-backup in 802.3ad?', answer: '802.3ad richiede una configurazione LACP compatibile sugli switch; prima si verifica la topologia e il traffico reale.' },
    lab: {
      context: 'Failover di link simulato sul nodo pve02. La prova osserva lo stato; non provoca guasti né cambia la configurazione di rete reale.',
      steps: ['Identifica porte e bridge.', 'Leggi slave e modalità del bond.', 'Verifica il gateway e il rapporto dello switch.', 'Scegli la risposta che preserva la gestione.'],
      commands: [
        { host: 'pve02', input: 'ip -br link', output: 'enp1s0 DOWN\nenp2s0 UP\nbond0 UP\nvmbr0 UP', key: 'links' },
        { host: 'pve02', input: 'cat /proc/net/bonding/bond0', output: 'Bonding Mode: fault-tolerance (active-backup)\nCurrently Active Slave: enp2s0\nSlave Interface: enp1s0\nMII Status: down\nSlave Interface: enp2s0\nMII Status: up', key: 'bond' },
        { host: 'pve02', input: 'ip route', output: 'default via 10.10.10.1 dev vmbr0\n10.10.10.0/24 dev vmbr0', key: 'route' },
        { host: 'pve02', input: 'cat /srv/switch-uplink.txt', output: 'enp1s0 -> switch A: link down\nenp2s0 -> switch B: link up\nLACP/802.3ad: non configurato sugli switch', key: 'switch' }
      ],
      choiceLabel: 'Decisione sul bond', choices: [
        { id: 'lacp', label: 'Passare subito a 802.3ad anche senza configurazione switch.' },
        { id: 'keep', label: 'Mantenere active-backup, registrare failover e riparare il link guasto.' },
        { id: 'gateway', label: 'Eliminare il gateway per evitare nuovi guasti.' }
      ], correct: 'keep', success: 'enp2s0 è lo slave attivo e vmbr0 conserva la route. Mantenere il bond, riparare enp1s0 e testare da una postazione autorizzata.'
    },
    quizzes: [
      { question: 'Quale slave trasporta ora il traffico nel bond?', options: ['enp1s0', 'enp2s0', 'Nessuno'], correct: 1, why: 'Currently Active Slave indica enp2s0 e il suo MII Status è up, mentre enp1s0 è down.', analogy: 'La seconda porta è l’uscita attualmente praticabile.' },
      { question: 'La route di default via vmbr0 dimostra il test remoto?', options: ['Sì, definitivamente', 'Solo se lo switch è LACP', 'No, serve una verifica da un client autorizzato'], correct: 2, why: 'La route è configurazione locale; non certifica percorso end-to-end o permessi di accesso.', analogy: 'Avere un indirizzo sulla mappa non prova che la strada sia aperta.' },
      { question: 'Che cosa manca per scegliere 802.3ad in questo scenario?', options: ['La configurazione LACP degli switch', 'Un secondo nome DNS', 'Un’altra VM'], correct: 0, why: 'Il rapporto dice che gli switch non sono configurati per LACP, condizione necessaria per quel mode.', analogy: 'I due lati di un connettore devono usare lo stesso standard.' }
    ],
    decision: { prompt: 'Dichiari la rete resiliente in modo definitivo dopo questo singolo failover?', options: [
      { id: 'perfect', label: 'Sì, un failover locale prova ogni guasto possibile.', correct: false, why: 'La prova non copre switch, cablaggio e percorsi esterni.' },
      { id: 'measure', label: 'Registro il failover osservato e pianifico prova remota e riparazione.', correct: true, why: 'Rende chiaro ciò che è stato osservato e ciò che resta da verificare.' },
      { id: 'ignore', label: 'Ignoro la porta guasta perché il nodo risponde.', correct: false, why: 'Restare con un solo link elimina la ridondanza fino alla riparazione.' }
    ] },
    procedure: ['Registra stato fisico delle due porte.', 'Leggi mode e slave attivo del bond.', 'Controlla bridge e gateway.', 'Ripara il link e ripeti il test di failover con finestra approvata.'],
    validation: 'Il bond active-backup usa enp2s0 dopo la caduta di enp1s0, ma il link primario resta guasto. La route via vmbr0 è presente; test da un client e riparazione sono ancora necessari.',
    diaryPrompt: 'Annota slave attivo, gateway, ruolo degli switch e una verifica che manca prima di dichiarare il servizio resiliente.',
    closing: 'La gestione è rimasta disponibile grazie al bond configurato. Nella prossima aula seguirai i tag VLAN tra switch, bridge e VM.',
    images: ['assets/aula-10.png', 'assets/aula-10-p2-v2.png']
  },
  {
    id: 11, title: 'VLAN e bridge VLAN-aware', module: 'Rete dell’ipervisore', duration: '45–55 min', xp: 200,
    summary: 'Segui il tag della VM attraverso bridge e uplink, correggendo una VLAN errata senza eliminare la segmentazione.',
    ticket: 'Ticket INF-111 · La VM 202 del reparto server raggiunge la rete utenti ma non il servizio interno previsto. La bridge supporta VLAN 20 e 30. Devi trovare il tag errato sulla scheda della VM e rispettare la policy.',
    impact: 'Un tag sbagliato può portare una VM in un dominio di broadcast non autorizzato. Rimuovere i tag per far passare traffico elimina la separazione progettata.',
    story: 'Il Junior voleva disattivare VLAN-aware per semplificare. Il Senior disegnò tre punti: «Tag della VM, bridge e trunk. Se la rete server è la 30, controlliamo ciascun tratto. Non allarghiamo la rete per correggere una singola scheda».',
    concepts: [['Tag VLAN', 'Identifica il dominio di livello 2 assegnato alla scheda virtuale.'], ['Bridge VLAN-aware', 'Può trasportare VLAN ammesse verso l’uplink senza creare una bridge separata per ogni tag.'], ['Trunk', 'Il collegamento con lo switch deve ammettere le VLAN pianificate.'], ['Segmentazione', 'Reti utenti e server restano separate salvo regole di instradamento esplicite.']],
    analogy: 'Il tag è come il colore di un binario: il treno deve seguire il colore previsto lungo tutto il percorso.',
    recall: { question: 'Dove cerchi la causa se una sola VM è nella VLAN sbagliata?', answer: 'Confronto il tag della sua net0 con la policy, poi verifico che bridge e trunk trasportino quella VLAN.' },
    lab: {
      context: 'Configurazione simulata per VM 202 su pve02. VLAN 20 = utenti, VLAN 30 = server. Nessuna modifica reale a switch, host o VM.',
      steps: ['Leggi la policy della VM.', 'Confronta tag della scheda con bridge e uplink.', 'Scegli la correzione della sola VM e mantieni la segmentazione.'],
      commands: [
        { host: 'pve02', input: 'cat /srv/vlan-policy.txt', output: 'VLAN 20: utenti\nVLAN 30: server\nVM 202 (app-srv): VLAN prevista 30', key: 'policy' },
        { host: 'pve02', input: 'qm config 202', output: 'name: app-srv\nnet0: virtio=BC:24:11:00:02:02,bridge=vmbr0,tag=20', key: 'vmnic' },
        { host: 'pve02', input: 'cat /etc/network/interfaces', output: 'auto vmbr0\niface vmbr0 inet static\n  address 10.10.10.12/24\n  bridge-ports enp1s0\n  bridge-vlan-aware yes\n  bridge-vids 20 30', key: 'bridge' },
        { host: 'pve02', input: 'bridge vlan show', output: 'port       vlan ids\nenp1s0    20 30\nvmbr0     20 30\ntap202i0  20', key: 'vlan' }
      ],
      choiceLabel: 'Correzione del percorso VLAN', choices: [
        { id: 'disable', label: 'Disattivare VLAN-aware e togliere ogni separazione.' },
        { id: 'tag30', label: 'Pianificare tag=30 su net0 della VM 202 e verificare dal guest.' },
        { id: 'switch', label: 'Cambiare tutte le porte dello switch in VLAN 20.' }
      ], correct: 'tag30', success: 'La policy richiede VLAN 30, ma net0 della VM 202 usa tag 20. La correzione è circoscritta alla VM; serve test successivo.'
    },
    quizzes: [
      { question: 'Qual è il tag attuale di net0 della VM 202?', options: ['20', '30', 'Nessuno'], correct: 0, why: 'qm config 202 mostra tag=20, mentre la policy assegna la VM alla VLAN server 30.', analogy: 'L’etichetta del treno indica il binario sbagliato.' },
      { question: 'Bridge VLAN-aware e uplink già ammettono VLAN 30?', options: ['No, manca ogni trunk', 'Sì, entrambi mostrano 20 e 30', 'Non esiste una bridge'], correct: 1, why: 'bridge-vids e bridge vlan show riportano 20 e 30; la discordanza specifica è nel tag della VM.', analogy: 'Il binario corretto esiste, ma il treno usa l’altro.' },
      { question: 'Perché non togliere tutti i tag per risolvere?', options: ['Perché PVE non accetta VLAN', 'Perché il guest deve spegnersi', 'Perché cancellerebbe la segmentazione richiesta'], correct: 2, why: 'La policy separa utenti e server; rimuovere i tag non è una correzione minima e può esporre traffico.', analogy: 'Aprire tutte le porte non corregge una chiave sbagliata.' }
    ],
    decision: { prompt: 'La VM passa alla VLAN 30 dopo la modifica pianificata. Cosa verifichi?', options: [
      { id: 'all', label: 'Dichiaro tutte le VLAN sicure senza altri test.', correct: false, why: 'Un tag corretto non prova isolamento né servizi raggiungibili.' },
      { id: 'verify', label: 'Testo servizio previsto e isolamento dalla rete utenti.', correct: true, why: 'Conferma sia connettività autorizzata sia separazione richiesta.' },
      { id: 'undo', label: 'Tolgo la VLAN anche se funziona.', correct: false, why: 'Contraddice la policy approvata.' }
    ] },
    procedure: ['Confronta policy e tag della VM.', 'Controlla bridge VLAN-aware e VLAN ammesse sul trunk.', 'Applica la correzione minima con autorizzazione.', 'Verifica accesso al servizio server e isolamento dalla rete utenti.'],
    validation: 'Policy VM 202 = VLAN 30; configurazione osservata = tag 20; bridge e uplink ammettono 30. La simulazione identifica la modifica, ma non prova connettività dopo applicazione.',
    diaryPrompt: 'Registra tag attuale, tag previsto, prova sul trunk e due test da eseguire dopo la correzione.',
    closing: 'Hai corretto il percorso senza abbattere la segmentazione. Nella prossima aula combinerai route, DNS, porta e firewall.',
    images: ['assets/aula-11.png', 'assets/aula-11-p2-v2.png']
  },
  {
    id: 12, title: 'Firewall e diagnosi di connettività', module: 'Rete dell’ipervisore', duration: '45–55 min', xp: 210,
    summary: 'Distingui route, DNS, servizio in ascolto e filtro; ripristina la gestione autorizzata mantenendo negato l’accesso utenti.',
    ticket: 'Ticket INF-112 · L’amministratore non apre la GUI di pve02 sulla porta 8006 dalla rete 10.10.10.0/24. Il nome risolve e il servizio ascolta, ma una regola del firewall ammette per errore la rete utenti 10.10.30.0/24. Devi correggere la fonte permessa.',
    impact: 'Aprire 8006 a tutte le reti risolverebbe il sintomo aumentando l’esposizione. Una regola con fonte errata blocca l’amministratore e può autorizzare utenti non previsti.',
    story: 'Il Junior vide il browser in timeout e sospettò il DNS. Il Senior chiese quattro prove: «Nome, route, socket e regola. Se tre sono coerenti e la fonte permessa è sbagliata, correggiamo quella sola regola e testiamo sia accesso lecito sia diniego».',
    concepts: [['DNS', 'Traduce il nome del nodo in un indirizzo; non apre una porta.'], ['Route', 'Indica il percorso locale, ma non garantisce permesso lungo la rete.'], ['Socket in ascolto', 'Mostra che il servizio locale accetta connessioni sulla porta.'], ['Firewall per fonte', 'Una regola può permettere 8006 solo alla rete amministrativa approvata.']],
    analogy: 'Nome e strada portano al palazzo; il portiere decide chi entra. Aprire il portone a tutti non è il modo corretto di correggere la lista degli autorizzati.',
    recall: { question: 'Quali prove distinguono un guasto DNS da una regola di firewall errata?', answer: 'Verifico risoluzione del nome, route, ascolto sulla porta 8006 e fonte ammessa nella policy; poi testo da reti autorizzata e non autorizzata.' },
    lab: {
      context: 'Diagnosi simulata sul nodo pve02. Il rapporto firewall è didattico: non rappresenta un file standard di Proxmox. Nessuna regola reale viene modificata.',
      steps: ['Controlla nome, route e porta.', 'Leggi la policy simulata.', 'Scegli la fonte corretta senza aprire la GUI a tutti.', 'Convalida indicando i due test remoti necessari.'],
      commands: [
        { host: 'pve02', input: 'getent hosts pve02.lab.example', output: '10.10.10.12 pve02.lab.example', key: 'dns' },
        { host: 'pve02', input: 'ip route', output: 'default via 10.10.10.1 dev vmbr0\n10.10.10.0/24 dev vmbr0', key: 'route' },
        { host: 'pve02', input: 'ss -lnt', output: 'State  Local Address:Port\nLISTEN 0.0.0.0:8006\nLISTEN [::]:8006', key: 'socket' },
        { host: 'pve02', input: 'cat /srv/firewall-audit.txt', output: 'PVE firewall: attivo\nInput policy: DROP\nALLOW TCP 8006 source 10.10.30.0/24 (utenti)\nRete autorizzata: 10.10.10.0/24 (gestione)', key: 'firewall' }
      ],
      choiceLabel: 'Correzione della regola', choices: [
        { id: 'all', label: 'Permettere TCP 8006 da qualsiasi rete.' },
        { id: 'source', label: 'Sostituire la fonte con 10.10.10.0/24 e testare allow e deny.' },
        { id: 'dns', label: 'Cambiare il nome DNS, ignorando la regola.' }
      ], correct: 'source', success: 'Nome, route e ascolto sono coerenti; la fonte della regola è errata. La correzione resta pianificata e richiede due test remoti.'
    },
    quizzes: [
      { question: 'getent hosts prova che la GUI sia raggiungibile?', options: ['Sì, completamente', 'No, prova soltanto la risoluzione del nome', 'Solo se la VM è spenta'], correct: 1, why: 'La risoluzione DNS non prova che esista percorso completo o che il firewall consenta TCP 8006.', analogy: 'Conoscere un indirizzo non apre il portone.' },
      { question: 'Che cosa prova LISTEN su 0.0.0.0:8006?', options: ['Il servizio ascolta localmente sulle interfacce IPv4', 'Tutte le reti sono autorizzate', 'Il DNS è sbagliato'], correct: 0, why: 'Lo stato LISTEN è locale; firewall e percorso possono ancora impedire connessioni remote.', analogy: 'Un citofono acceso non significa accesso consentito.' },
      { question: 'Quali due test verificano la correzione in modo completo?', options: ['Due ping dal nodo', 'Due query DNS dal nodo', 'Accesso dalla gestione e diniego dalla rete utenti'], correct: 2, why: 'Una regola di fonte deve permettere il client amministrativo e continuare a negare la rete utenti.', analogy: 'Si prova la chiave giusta e anche quella che deve restare esclusa.' }
    ],
    decision: { prompt: 'La GUI funziona dal client di gestione dopo la modifica. Il ticket è chiuso?', options: [
      { id: 'yes', label: 'Sì, non importa la rete utenti.', correct: false, why: 'Serve anche verificare che il traffico indevido resti bloccato.' },
      { id: 'both', label: 'Solo dopo test positivo dalla gestione e negativo dagli utenti.', correct: true, why: 'Conferma disponibilità e limite di accesso della regola.' },
      { id: 'disable', label: 'Disattivo tutto il firewall in modo permanente.', correct: false, why: 'Elimina il controllo invece di correggere la fonte errata.' }
    ] },
    procedure: ['Verifica nome e route.', 'Conferma ascolto locale sulla porta 8006.', 'Confronta regola e rete amministrativa approvata.', 'Applica in finestra autorizzata e testa allow/deny da due reti.'],
    validation: 'La GUI ascolta, il nome risolve e la route esiste. La policy simulata permette per errore la rete utenti; la scelta minima è correggere la fonte. I test remoti restano pendenti.',
    diaryPrompt: 'Registra le quattro prove, la fonte errata, quella corretta e il risultato atteso dai due client di test.',
    closing: 'Hai concluso il modulo distinguendo connettività e autorizzazione. Il prossimo modulo inizierà la creazione consapevole delle VM KVM.',
    images: ['assets/aula-12-p1-v3.png', 'assets/aula-12-p2-v4.png']
  }
];
