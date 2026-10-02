// Pronta per revisione tecnica; non attivare prima delle due tavole approvate.
export const lesson21 = {
  id: 21, title: 'Tipi di storage e contenuti ammessi', module: 'Archiviazione e integrità', duration: '55–70 min', xp: 300,
  summary: 'Distingui il tipo di backend dai contenuti consentiti e scegli dove cercare una ISO, un disco VM e il rootfs di un CT senza spostare dati.',
  ticket: 'Ticket INF-121 · L’interfaccia non offre local-lvm come destinazione per una ISO Debian. Il responsabile chiede se il pool è guasto. La ISO didattica è già in local; VM 100 e CT 301 restano sui rispettivi volumi di local-lvm. Serve una diagnosi, non un upload.',
  impact: 'Cambiare backend alla cieca o dichiarare un pool guasto può interrompere il lavoro e creare un rischio inutile. Il tipo di contenuto ammesso spiega perché un disco virtuale e un file ISO non compaiono nello stesso selettore.',
  story: 'Il Junior cercò local-lvm nel selettore delle ISO e non lo trovò. «È offline?». Il Senior aprì la configurazione e rispose: «Prima separiamo due domande: il pool è attivo e accetta quel contenuto?». Le letture mostrarono local-lvm attivo, ma configurato per immagini VM e rootfs. La ISO era già in local. Registrarono il destino corretto senza caricare, spostare o creare nulla.',
  concepts: [
    ['Backend e contenuto', 'Il backend definisce come lo storage conserva dati; content limita quali artefatti PVE possono essere collocati lì.'],
    ['Directory local', 'Nel caso simulato è un filesystem locale con contenuti iso, vztmpl e backup; non è automaticamente condiviso.'],
    ['LVM-thin local-lvm', 'Nel caso simulato è un thin pool locale per images e rootdir; non accetta ISO come file.'],
    ['Inventario e capacità', 'pvesm status indica stato/capacità; pvesm list con --content mostra volumi di un tipo, ma non modifica lo storage.']
  ],
  analogy: 'Una scaffalatura può essere aperta e avere spazio, ma ogni ripiano ammette materiali diversi: la disponibilità non cambia la categoria dell’oggetto.',
  recall: { question: 'Perché local-lvm non appare come destinazione ISO in INF-121?', answer: 'La configurazione content di local-lvm ammette images e rootdir, non iso; il pool è attivo e la ISO esiste già in local.' },
  lab: {
    context: 'Console simulata di pve02. ISO e volumi sono dati didattici preesistenti; nessun upload, spostamento o allocazione avviene nel laboratorio.',
    steps: ['Leggi backend e content di local e local-lvm.', 'Verifica che i due storage siano attivi e osserva la capacità senza chiamarla garanzia.', 'Filtra l’inventario per ISO, images e rootdir.', 'Scegli i destini e documenta che nessun volume è stato spostato.'],
    commands: [
      { host: 'pve02', input: 'cat /etc/pve/storage.cfg', output: 'dir: local\n        path /var/lib/vz\n        content iso,vztmpl,backup\nlvmthin: local-lvm\n        vgname pve\n        thinpool data\n        content images,rootdir', key: 'config' },
      { host: 'pve02', input: 'pvesm status', output: 'Name       Type     Status     Total       Used       Available\nlocal      dir      active     104857600   31457280   73400320\nlocal-lvm  lvmthin  active     209715200   104857600  104857600', key: 'status', requires: ['config'] },
      { host: 'pve02', input: 'pvesm list local --content iso', output: 'Volid                                      Format  Type  Size\nlocal:iso/debian-12.8.0-amd64-netinst.iso iso     iso   692060160', key: 'iso', requires: ['status'] },
      { host: 'pve02', input: 'pvesm list local-lvm --content images', output: 'Volid                      Format  Type    Size\nlocal-lvm:vm-100-disk-0     raw     images  34359738368', key: 'images', requires: ['iso'] },
      { host: 'pve02', input: 'pvesm list local-lvm --content rootdir', output: 'Volid                      Format  Type     Size\nlocal-lvm:vm-301-disk-0     raw     rootdir  8589934592', key: 'rootdir', requires: ['images'] }
    ],
    choiceLabel: 'Dove collochi ogni contenuto nel ticket?', choices: [
      { id: 'swap', label: 'ISO su local-lvm, VM 100 e CT 301 su local' },
      { id: 'mapped', label: 'ISO su local; disco VM e rootfs CT su local-lvm' },
      { id: 'offline', label: 'Dichiaro local-lvm guasto e cambio la configurazione' }
    ], correct: 'mapped', success: 'Diagnosi confermata: ISO esistente in local, volumi VM e CT in local-lvm. Nessun upload, volume o configurazione modificati.'
  },
  quizzes: [
    { question: 'Che cosa prova pvesm status?', options: ['Tipo, stato e capacità dei pool configurati', 'Che una ISO è stata caricata', 'Che uno storage locale è condiviso'], correct: 0, why: 'La tabella mostra disponibilità e capacità, non crea artefatti né verifica accesso da altri nodi.', analogy: 'Vedere un magazzino aperto non prova che ogni tipo di merce sia presente.' },
    { question: 'Quale content è appropriato per un disco VM PVE?', options: ['iso', 'images', 'vztmpl'], correct: 1, why: 'images identifica dischi di macchine virtuali; iso è file di installazione e vztmpl è template CT.', analogy: 'Un disco installato e un DVD di installazione occupano scaffali diversi.' },
    { question: 'Che cosa fa --content in pvesm list local --content iso?', options: ['Converte local in un pool ISO', 'Cancella i contenuti diversi', 'Filtra la lista al tipo iso'], correct: 2, why: 'Il filtro limita le righe mostrate. Non cambia backend, impostazioni né volumi.', analogy: 'Un filtro di catalogo non sposta gli oggetti sugli scaffali.' }
  ],
  decision: { prompt: 'Il responsabile propone di “riparare” local-lvm per farci comparire la ISO. Che cosa documenti?', options: [
    { id: 'change', label: 'Cambio content di local-lvm alla cieca.', correct: false, why: 'Il backend LVM-thin non è la destinazione per file ISO; il pool risulta attivo.' },
    { id: 'map', label: 'Uso la ISO già presente in local e lascio i volumi gestiti in local-lvm.', correct: true, why: 'La configurazione e l’inventario osservati spiegano il selettore senza mutazioni.' },
    { id: 'copy', label: 'Dichiaro che un upload invisibile è stato completato.', correct: false, why: 'Nessun comando o evidenza dimostra un upload.' }
  ] },
  procedure: ['Leggi storage.cfg prima di interpretare il selettore.', 'Controlla stato e capacità senza confondere spazio e contenuto.', 'Filtra l’inventario ISO, images e rootdir con pvesm list.', 'Documenta il destino corretto e l’assenza di mutazioni.'],
  validation: 'Nel laboratorio simulato local e local-lvm sono active. local contiene la ISO didattica; local-lvm contiene il disco della VM 100 e il rootfs del CT 301. La selezione è spiegata da content. Non sono avvenuti upload, spostamenti, allocazioni, modifiche della configurazione o test di storage condiviso.',
  diaryPrompt: 'Registra backend, content e volid dei tre artefatti; spiega perché local-lvm non è guasto e che cosa resta da verificare prima di un futuro cambio di capacità.',
  closing: 'Hai distinto disponibilità del pool e compatibilità del contenuto. Nella prossima lezione disegnerai la ridondanza di un pool ZFS senza confonderla con il backup.',
  images: ['assets/aula-21-p1-v3.png', 'assets/aula-21-p2-v6.png']
};
