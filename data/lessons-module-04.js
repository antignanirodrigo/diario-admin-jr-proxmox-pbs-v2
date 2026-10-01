import { lesson14 } from './lesson14.js';
import { lesson15 } from './lesson15.js';
import { lesson16 } from './lesson16.js';

export const module04 = [
  {
    id: 13, title: 'Creare una VM con scelte consapevoli', module: 'Macchine virtuali KVM', duration: '45–55 min', xp: 220,
    summary: 'Confronta i requisiti di un’immagine Linux con firmware, macchina, CPU, RAM, ISO e bridge di una VM prima dell’avvio.',
    ticket: 'Ticket INF-113 · La VM 210, preparata per un’immagine Linux interna che richiede UEFI, non avvia il supporto di installazione. La bozza usa SeaBIOS, una sola vCPU, 2 GiB di RAM e vmbr9. Devi confrontarla con il profilo approvato prima di correggere la configurazione.',
    impact: 'Avviare la VM con firmware incompatibile può impedire il boot. Risorse inferiori al profilo e una bridge diversa da quella approvata aggiungono rischi che il solo cambio di ISO non risolverebbe.',
    story: 'Il Junior voleva sostituire subito la ISO. Il Senior fermò l’avvio: «Prima leggiamo i requisiti dell’immagine e la configurazione della VM. Se il firmware non coincide, cambiare il file non corregge la causa; se la rete punta alla bridge sbagliata, avremo un secondo ticket dopo l’installazione».',
    concepts: [['ISO di installazione', 'Supporto che fornisce il sistema da installare; la sua presenza non garantisce un boot compatibile.'], ['Firmware e macchina', 'SeaBIOS e OVMF sono firmware diversi; il profilo UEFI richiede OVMF e una configurazione coerente.'], ['CPU e memoria', 'vCPU e RAM vanno confrontate con il profilo approvato e la capacità del nodo.'], ['Scheda e bridge', 'net0 collega il guest a una bridge; il percorso va verificato prima di attribuire il guasto al sistema operativo.']],
    analogy: 'Avere il disco giusto non basta se il lettore usa un formato diverso. Dopo l’avvio, serve anche collegare la macchina al corridoio di rete corretto.',
    recall: { question: 'Quali elementi confronti prima di avviare una VM creata da una ISO interna?', answer: 'Requisiti dell’immagine, ISO disponibile, firmware e macchina, vCPU, RAM, ordine di boot, disco EFI quando previsto e bridge di net0.' },
    lab: {
      context: 'Laboratorio simulato su pve02. Il file dei requisiti e l’inventario ISO sono documenti didattici, non percorsi standard PVE. Nessuna VM reale viene modificata o avviata.',
      steps: ['Leggi il profilo approvato e verifica la ISO disponibile.', 'Ispeziona la configurazione della VM 210.', 'Confronta firmware, macchina, CPU, RAM, disco EFI e bridge.', 'Scegli un piano coerente e registra ciò che resta da verificare dopo l’avvio.'],
      commands: [
        { host: 'pve02', input: 'cat /srv/vm210-requirements.txt', output: 'VM 210: linux-lab interno\nBoot richiesto: UEFI (OVMF) con disco EFI\nMacchina approvata: q35\nCPU: 2 vCPU\nMemoria: 4096 MiB\nRete: vmbr0\nISO approvata: local:iso/linux-lab-uefi.iso', key: 'requirements' },
        { host: 'pve02', input: 'cat /srv/iso-inventory.txt', output: 'local:iso/linux-lab-uefi.iso  presente\nChecksum e provenienza: verificati dal team immagini', key: 'iso' },
        { host: 'pve02', input: 'qm config 210', output: 'name: linux-lab\nbios: seabios\nmachine: pc-i440fx\ncores: 1\nmemory: 2048\nide2: local:iso/linux-lab-uefi.iso,media=cdrom\nscsi0: local-lvm:vm-210-disk-0,size=32G\nnet0: virtio=BC:24:11:21:00:10,bridge=vmbr9\nboot: order=ide2;scsi0', key: 'vmconfig' },
        { host: 'pve02', input: 'pvesm status', output: 'Name        Type   Status    Total    Used    Available\nlocal       dir    active    100G     99G     1G\nlocal-lvm   lvmthin active   800G     240G   560G', key: 'storage' }
      ],
      choiceLabel: 'Piano per correggere la bozza', choices: [
        { id: 'iso-only', label: 'Sostituire la ISO e lasciare SeaBIOS, 1 vCPU e vmbr9.' },
        { id: 'profile', label: 'Usare OVMF con disco EFI, q35, 2 vCPU, 4096 MiB e net0 su vmbr0; poi provare boot e rete.' },
        { id: 'open-network', label: 'Disattivare il firewall e aumentare la RAM senza leggere il firmware.' }
      ], correct: 'profile', success: 'Il piano corrisponde al profilo interno e alla ISO presente. È una scelta simulata: configurazione, boot e accesso di rete restano da applicare e verificare.'
    },
    quizzes: [
      { question: 'La ISO presente prova che la VM farà boot?', options: ['Sì, sempre', 'No, firmware e ordine di boot devono essere compatibili', 'Solo se la VM ha più RAM'], correct: 1, why: 'La presenza della ISO non risolve l’incompatibilità fra il profilo UEFI dell’immagine e SeaBIOS nella bozza.', analogy: 'Il disco può essere integro e il lettore usarne il formato sbagliato.' },
      { question: 'Quale impostazione della bozza contraddice direttamente il boot UEFI richiesto?', options: ['bios: seabios', 'name: linux-lab', 'ISO local:iso/linux-lab-uefi.iso'], correct: 0, why: 'SeaBIOS è firmware legacy; il profilo didattico richiede OVMF e un disco EFI per persistere le variabili.', analogy: 'L’etichetta del file non cambia il lettore installato.' },
      { question: 'Perché controllare net0 prima di chiudere il ticket?', options: ['Perché la bridge non influisce sulla rete', 'Perché vmbr9 può lasciare la VM isolata dopo il boot', 'Perché net0 sceglie la ISO'], correct: 1, why: 'La bozza usa vmbr9 mentre il profilo approvato usa vmbr0; il boot riuscito non prova connettività.', analogy: 'Accendere la macchina non collega automaticamente il suo cavo al corridoio giusto.' }
    ],
    decision: { prompt: 'Dopo aver scelto il profilo coerente, quando puoi dichiarare la VM pronta?', options: [
      { id: 'now', label: 'Subito: la scelta nel simulatore dimostra già il boot.', correct: false, why: 'La scelta è solo un piano; nessuna modifica o prova reale è stata eseguita.' },
      { id: 'verify', label: 'Dopo aver applicato la configurazione, avviato la VM dalla ISO e verificato rete e risorse.', correct: true, why: 'La configurazione proposta deve essere applicata e testata prima di validare la VM.' },
      { id: 'iso', label: 'Quando la ISO compare nell’inventario, senza altri test.', correct: false, why: 'La presenza della ISO non prova la compatibilità di firmware, boot o rete.' }
    ] },
    procedure: ['Conferma provenienza e requisiti dell’immagine.', 'Leggi ISO e configurazione attuale della VM.', 'Confronta firmware, macchina, disco EFI, risorse, ordine di boot e bridge.', 'Applica le modifiche in una finestra autorizzata e prova boot, risorse e connettività.'],
    validation: 'Il profilo richiede OVMF, disco EFI, q35, 2 vCPU, 4096 MiB e vmbr0. La bozza ha SeaBIOS, pc-i440fx, 1 vCPU, 2048 MiB, vmbr9 e nessun disco EFI. local resta quasi pieno come nella lezione 07: va preservato come rischio operativo, benché la ISO risulti già presente. Il piano è coerente, ma il laboratorio non applica né avvia la VM.',
    diaryPrompt: 'Registra requisiti, configurazione osservata, differenze, piano scelto e tre verifiche da fare dopo l’avvio.',
    closing: 'Hai imparato a leggere le scelte di creazione invece di usare valori predefiniti senza prova. La prossima lezione affronterà disco VirtIO e Guest Agent.',
    images: ['assets/aula-13-p1-v2.png', 'assets/aula-13-p2-v3.png']
  },
  lesson14,
  lesson15,
  lesson16
];
