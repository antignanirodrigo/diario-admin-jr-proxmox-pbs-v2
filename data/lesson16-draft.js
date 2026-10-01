export const lesson16Draft = {
  id: 16, title: 'Template, clone, snapshot e backup', module: 'Macchine virtuali KVM', duration: '60–75 min', xp: 240,
  summary: 'Converte una base preparata in template, crea un clone completo isolato e usa uno snapshot locale prima di una modifica, distinguendolo da un backup recuperabile.',
  ticket: 'Ticket INF-116 · Il team QA chiede una VM ripetibile per provare un aggiornamento di inventario. La base Linux 230 è ancora accesa su pve02; il clone 231 deve restare isolato dalla rete di produzione. Un collega considera lo snapshot sufficiente anche se il nodo si guasta. Devi preparare il template, creare e verificare il clone, registrare un punto locale prima del test e segnalare ciò che manca per recuperare dopo la perdita del nodo.',
  impact: 'Convertire una base attiva senza confermare lo spegnimento, avviare un clone con identità duplicata in produzione o chiamare un snapshot locale “backup” crea incidenti diversi. Il clone completo non garantisce da solo hostname, IP e chiavi unici; lo snapshot sullo stesso storage sparisce con una perdita non recuperabile del nodo/storage.',
  story: 'Il Junior vide il pulsante Snapshot e concluse: «Così siamo coperti da ogni guasto». Il Senior separò i piani: «Il template genera nuove VM; il clone completo è una copia di lavoro; lo snapshot è un punto di ritorno locale prima della modifica. Per perdere il nodo serve una copia esterna e una prova di ripristino».',
  concepts: [
    ['Template', 'Base preparata e convertita per generare cloni; non è una VM di lavoro da avviare ogni giorno. La preparazione dell’identità del guest va confermata prima della conversione.'],
    ['Clone completo e clone collegato', 'Il clone completo copia i dischi senza dipendere dal volume del template; il clone collegato usa una base condivisa. Nessuno dei due equivale a backup off-host.'],
    ['Snapshot locale', 'Punto nel tempo della VM su uno storage che supporta snapshot, utile per un rollback breve. Senza --vmstate, la RAM in esecuzione non è inclusa; la coerenza applicativa richiede una verifica separata.'],
    ['Backup e ripristino', 'Una copia su una destinazione indipendente deve esistere ed essere testata per sostenere un ripristino dopo la perdita del nodo o dello storage. Snapshot e clone locali non forniscono questa prova.']
  ],
  analogy: 'Il template è uno stampo, il clone completo un pezzo indipendente, lo snapshot un segno di ritorno sullo stesso banco di lavoro e il backup esterno una copia conservata in un altro edificio.',
  recall: { question: 'Quale prova manca se esiste solo uno snapshot su local-lvm?', answer: 'Una copia fuori dal nodo/storage e una ripristino verificato; lo snapshot locale non sopravvive necessariamente alla perdita del nodo.' },
  lab: {
    context: 'Laboratorio simulato su pve02. I file in /srv sono documenti didattici, non percorsi standard PVE. La base 230 è preparata dal team immagini; il clone 231 resta su rete QA isolata. Il simulatore non modifica VM reali, non esegue un aggiornamento e non crea un backup esterno.',
    initialRuntime: { base230: 'running', identityClean: false, template230: false, clone231: 'absent', snapshot231: false },
    expectedRuntime: { base230: 'stopped', identityClean: true, template230: true, clone231: 'running', snapshot231: true },
    steps: [
      'Leggi configurazione, stato e checklist della base 230; pulisci lo stato cloud-init e il machine-id nel guest e verifica uninitialized prima di spegnere.',
      'Richiedi shutdown ordinato e conferma stopped; convertila in template e leggi template: 1.',
      'Crea un clone completo 231 su local-lvm con nome distinto; verifica il disco e la rete QA isolata.',
      'Avvia il clone isolato, conferma running e crea uno snapshot locale prima dell’aggiornamento, senza includere lo stato RAM.',
      'Elenca lo snapshot e leggi l’inventario backup: l’aggiornamento, la verifica dell’identità nel guest e il ripristino da copia esterna restano pendenti.'
    ],
    commands: [
      { host: 'pve02', input: 'qm config 230', output: 'name: base-linux-qa\ncores: 2\nmemory: 2048\nscsi0: local-lvm:vm-230-disk-0,size=20G\nnet0: virtio=BC:24:11:23:00:30,bridge=vmbr30,link_down=1\nide2: local-lvm:vm-230-cloudinit,media=cdrom', afterKey: 'template', outputAfter: 'name: base-linux-qa\ntemplate: 1\ncores: 2\nmemory: 2048\nscsi0: local-lvm:base-230-disk-0,size=20G\nnet0: virtio=BC:24:11:23:00:30,bridge=vmbr30,link_down=1\nide2: local-lvm:vm-230-cloudinit,media=cdrom', key: 'baseConfig' },
      { host: 'pve02', input: 'qm status 230', output: 'status: running', runtimeOutputKey: 'base230', outputsByRuntime: { running: 'status: running', stopped: 'status: stopped' }, key: 'baseStatus' },
      { host: 'pve02', input: 'cat /srv/base230-readiness.txt', output: 'Base 230: immagine QA approvata\nCloud-init: ssh_deletekeys=true verificato dal team immagini\nPulizia cloud-init e machine-id: ancora da eseguire nel guest prima di convertire\nRegola: verificare host key, machine-id, hostname e IP del clone prima di collegare la rete\nRete iniziale: vmbr30 con link_down=1 (isolata)', key: 'readiness' },
      { host: 'pve02', input: 'pvesm status', output: 'Name        Type   Status    Total    Used    Available\nlocal       dir    active    100G     99G     1G\nlocal-lvm   lvmthin active   800G     240G   560G', key: 'storage' },
      { host: 'guest230', input: 'cloud-init clean --logs --machine-id', output: 'Simulatore: stato cloud-init ripulito; /etc/machine-id impostato a uninitialized. Spegni la base senza riavviarla.', key: 'cleanIdentity', requires: ['readiness'], requiresRuntime: { base230: 'running', identityClean: false }, setRuntime: { identityClean: true } },
      { host: 'guest230', input: 'cat /etc/machine-id', output: 'uninitialized', key: 'machineId', requires: ['cleanIdentity'], requiresRuntime: { base230: 'running', identityClean: true } },
      { host: 'pve02', input: 'qm shutdown 230', output: 'Simulatore: richiesta ACPI inviata e arresto ordinato della base 230 confermato.', key: 'shutdown', requires: ['baseConfig', 'baseStatus', 'readiness', 'storage', 'machineId'], requiresRuntime: { base230: 'running', identityClean: true }, setRuntime: { base230: 'stopped' } },
      { host: 'pve02', input: 'qm status 230 --verbose', output: 'status: stopped\nSimulatore: base pronta per la conversione.', key: 'stopped', requires: ['shutdown'], requiresRuntime: { base230: 'stopped' } },
      { host: 'pve02', input: 'qm template 230', output: 'Simulatore: VM 230 convertita in template; volume base convertito sullo storage.', key: 'template', requires: ['stopped'], requiresRuntime: { base230: 'stopped', template230: false }, setRuntime: { template230: true } },
      { host: 'pve02', input: 'qm config 230 --current', output: 'name: base-linux-qa\ntemplate: 1\ncores: 2\nmemory: 2048\nscsi0: local-lvm:base-230-disk-0,size=20G\nnet0: virtio=BC:24:11:23:00:30,bridge=vmbr30,link_down=1\nide2: local-lvm:vm-230-cloudinit,media=cdrom', key: 'templateConfig', requires: ['template'], requiresRuntime: { template230: true } },
      { host: 'pve02', input: 'qm clone 230 231 --name inventario-qa --full 1 --storage local-lvm', output: 'Simulatore: clone completo 231 creato in local-lvm; link_down=1 preservato. Uso reale dello storage dopo la copia deve essere misurato.', key: 'clone', requires: ['templateConfig'], requiresRuntime: { template230: true, clone231: 'absent' }, setRuntime: { clone231: 'stopped' } },
      { host: 'pve02', input: 'qm config 231', output: 'name: inventario-qa\ncores: 2\nmemory: 2048\nscsi0: local-lvm:vm-231-disk-0,size=20G\nnet0: virtio=BC:24:11:23:00:31,bridge=vmbr30,link_down=1\nide2: local-lvm:vm-231-cloudinit,media=cdrom', key: 'cloneConfig', requires: ['clone'] },
      { host: 'pve02', input: 'qm start 231', output: 'Simulatore: clone 231 avviato con link_down=1; identità del guest e IP richiedono ancora una verifica.', key: 'startClone', requires: ['cloneConfig'], requiresRuntime: { clone231: 'stopped' }, setRuntime: { clone231: 'running' } },
      { host: 'pve02', input: 'qm status 231', output: 'status: running', runtimeOutputKey: 'clone231', outputsByRuntime: { absent: 'VM 231 assente', stopped: 'status: stopped', running: 'status: running' }, key: 'cloneStatus', requires: ['startClone'] },
      { host: 'pve02', input: "qm snapshot 231 pre-update --description 'Prima aggiornamento QA'", output: 'Simulatore: snapshot locale pre-update creato su local-lvm; RAM non inclusa. Coerenza applicativa non verificata.', key: 'snapshot', requires: ['cloneStatus'], requiresRuntime: { clone231: 'running', snapshot231: false }, setRuntime: { snapshot231: true } },
      { host: 'pve02', input: 'qm listsnapshot 231', output: 'pre-update  Prima aggiornamento QA\ncurrent     stato corrente', key: 'snapshotList', requires: ['snapshot'], requiresRuntime: { snapshot231: true } },
      { host: 'pve02', input: 'cat /srv/qa231-backup-inventory.txt', output: 'Clone 231: backup su destinazione esterna assente\nTest di ripristino da copia esterna: assente\nUpgrade QA: non ancora eseguito', key: 'backupInventory' }
    ],
    choiceLabel: 'Sequenza per il clone QA', choices: [
      { id: 'safe', label: 'Spegnere la base, convertirla, creare un clone completo isolato e fare snapshot locale prima del test, poi pianificare backup esterno.' },
      { id: 'snapshot-only', label: 'Fare solo uno snapshot della base: copre anche la perdita del nodo.' },
      { id: 'linked-production', label: 'Clonare con collegamento e portare subito la nuova VM in rete di produzione senza verificare l’identità.' }
    ], correct: 'safe', success: 'Nel simulatore la base 230 è spenta e convertita in template, il clone completo 231 resta isolato ed è avviato, e pre-update compare fra gli snapshot locali. L’upgrade, l’identità del guest e un backup esterno con prova di ripristino restano pendenti.'
  },
  quizzes: [
    { question: 'Che cosa aggiunge --full 1 al clone di un template?', options: ['Una copia indipendente dei dischi del template', 'Un backup off-host verificato', 'Un IP univoco già confermato nel guest'], correct: 0, why: 'Il clone completo copia i dischi, senza dipendenza dal volume base; non crea un backup esterno né prova identità di rete unica.', analogy: 'Una fotocopia indipendente del modello resta comunque nello stesso edificio.' },
    { question: 'Perché il clone mantiene link_down=1 al primo avvio?', options: ['Perché il disco è pieno', 'Per impedire esposizione in rete prima della verifica di hostname, identità e IP', 'Per trasformare lo snapshot in backup'], correct: 1, why: 'Cloud-init e il MAC distinto riducono il rischio, ma l’identità del guest e la rete vanno verificate prima di collegarlo a produzione.', analogy: 'Si controlla il badge nuovo prima di aprire la porta verso il corridoio condiviso.' },
    { question: 'Uno snapshot su local-lvm garantisce ripristino dopo perdita del nodo e dello storage?', options: ['Sì, sempre', 'Solo se la VM è running', 'No: serve una copia indipendente e una prova di ripristino'], correct: 2, why: 'Lo snapshot è un punto locale sullo stesso storage; un guasto che rende indisponibili i volumi può eliminare anche lo snapshot.', analogy: 'Un segnalibro nel libro non sostituisce una copia conservata altrove.' }
  ],
  decision: { prompt: 'Lo snapshot pre-update è elencato. Il team può dichiarare recuperabilità dopo perdita del nodo?', options: [
    { id: 'yes', label: 'Sì: la lista degli snapshot certifica un backup completo.', correct: false, why: 'La lista prova solo un punto locale; non esiste copia off-host né test di ripristino.' },
    { id: 'pending', label: 'No: usare lo snapshot per rollback locale e predisporre backup esterno con ripristino verificato.', correct: true, why: 'Separa reversibilità di una modifica dalla resilienza alla perdita del nodo/storage.' },
    { id: 'clone', label: 'Sì: il clone completo 231 è sullo stesso local-lvm.', correct: false, why: 'Il clone è indipendente dal template ma condivide il rischio di perdita dello storage locale.' }
  ] },
  procedure: ['Conferma checklist e storage, poi pulisci cloud-init e machine-id nel guest.', 'Verifica uninitialized; arresta la VM-base ordinatamente e conferma stopped.', 'Converte in template e controlla template: 1.', 'Crea clone completo distinto e preserva isolamento fino alla verifica dell’identità.', 'Avvia il clone in isolamento; crea ed elenca lo snapshot prima del test.', 'Registra backup esterno, prova di ripristino e upgrade come ancora pendenti.'],
  validation: 'La base 230 è stata pulita con cloud-init clean --logs --machine-id, /etc/machine-id mostra uninitialized prima dello shutdown, poi la base è stopped e template: 1. Il clone completo 231 su local-lvm ha disco separato e link_down=1; il suo avvio non prova ancora host key, machine-id, hostname o IP unici nel guest. Lo snapshot locale pre-update è presente, senza RAM inclusa e senza prova di coerenza applicativa. Non sono stati eseguiti upgrade, backup esterno o ripristino: nessuna dichiarazione di recuperabilità dopo perdita del nodo è valida.',
  diaryPrompt: 'Registra stato base/template, modalità e storage del clone, isolamento della rete, snapshot pre-update e tre prove ancora mancanti: identità guest, backup esterno e ripristino.',
  closing: 'Hai separato ripetibilità, copia di lavoro, rollback locale e recupero da disastro. La prossima lezione passa ai container LXC e ai limiti rispetto a una VM.',
  images: ['assets/aula-16-p1-v1.png', 'assets/aula-16-p2-v1.png']
};





