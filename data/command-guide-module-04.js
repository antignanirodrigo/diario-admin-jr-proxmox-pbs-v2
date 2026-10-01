import { commandGuide14 } from './command-guide-14.js';
import { commandGuide15 } from './command-guide-15.js';
import { commandGuide16 } from './command-guide-16.js';

export const commandGuideModule04 = {
  13: [
    { input: 'cat /srv/vm210-requirements.txt', purpose: 'Leggere il profilo interno approvato per la VM 210.', parts: [['cat', 'mostra il contenuto del file'], ['/srv/vm210-requirements.txt', 'percorso didattico del profilo; argomento, non opzione']], read: 'Il documento richiede UEFI/OVMF, disco EFI, q35, 2 vCPU, 4096 MiB, vmbr0 e una ISO precisa. È un requisito del caso, non una regola universale per Linux.', help: 'cat --help', helpOutput: 'Uso: cat [OPZIONE]... [FILE]...\nFILE è il percorso da leggere; il comando non modifica il file.' },
    { input: 'cat /srv/iso-inventory.txt', purpose: 'Verificare che la ISO approvata compaia nell’inventario didattico.', parts: [['cat', 'mostra un file'], ['/srv/iso-inventory.txt', 'inventario simulato delle immagini ISO']], read: 'La ISO indicata nel profilo è presente e risulta verificata dal team; questo non prova che la VM avvii.', help: 'cat --help', helpOutput: 'Uso: cat [OPZIONE]... [FILE]...\nFILE è il percorso da leggere; il comando non modifica il file.' },
    { input: 'qm config 210', purpose: 'Leggere la configurazione attuale della VM 210.', parts: [['qm', 'gestisce le VM QEMU/KVM di Proxmox VE'], ['config', 'mostra la configurazione senza modificarla'], ['210', 'VMID della macchina esaminata']], read: 'Confronta BIOS, macchina, vCPU, RAM, ISO, boot, disco EFI e bridge con il profilo. SeaBIOS e l’assenza di disco EFI non rispettano il requisito UEFI del caso.', help: 'qm help config', helpOutput: 'Aiuto qm config: qm config <vmid> mostra la configurazione della VM indicata.' },
    { input: 'pvesm status', purpose: 'Controllare stato e spazio degli storage del nodo.', parts: [['pvesm', 'gestisce gli storage configurati in PVE'], ['status', 'mostra stato e capacità degli storage']], read: 'local e local-lvm sono attivi; local resta quasi pieno (99G su 100G), coerente con la lezione 07. Storage attivo e ISO presente non provano il boot né autorizzano un nuovo backup su local.', help: 'pvesm help status', helpOutput: 'Aiuto pvesm status: mostra stato e capacità degli storage configurati sul nodo.' }
  ],
  14: commandGuide14,
  15: commandGuide15,
  16: commandGuide16
};
