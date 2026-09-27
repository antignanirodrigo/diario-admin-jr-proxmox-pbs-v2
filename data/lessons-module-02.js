export const module02 = [
  {
    id: 5,
    title: 'Preparare l’host prima dell’installazione',
    module: 'Installazione e operatività di base del PVE', duration: '40–50 min', xp: 160,
    summary: 'Controlla firmware, dischi, supporto di installazione e orologio prima di modificare il server.',
    ticket: 'Ticket INF-105 · Il nuovo host è pronto per l’installazione, ma il firmware segnala AMD-V disattivato e la chiavetta è stata preparata con una ISO non ancora verificata. Il responsabile vuole iniziare subito. Devi fermare l’installazione finché i prerequisiti non sono dimostrati.',
    impact: 'Procedere senza virtualizzazione utilizzabile o con un’immagine non verificata può produrre un nodo inutilizzabile e obbligare a ripetere l’intervento nella finestra di manutenzione.',
    story: 'Il Junior aveva già collegato il supporto USB al crash cart. Il Senior gli indicò il rapporto del firmware: «Non basta che la CPU supporti AMD-V: l’opzione deve essere attiva e utilizzabile. Prima confrontiamo anche l’impronta della ISO con quella pubblicata dal fornitore. Un’installazione veloce che dobbiamo rifare non è veloce».',
    concepts: [['Virtualizzazione nel firmware', 'VT-x o AMD-V deve essere supportato e abilitato per le VM KVM.'], ['Integrità della ISO', 'Il checksum locale va confrontato con quello pubblicato per lo stesso file.'], ['Strategia dei dischi', 'La scelta del filesystem e della ridondanza va fatta prima di cancellare i dischi.'], ['Orologio e rete', 'Ora, DNS e rete di gestione corretti evitano problemi durante installazione e amministrazione.']],
    analogy: 'Prima di partire con un camion, controlli motore, documenti, carburante e percorso; un solo controllo superato non rende pronto il viaggio.',
    recall: { question: 'Quali due verifiche bloccano l’avvio dell’installazione in questo ticket?', answer: 'AMD-V deve essere abilitato nel firmware e il checksum della ISO deve corrispondere a quello ufficiale della stessa immagine.' },
    lab: {
      context: 'Console simulata del banco preparazione. I file /srv sono didattici. Digest atteso nel ticket simulato: 8d72e14f00000000000000000000000000000000000000000000000000000000. In un ambiente reale usa soltanto il checksum pubblicato dal fornitore per la release esatta.',
      steps: ['Leggi l’audit del firmware.', 'Controlla dischi, impronta della ISO e sincronizzazione oraria.', 'Decidi se l’host può essere installato adesso.', 'Convalida solo dopo aver motivato la correzione necessaria.'],
      commands: [
        { host: 'banco', input: 'cat /srv/firmware-audit.txt', output: 'Host: pve02\nCPU: AMD-V supportato\nFirmware: AMD-V disattivato\nRAM: 64 GiB ECC', key: 'firmware' },
        { host: 'banco', input: 'lsblk -o NAME,SIZE,TYPE', output: 'NAME       SIZE TYPE\nnvme0n1   960G disk\nnvme1n1   960G disk\nsda         32G disk', key: 'disks' },
        { host: 'banco', input: 'sha256sum /srv/iso/proxmox-ve.iso', output: 'c93f2a8b6d1e4f7092a3b5c8d0e1f4a7b9c2d5e8f0a1b3c6d7e9f2a4b5c6d8e0  /srv/iso/proxmox-ve.iso', key: 'iso' },
        { host: 'banco', input: 'timedatectl status', output: 'Time zone: Europe/Rome\nSystem clock synchronized: yes\nNTP service: active', key: 'time' }
      ],
      choiceLabel: 'Decisione prima dell’installazione', choices: [
        { id: 'install-now', label: 'Installare subito: la CPU supporta AMD-V e il resto si risolve dopo.' },
        { id: 'fix-precheck', label: 'Abilitare AMD-V, ottenere la ISO corretta e ripetere il checksum prima di installare.' },
        { id: 'ignore-hash', label: 'Ignorare solo il checksum: la chiavetta sembra funzionare.' }
      ], correct: 'fix-precheck',
      success: 'Installazione sospesa correttamente. Firmware e ISO devono essere corretti e riverificati; i due NVMe richiedono una scelta esplicita di storage.'
    },
    quizzes: [
      { question: 'Il supporto AMD-V nella CPU prova che KVM sia già utilizzabile?', options: ['Sì, senza altre verifiche', 'No, va verificata anche l’abilitazione nel firmware e nel sistema', 'Solo se PBS è installato'], correct: 1, why: 'La capacità hardware non equivale alla sua attivazione; il rapporto del firmware mostra proprio il blocco.', analogy: 'Un motore presente non prova che sia acceso.' },
      { question: 'Che cosa dimostra un checksum della ISO diverso da quello ufficiale?', options: ['Che l’immagine non va usata finché la discrepanza non è risolta', 'Che il disco è già in mirror', 'Che l’orologio è sbagliato'], correct: 0, why: 'Impronte diverse non dimostrano l’integrità della stessa immagine: serve scaricare o verificare di nuovo il file e la fonte.', analogy: 'Il sigillo di un pacco che non coincide richiede un controllo prima di aprirlo.' },
      { question: 'Due SSD visibili in lsblk provano che esista già una ridondanza?', options: ['Sì, automaticamente', 'Solo se hanno la stessa capacità', 'No, la configurazione del pool va scelta e verificata'], correct: 2, why: 'lsblk elenca dispositivi; non certifica che i dati siano duplicati o che sia stato scelto un mirror.', analogy: 'Due armadi vuoti non sono due copie dell’archivio.' }
    ],
    decision: { prompt: 'La finestra di installazione sta finendo. Il responsabile chiede di procedere comunque. Cosa registri?', options: [
      { id: 'rush', label: 'Procedo senza annotare le anomalie.', correct: false, why: 'Nascondi due prerequisiti non soddisfatti e aumenti il rischio di rifare il lavoro.' },
      { id: 'stop', label: 'Registro i blocchi, correggo firmware e ISO e richiedo una nuova verifica.', correct: true, why: 'La decisione preserva un criterio di accettazione verificabile.' },
      { id: 'blame', label: 'Attribuisco il problema al PBS e inizio lo stesso.', correct: false, why: 'PBS non risolve firmware disattivato né un checksum non corrispondente.' }
    ] },
    procedure: ['Conferma requisiti e compatibilità dell’hardware.', 'Abilita VT-x/AMD-V nel firmware e verifica l’esito dopo il riavvio.', 'Scarica la ISO ufficiale e confronta il checksum completo pubblicato per la stessa release.', 'Decidi dischi, filesystem, rete, DNS e orologio prima di avviare l’installer.'],
    validation: 'Evidenze: audit del firmware, dispositivi a blocchi, checksum locale da confrontare con il digest ufficiale presente nel ticket e orologio sincronizzato. Il confronto nel ticket non corrisponde: la decisione corretta è fermarsi. Nessuna installazione reale è stata eseguita.',
    diaryPrompt: 'Registra i due blocchi, il prossimo controllo dopo la correzione e perché due dischi visibili non provano un mirror.',
    closing: 'Il nodo è stato preparato senza saltare i prerequisiti. Nella prossima lezione sceglierai i parametri dell’installer e verificherai l’accesso di gestione.',
    images: ['assets/aula-05.png', 'assets/aula-05-p2-hq-v3.png']
  },
  {
    id: 6,
    title: 'Prima installazione e accesso di gestione',
    module: 'Installazione e operatività di base del PVE', duration: '40–50 min', xp: 170,
    summary: 'Scegli FQDN e indirizzo statico, poi controlla identità, route e porta HTTPS del nodo installato.',
    ticket: 'Ticket INF-106 · Il supporto di installazione è stato riverificato. Durante la configurazione iniziale, un collega propone un nome corto e DHCP per risparmiare tempo. Il nodo dovrà essere raggiungibile in modo stabile solo dalla rete di gestione 10.10.10.0/24.',
    impact: 'Un nome non risolvibile o un indirizzo che cambia può interrompere amministrazione, accesso ai certificati e future integrazioni. Una porta in ascolto non prova da sola che l’accesso sia ristretto.',
    story: 'Il Junior compilò la schermata di rete dell’installer. Il Senior fermò il cursore su “Hostname”: «Qui stiamo dando un’identità al nodo, non una decorazione. Verifichiamo FQDN, DNS e indirizzo prima di confermare. Dopo il riavvio guardiamo il sistema e testiamo da una postazione autorizzata».',
    concepts: [['FQDN', 'Nome completo del nodo, coerente con la risoluzione DNS e l’indirizzo di gestione.'], ['Indirizzo statico', 'Riferimento stabile per amministrazione e integrazioni.'], ['Gateway e DNS', 'Servizi distinti: il primo instrada verso altre reti, il secondo risolve nomi.'], ['Porta 8006/TCP', 'Interfaccia web HTTPS di PVE; l’esposizione dipende anche da route e filtri.']],
    analogy: 'Un edificio ha indirizzo, nome sul citofono e strada di accesso: tutti e tre devono concordare prima di consegnare le chiavi.',
    recall: { question: 'Qual è la differenza fra vedere 8006 in ascolto e poter amministrare il nodo da remoto?', answer: 'L’ascolto è un fatto locale. Per l’accesso remoto servono percorso di rete, DNS/certificato coerenti e regole che permettano solo gli amministratori autorizzati.' },
    lab: {
      context: 'Installazione PVE simulata: scelta nell’installer e verifiche CLI del nodo pve02 dopo il riavvio. I valori 10.10.10.x sono esempi privati.',
      steps: ['Scegli nell’installer un FQDN e un indirizzo statico sulla rete di gestione.', 'Controlla nome completo, indirizzo, route e porta HTTPS.', 'Seleziona il profilo che rispetta la topologia della lezione 03.', 'Convalida ricordando che il test remoto resta necessario.'],
      commands: [
        { host: 'pve02', input: 'hostname --fqdn', output: 'pve02.lab.example', key: 'fqdn' },
        { host: 'pve02', input: 'ip -br addr', output: 'vmbr0  UP  10.10.10.12/24\nenp1s0 UP', key: 'address' },
        { host: 'pve02', input: 'ip route', output: 'default via 10.10.10.1 dev vmbr0\n10.10.10.0/24 dev vmbr0', key: 'route' },
        { host: 'pve02', input: 'ss -lnt', output: 'State  Local Address:Port\nLISTEN 0.0.0.0:8006\nLISTEN [::]:8006', key: 'https' }
      ],
      choiceLabel: 'Profilo dell’installer da approvare', choices: [
        { id: 'dhcp-short', label: 'Nome pve02, DHCP sulla rete utenti, DNS non verificato' },
        { id: 'static-mgmt', label: 'pve02.lab.example, 10.10.10.12/24, gateway 10.10.10.1 e DNS coerente' },
        { id: 'public', label: 'Indirizzo pubblico per rendere la GUI raggiungibile da tutti' }
      ], correct: 'static-mgmt',
      success: 'Profilo di gestione coerente. Il prossimo controllo è provare https://pve02.lab.example:8006 da un client amministrativo e negare l’accesso dalla rete utenti.'
    },
    quizzes: [
      { question: 'Perché usare un FQDN verificabile nell’installazione?', options: ['Perché aumenta la RAM', 'Perché lega identità, DNS e accesso al nodo', 'Perché sostituisce il firewall'], correct: 1, why: 'Il nome completo deve risolvere verso l’indirizzo corretto e sostenere l’amministrazione del nodo.', analogy: 'Il nome sul citofono deve corrispondere all’indirizzo reale.' },
      { question: 'Che cosa indica 0.0.0.0:8006 nella lista dei socket?', options: ['Ascolto su tutti gli indirizzi IPv4 locali', 'Accesso garantito da Internet', 'Backup PBS già configurato'], correct: 0, why: 'ss mostra il socket locale; route e firewall determinano chi può raggiungerlo.', analogy: 'Una porta aperta nell’edificio non significa che ogni strada arrivi fin lì.' },
      { question: 'Quale verifica completa l’audit dopo il riavvio?', options: ['Solo vedere il logo PVE', 'Aprire la GUI dalla VLAN utenti', 'Provare l’accesso da una postazione autorizzata e il blocco da una non autorizzata'], correct: 2, why: 'Il test positivo e quello negativo dimostrano sia disponibilità sia separazione della gestione.', analogy: 'La serratura va provata con la chiave giusta e con una non autorizzata.' }
    ],
    decision: { prompt: 'Il collega propone di esporre temporaneamente la GUI alla rete utenti per il primo login. Rispondi?', options: [
      { id: 'open', label: 'Sì, poi forse la chiudiamo.', correct: false, why: 'Un accesso amministrativo esposto crea rischio e può essere dimenticato.' },
      { id: 'managed', label: 'Uso la rete di gestione e provo accesso consentito e negato.', correct: true, why: 'Il primo login deve rispettare già il percorso amministrativo previsto.' },
      { id: 'blind', label: 'Non provo la GUI: ss basta.', correct: false, why: 'Il socket locale non dimostra DNS, routing, certificato o filtro da client.' }
    ] },
    procedure: ['Conferma FQDN e indirizzo DNS prima dell’installazione.', 'Configura indirizzo statico, maschera, gateway e DNS sulla rete di gestione.', 'Dopo il riavvio, verifica nome, bridge, route e porta 8006.', 'Apri HTTPS da un client autorizzato, controlla l’identità del server e prova un accesso negato.'],
    validation: 'Evidenze: FQDN pve02.lab.example, vmbr0 10.10.10.12/24, gateway 10.10.10.1 e 8006 in ascolto. La simulazione non prova raggiungibilità remota né distribuisce certificati.',
    diaryPrompt: 'Registra FQDN, IP/gateway, URL HTTPS previsto e i due test remoti (consentito e negato).',
    closing: 'Il nodo ha un’identità e un percorso di gestione verificabili. Ora indagherai una attività fallita senza confondere la GUI con la causa.',
    images: ['assets/aula-06.png', 'assets/aula-06-p2-hq-v3.png']
  },
  {
    id: 7,
    title: 'Interfaccia, terminale e cronologia delle attività',
    module: 'Installazione e operatività di base del PVE', duration: '45–55 min', xp: 180,
    summary: 'Collega le viste Datacenter, nodo, storage e Task History alle evidenze CLI di un backup fallito, prima di decidere se ripetere il job.',
    ticket: 'Ticket INF-107 · La GUI segnala un job di backup della VM 100 fallito. Un collega vuole rieseguirlo subito, ma il datastore locale è quasi pieno. Devi individuare l’attività, leggere il suo log e controllare lo storage prima di decidere.',
    impact: 'Rilanciare un’attività senza leggere l’errore può ripetere il guasto, consumare il poco spazio residuo e nascondere la causa nel rumore dei nuovi job.',
    story: 'Il Junior guardò il triangolo rosso nella Task History. Il Senior aprì il dettaglio: «La GUI ci dice che qualcosa è fallito; il log ci dice dove. Prima troviamo l’UPID, poi leggiamo il messaggio e misuriamo lo storage. Solo allora parliamo di nuovo tentativo».',
    concepts: [['Datacenter', 'Vista aggregata di nodi, storage e configurazioni condivise.'], ['Nodo', 'Host fisico con stato, shell, task e risorse locali.'], ['UPID', 'Identificatore univoco di una attività PVE, utile per recuperare il log esatto.'], ['Task History', 'Cronologia di esecuzioni; errore e causa si trovano nel dettaglio della singola attività.']],
    analogy: 'La spia rossa dell’auto segnala un problema; il codice diagnostico e la misura del carburante aiutano a trovare la causa.',
    recall: { question: 'Perché non basta sapere che il task è rosso?', answer: 'Il colore segnala l’esito, non la causa. Bisogna leggere il log del task identificato dall’UPID e verificare la risorsa coinvolta.' },
    lab: {
      context: 'Task History simulata del nodo pve02. L’UPID e i numeri di spazio sono esempi didattici; i comandi mostrati esistono nel PVE.',
      steps: ['Filtra i task falliti della VM 100.', 'Leggi il log dell’UPID esatto.', 'Controlla lo stato degli storage.', 'Decidi come intervenire prima di ripetere il job.'],
      commands: [
        { host: 'pve02', input: 'pvenode task list --errors --vmid 100', output: 'UPID:pve02:00010D94:001CA6EA:6124E1B9:vzdump:100:root@pam:  vzdump 100  ERROR', key: 'taskList' },
        { host: 'pve02', input: 'pvenode task log UPID:pve02:00010D94:001CA6EA:6124E1B9:vzdump:100:root@pam:', output: 'INFO: starting backup VM 100\nERROR: write failed - No space left on device\nTASK ERROR', key: 'taskLog' },
        { host: 'pve02', input: 'pvesm status', output: 'Name        Type   Status    Total    Used    Available\nlocal       dir    active    100G     99G     1G\nlocal-lvm   lvmthin active   800G     240G   560G', key: 'storage' }
      ],
      choiceLabel: 'Prossima azione operativa', choices: [
        { id: 'retry', label: 'Rieseguire subito il backup sullo stesso local quasi pieno' },
        { id: 'capacity', label: 'Fermarsi, verificare destinazione/capacità e correggere la causa prima del nuovo job' },
        { id: 'ignore', label: 'Ignorare il task: una VM accesa implica backup riuscito' }
      ], correct: 'capacity',
      success: 'Diagnosi coerente: task vzdump fallito per spazio insufficiente su local. Prima del nuovo tentativo serve una destinazione adeguata e una verifica del punto di backup risultante.'
    },
    quizzes: [
      { question: 'Quale dato collega la riga della Task History al log giusto?', options: ['Il colore del nodo', 'L’UPID', 'Il nome del browser'], correct: 1, why: 'L’UPID identifica quella esecuzione specifica del task e permette di leggerne il log.', analogy: 'È il numero di protocollo del singolo intervento.' },
      { question: 'Che cosa indica “No space left on device” nel log?', options: ['Spazio esaurito sulla destinazione di scrittura', 'Password della GUI errata', 'VM spenta'], correct: 0, why: 'Il task non ha potuto continuare a scrivere; pvesm status mostra local quasi pieno.', analogy: 'Non puoi riporre un’altra scatola in un armadio già pieno.' },
      { question: 'Il task fallito dimostra che esista un backup recuperabile?', options: ['Sì, basta aver iniziato', 'Sì, perché la VM era accesa', 'No, bisogna correggere, rieseguire e verificare un punto valido'], correct: 2, why: 'Un’esecuzione fallita non è un punto di ripristino affidabile.', analogy: 'Una spedizione interrotta non equivale a un pacco consegnato.' }
    ],
    decision: { prompt: 'La direzione chiede una risposta immediata: “il backup c’è?”. Cosa dici?', options: [
      { id: 'yes', label: 'Sì: ho visto il task nella GUI.', correct: false, why: 'Il task esiste ma è terminato con errore.' },
      { id: 'honest', label: 'L’ultimo job è fallito per spazio; verifico l’ultimo punto valido e correggo la destinazione.', correct: true, why: 'Distingui esecuzione, causa e recuperabilità comprovata.' },
      { id: 'hide', label: 'Non documento il fallimento.', correct: false, why: 'Senza comunicazione e prova, il rischio resta invisibile.' }
    ] },
    procedure: ['Trova il task nella GUI o con pvenode task list.', 'Apri il log tramite UPID e annota l’errore preciso.', 'Correla l’errore allo stato degli storage e ai limiti di capacità.', 'Correggi la destinazione, riesegui il job e verifica che esista un punto valido.'],
    validation: 'Evidenze: task vzdump della VM 100 in errore, log “No space left on device” e storage local al 99%. Nessuna nuova copia è stata creata dalla simulazione.',
    diaryPrompt: 'Registra UPID, errore, storage coinvolto, capacità residua e cosa dimostrerà che il backup è finalmente valido.',
    closing: 'Hai usato la GUI come indice e il terminale come prova. Nella prossima lezione pianificherai gli aggiornamenti senza trasformare la manutenzione in un incidente.',
    images: ['assets/aula-07.png', 'assets/aula-07-p2-hq-v3.png']
  },
  {
    id: 8,
    title: 'Repository, aggiornamenti e finestra di manutenzione',
    module: 'Installazione e operatività di base del PVE', duration: '45–55 min', xp: 190,
    summary: 'Distingui repository, leggi gli aggiornamenti disponibili e approva una finestra con backup e verifica post-intervento.',
    ticket: 'Ticket INF-108 · Il nodo pve02 segnala aggiornamenti disponibili. Il repository enterprise richiede una sottoscrizione non presente nel laboratorio e la VM gestionale è in uso. Il collega propone di avviare subito un upgrade forzato. Devi definire una sequenza sicura.',
    impact: 'Repository incoerenti e aggiornamenti fuori finestra possono fermare un servizio critico senza un punto di ritorno verificato o un criterio di successo dopo il riavvio.',
    story: 'Il Junior vide la lista degli update e cercò il pulsante “Upgrade”. Il Senior aprì prima la politica dei repository: «Questi pacchetti arrivano da fonti diverse. In laboratorio possiamo usare il canale senza sottoscrizione, ma non fingiamo che abbia lo stesso livello di validazione del canale enterprise. E non aggiorniamo una VM critica durante l’orario di lavoro senza backup e prova».',
    concepts: [['Repository enterprise', 'Canale con sottoscrizione valida, raccomandato dal fornitore per produzione.'], ['No-subscription', 'Canale pubblico utile a test e laboratorio, con pacchetti meno validati.'], ['apt update', 'Aggiorna l’indice dei pacchetti; non installa gli aggiornamenti.'], ['Finestra di manutenzione', 'Periodo concordato con backup, comunicazione, piano di ritorno e verifica successiva.']],
    analogy: 'Aggiornare un host è come chiudere una strada per lavori: prima scegli i materiali corretti, avvisi gli utenti e prepari un percorso di emergenza.',
    recall: { question: 'Perché “apt update” non significa che il nodo sia stato aggiornato?', answer: 'apt update scarica e aggiorna gli indici dei repository. L’installazione dei pacchetti è una fase separata, da fare dopo verifica e in finestra.' },
    lab: {
      context: 'Console simulata del nodo pve02. Il laboratorio si ferma al piano di aggiornamento: non esegue apt upgrade né modifica repository reali.',
      steps: ['Controlla la release installata.', 'Esamina il repository e la lista di pacchetti aggiornabili.', 'Leggi la finestra di manutenzione del servizio.', 'Scegli una sequenza che preservi disponibilità e ritorno.'],
      commands: [
        { host: 'pve02', input: 'pveversion -v', output: 'proxmox-ve: 9.2\npve-manager: 9.2\nNodo: pve02', key: 'version' },
        { host: 'pve02', input: 'cat /srv/repository-audit.txt', output: 'Release: PVE 9.2 / Debian 13\nCanale PVE: enterprise configurato\nSottoscrizione laboratorio: assente\nNo-subscription: non configurato', key: 'repository' },
        { host: 'pve02', input: 'apt list --upgradable', output: 'Listing... Done\npve-manager/stable 9.2.1 [upgradable from: 9.2]\nproxmox-kernel/stable 6.x [upgradable]', key: 'packages' },
        { host: 'pve02', input: 'cat /srv/finestra-manutenzione.txt', output: 'Servizio: gestionale VM 100\nFinestra approvata: domenica 02:00–04:00\nBackup: prova di ripristino da confermare\nAvviso utenti: non ancora inviato', key: 'window' }
      ],
      choiceLabel: 'Piano di aggiornamento', choices: [
        { id: 'force', label: 'Forzare subito l’upgrade, ignorando il repository e la finestra' },
        { id: 'plan', label: 'Correggere il canale per il laboratorio, verificare backup/restore, avvisare e usare la finestra' },
        { id: 'never', label: 'Non aggiornare mai il nodo, anche con vulnerabilità corrette' }
      ], correct: 'plan',
      success: 'Piano approvato: nessun upgrade viene eseguito finché repository, copia recuperabile, comunicazione e finestra non sono pronti. Dopo l’intervento si verificheranno nodo, VM e servizi.'
    },
    quizzes: [
      { question: 'Che cosa fa apt update?', options: ['Aggiorna gli indici dei repository', 'Installa tutte le nuove versioni', 'Ripristina la VM'], correct: 0, why: 'Aggiorna la conoscenza dei pacchetti disponibili; installazione e riavvio sono passaggi distinti.', analogy: 'Leggere il catalogo non significa comprare i prodotti.' },
      { question: 'Il canale no-subscription equivale al canale enterprise per la produzione?', options: ['Sì, sono identici', 'No, è un canale pubblico meno validato, adatto al laboratorio', 'Sì, se la GUI è accessibile'], correct: 1, why: 'Il fornitore distingue i livelli di validazione e raccomanda enterprise per produzione con sottoscrizione.', analogy: 'Un percorso di prova non offre lo stesso controllo del percorso certificato.' },
      { question: 'Quale prova manca prima della finestra?', options: ['Solo il colore dell’interfaccia', 'Un nome nuovo per il nodo', 'Backup recuperabile verificato e utenti avvisati'], correct: 2, why: 'Il piano deve includere un punto di ritorno e la comunicazione dell’interruzione prevista.', analogy: 'Prima dei lavori avvisi chi usa la strada e prepari la deviazione.' }
    ],
    decision: { prompt: 'Il responsabile chiede di aggiornare oggi in orario di lavoro. Che cosa proponi?', options: [
      { id: 'today', label: 'Avvio l’upgrade senza backup verificato.', correct: false, why: 'Manca una prova di recupero e la finestra non è approvata per ora.' },
      { id: 'window', label: 'Spiego i rischi, preparo backup e test e concordo la finestra con verifica finale.', correct: true, why: 'L’aggiornamento diventa un intervento misurabile e reversibile.' },
      { id: 'disable', label: 'Disabilito tutti i repository definitivamente.', correct: false, why: 'Eviti oggi il problema ma impedisci correzioni future.' }
    ] },
    procedure: ['Controlla versione, sorgenti dei pacchetti e note della release compatibile.', 'Verifica un backup recuperabile e documenta il ritorno operativo.', 'Concorda finestra, avvisa gli utenti e limita nuovi task.', 'Aggiorna nella finestra, riavvia se richiesto e verifica GUI, VM, rete e servizio applicativo.'],
    validation: 'Evidenze: versione installata, canale enterprise non utilizzabile in questo laboratorio, pacchetti aggiornabili e finestra 02:00–04:00 con backup/avviso ancora pendenti. Nessun aggiornamento è stato applicato.',
    diaryPrompt: 'Registra la differenza fra apt update e upgrade, il canale appropriato al laboratorio e le prove richieste prima/dopo la finestra.',
    closing: 'Hai chiuso il modulo 2 senza trasformare un update in una scommessa. Il prossimo modulo comincerà con la rete del primo guest.',
    images: ['assets/aula-08-hq-v2.png', 'assets/aula-08-p2-hq-v4.png']
  }
];
