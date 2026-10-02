import { commandGuideModule02 } from './command-guide-module-02.js';
import { commandGuideModule03 } from './command-guide-module-03.js';
import { commandGuideModule04 } from './command-guide-module-04.js';
import { commandGuideModule05 } from './command-guide-module-05.js';
import { commandGuide21 } from './command-guide-21.js';

// Guida didattica: la sintassi di aiuto è verificata nelle documentazioni ufficiali.
// Gli output del terminale restano esempi simulati, non trascrizioni delle man page.
export const commandGuide = {
  1: [
    { input: 'pveversion -v', purpose: 'Controllare versione e pacchetti del nodo PVE.', parts: [['pveversion', 'mostra la versione di Proxmox VE'], ['-v', 'modalità dettagliata: include le versioni dei pacchetti']], read: 'La presenza di proxmox-ve e pve-manager identifica il nodo PVE; le versioni mostrate sono dati del laboratorio.', help: 'man pveversion', helpOutput: 'Manuale di pveversion: consulta sintassi e opzioni disponibili sul nodo reale.' },
    { input: 'qm list', purpose: 'Elencare le macchine virtuali gestite dal nodo.', parts: [['qm', 'gestisce le VM QEMU/KVM di Proxmox VE'], ['list', 'sottocomando che elenca le VM']], read: 'VMID 100 identifica la VM gestionale; running indica che è accesa. Non prova che l’applicazione funzioni.', help: 'qm help', helpOutput: 'Aiuto qm: usa i sottocomandi per operare sulle VM; list mostra l’elenco e lo stato.' },
    { input: 'proxmox-backup-manager versions', purpose: 'Identificare la versione del nodo PBS.', parts: [['proxmox-backup-manager', 'strumento amministrativo CLI del PBS'], ['versions', 'sottocomando che mostra le versioni installate']], read: 'La riga proxmox-backup-server identifica il prodotto; non dimostra che esista già un backup valido.', help: 'proxmox-backup-manager help versions', helpOutput: 'Aiuto PBS: versions mostra le versioni dei componenti installati.' }
  ],
  2: [
    { input: 'cat /srv/inventario-host.txt', purpose: 'Leggere il file di inventario dei candidati.', parts: [['cat', 'scrive il contenuto di un file nel terminale'], ['/srv/inventario-host.txt', 'percorso del file da leggere; è un argomento, non un’opzione']], read: 'Confronta RAM, virtualizzazione, dischi e NIC dei tre server; questo file è fittizio nel laboratorio.', help: 'cat --help', helpOutput: 'Uso: cat [OPZIONE]... [FILE]...\nFILE indica uno o più file da leggere.' },
    { input: 'lscpu', purpose: 'Ispezionare le caratteristiche della CPU del candidato.', parts: [['lscpu', 'elenca architettura e caratteristiche della CPU'], ['nessuna opzione', 'qui si usa l’output predefinito']], read: 'Virtualization: AMD-V indica la capacità riportata dal sistema; in un host reale verifica anche che KVM sia utilizzabile.', help: 'lscpu --help', helpOutput: 'Uso: lscpu [opzioni]\nMostra informazioni sull’architettura della CPU.' },
    { input: 'free -h', purpose: 'Leggere la memoria con unità comprensibili.', parts: [['free', 'mostra memoria fisica e swap'], ['-h', 'human-readable: usa unità come GiB']], read: 'available è una stima più utile della sola colonna free per valutare il margine; non sostituisce una misura sotto carico.', help: 'free --help', helpOutput: 'Uso: free [opzioni]\n-h, --human: mostra valori in formato leggibile.' },
    { input: 'lsblk -o NAME,SIZE,TYPE', purpose: 'Vedere i dispositivi a blocchi e solo le colonne necessarie.', parts: [['lsblk', 'elenca dispositivi a blocchi'], ['-o', 'seleziona le colonne dell’output'], ['NAME,SIZE,TYPE', 'nomi delle tre colonne, separati da virgole; non sono tre opzioni']], read: 'Due righe disk indicano due dispositivi; da sole non dimostrano che sia configurato un mirror.', help: 'lsblk --help', helpOutput: 'Uso: lsblk [opzioni] [dispositivo...]\n-o, --output <lista>: seleziona colonne separate da virgole.' }
  ],
  3: [
    { input: 'ip -br addr', purpose: 'Vedere rapidamente indirizzi e stato delle interfacce.', parts: [['ip', 'mostra e gestisce oggetti di rete Linux'], ['-br', 'brief: output sintetico'], ['addr', 'sottocomando per gli indirizzi delle interfacce']], read: 'vmbr0, vmbr1 e vmbr2 sono bridge con indirizzi /24. UP indica stato operativo, non prova raggiungibilità end-to-end.', help: 'ip --help', helpOutput: 'Uso: ip [OPZIONI] OGGETTO COMANDO\n-br, -brief: mostra un output sintetico; addr riguarda gli indirizzi.' },
    { input: 'ip route', purpose: 'Leggere le rotte del nodo.', parts: [['ip', 'strumento di rete Linux'], ['route', 'sottocomando per la tabella di instradamento']], read: 'default via 10.10.10.1 usa vmbr0; le altre reti sono direttamente collegate. Le rotte non provano che il firewall consenta l’accesso.', help: 'ip --help', helpOutput: 'Uso: ip [OPZIONI] OGGETTO COMANDO\nroute è l’oggetto per la tabella di instradamento.' },
    { input: 'ss -lnt', purpose: 'Individuare porte TCP in ascolto senza risoluzione DNS.', parts: [['ss', 'mostra socket di rete'], ['-l', 'solo socket in ascolto'], ['-n', 'indirizzi e porte numerici'], ['-t', 'solo TCP']], read: '0.0.0.0:8006 indica ascolto su tutti gli indirizzi IPv4 locali. Non prova che ogni rete possa raggiungere la GUI.', help: 'ss --help', helpOutput: 'Uso: ss [OPZIONI]\n-l: listening; -n: numeric; -t: TCP.' }
  ],
  4: [
    { input: 'cat /srv/soglie.txt', purpose: 'Leggere gli obiettivi di continuità approvati.', parts: [['cat', 'scrive il contenuto di un file nel terminale'], ['/srv/soglie.txt', 'percorso del file simulato; argomento, non opzione']], read: 'RPO massimo 15 minuti e RTO massimo 120 minuti sono soglie di accettazione, non risultati già misurati.', help: 'cat --help', helpOutput: 'Uso: cat [OPZIONE]... [FILE]...\nFILE indica uno o più file da leggere.' },
    { input: 'cat /srv/incidente.txt', purpose: 'Leggere gli orari dell’incidente e della prova.', parts: [['cat', 'mostra il contenuto del file'], ['/srv/incidente.txt', 'percorso del file simulato da leggere']], read: 'Dalle 16:50 alle 17:00 derivano 10 minuti di perdita; dalle 17:00 alle 18:15 derivano 75 minuti di fermo.', help: 'cat --help', helpOutput: 'Uso: cat [OPZIONE]... [FILE]...\nFILE indica uno o più file da leggere.' },
    { input: 'simula-ripristino', purpose: 'Avviare la prova didattica del ripristino.', parts: [['simula-ripristino', 'comando inventato per questo simulatore; NON esiste come comando standard Linux/PVE/PBS'], ['nessuna opzione', 'il prototipo accetta solo questa forma']], read: 'Il risultato confronta 10 minuti di perdita e 75 minuti di fermo con le soglie. Non certifica un ripristino reale.', help: 'simula-ripristino --help', helpOutput: 'SOLO SIMULATORE DIDATTICO\nUso: simula-ripristino\nEsegue la prova fittizia della lezione; non è un comando reale.' }
  ],
  ...commandGuideModule02,
  ...commandGuideModule03,
  ...commandGuideModule04,
  ...commandGuideModule05,
  21: commandGuide21
};

export function getCommandGuide(lessonId, input) {
  return commandGuide[lessonId]?.find(item => item.input === input);
}
