export const lesson19 = {
  id: 19, title: 'Bind mount e UID/GID mappati', module: 'Container LXC', duration: '70–90 min', xp: 300,
  summary: 'Diagnostica un accesso negato a un bind mount del CT 301 e correggi solo la directory dedicata usando gli ID mappati verificati.',
  ticket: 'Ticket INF-119 · Il CT 301 della lezione 18 risponde dall’host. Il team vuole esporre nel CT una directory di contenuto già preparata su pve02, /mnt/bindmounts/web-int, senza copiare i file nel rootfs. Dopo il mount in sola lettura, www-data riceve Permission denied. Il collega propone chmod 777 oppure passare a CT privilegiato.',
  impact: 'Un bind mount attraversa il confine degli UID/GID: il proprietario visibile nel CT può non coincidere con l’ID dell’host. Aprire permessi globali o privilegiare il CT nasconde il problema e amplia l’accesso. I dati di un bind mount non entrano nel backup vzdump del CT.',
  story: 'Il Junior vide il diniego e cercò il comando chmod. Il Senior gli fece leggere prima proprietario, permessi e mapping effettivo. «Il servizio usa UID 33 nel CT; in questo caso uid_map e gid_map mostrano che l’intervallo parte da 100000. Il file deve essere leggibile da 100033 sull’host, ma solo in questa directory dedicata». Fermarono il CT per aggiungere mp0, provarono il diniego, corressero la proprietà della sola fonte dedicata e ripeterono la lettura. Il piano di backup del contenuto rimase separato.',
  concepts: [
    ['Bind mount', 'Espone una directory dell’host nel CT tramite mp0; non è volume gestito da PVE e il suo contenuto non è incluso in vzdump.'],
    ['Mappatura UID/GID', 'Nel caso mostrato da uid_map/gid_map, root nel CT corrisponde a 100000 sull’host; www-data UID/GID 33 corrisponde a 100033. Verifica sempre il mapping effettivo.'],
    ['Permessi mirati', 'Proprietà 100033:100033 e directory 0750 limitano la lettura al servizio mappato; chmod 777 concederebbe accesso troppo ampio.'],
    ['ro=1', 'Il mount in sola lettura impedisce scritture attraverso il CT, ma non sostituisce backup né controllo del percorso sorgente.']
  ],
  analogy: 'Il CT vede un badge con numero 33, mentre l’host lo registra come 100033. Devi consegnare la chiave al numero registrato dall’host, non aprire tutte le porte.',
  recall: { question: 'Che cosa succede ai file di un bind mount quando esegui un backup vzdump del CT?', answer: 'Il contenuto del bind mount non viene incluso; serve un piano di backup e ripristino separato per la directory host.' },
  lab: {
    context: 'Simulazione su pve02 e CT 301. La directory /mnt/bindmounts/web-int è dedicata a questo esercizio, contiene solo index.html e non contiene symlink; non applicare chown ricorsivo a percorsi condivisi o di sistema. Il mapping 100000:65536 è verificato tramite uid_map/gid_map nel caso, non presunto universale.',
    steps: ['Conferma CT 301 e proprietario/permessi della directory e del file host.', 'Ferma il CT, aggiungi mp0 in sola lettura e riavvia; dimostra il diniego come www-data.', 'Leggi UID/GID del servizio e uid_map/gid_map effettivi prima di cambiare proprietà.', 'Correggi la piccola fonte dedicata, verifica directory, file e lettura come www-data; registra il backup separato necessario.'],
    initialRuntime: { ct301: 'running', mount301: false, owner301: 'root' },
    expectedRuntime: { ct301: 'running', mount301: true, owner301: 'mapped' },
    commands: [
      { host: 'pve02', input: 'pct config 301', output: 'hostname: web-int-ct\nunprivileged: 1\nrootfs: local-lvm:vm-301-disk-0,size=8G\nnet0: name=eth0,bridge=vmbr0,ip=10.10.10.31/24,gw=10.10.10.1,firewall=1', key: 'config' },
      { host: 'pve02', input: "stat -c '%u:%g %a' /mnt/bindmounts/web-int", output: '0:0 750', key: 'hostBefore' },
      { host: 'pve02', input: "stat -c '%u:%g %a %n' /mnt/bindmounts/web-int/index.html", output: '0:0 640 /mnt/bindmounts/web-int/index.html', key: 'fileBefore', requires: ['hostBefore'] },
      { host: 'pve02', input: 'pct shutdown 301', output: 'CT 301 stopped (simulazione)', key: 'shutdown', requires: ['config', 'fileBefore'], requiresRuntime: { ct301: 'running' }, setRuntime: { ct301: 'stopped' } },
      { host: 'pve02', input: 'pct set 301 -mp0 /mnt/bindmounts/web-int,mp=/srv/content,ro=1', output: 'mp0: /mnt/bindmounts/web-int,mp=/srv/content,ro=1', key: 'mount', requires: ['shutdown'], requiresRuntime: { ct301: 'stopped' }, setRuntime: { mount301: true } },
      { host: 'pve02', input: 'pct start 301', output: 'CT 301 started (simulazione)', key: 'restart', requires: ['mount'], requiresRuntime: { ct301: 'stopped', mount301: true }, setRuntime: { ct301: 'running' } },
      { host: 'pve02', input: 'pct exec 301 -- id www-data', output: 'uid=33(www-data) gid=33(www-data) groups=33(www-data)', key: 'serviceId', requires: ['restart'] },
      { host: 'pve02', input: 'cat /etc/subuid', output: 'root:100000:65536', key: 'subuid', requires: ['serviceId'] },
      { host: 'pve02', input: 'cat /etc/subgid', output: 'root:100000:65536', key: 'subgid', requires: ['subuid'] },
      { host: 'pve02', input: 'pct exec 301 -- cat /proc/self/uid_map', output: '         0     100000      65536', key: 'uidMap', requires: ['subgid'] },
      { host: 'pve02', input: 'pct exec 301 -- cat /proc/self/gid_map', output: '         0     100000      65536', key: 'gidMap', requires: ['uidMap'] },
      { host: 'pve02', input: 'pct exec 301 -- runuser -u www-data -- cat /srv/content/index.html', output: 'cat: /srv/content/index.html: Permission denied\nSimulatore: il comando ospite termina con exit status 1.', key: 'denied', requires: ['gidMap'] },
      { host: 'pve02', input: 'chown -R 100033:100033 /mnt/bindmounts/web-int', output: 'Proprietà modificata SOLO nella directory dedicata del laboratorio (simulazione).', key: 'ownerFix', requires: ['denied'], setRuntime: { owner301: 'mapped' } },
      { host: 'pve02', input: "stat -c '%u:%g %a %n' /mnt/bindmounts/web-int", output: '100033:100033 750 /mnt/bindmounts/web-int', key: 'hostAfter', requires: ['ownerFix'], requiresRuntime: { owner301: 'mapped' } },
      { host: 'pve02', input: "stat -c '%u:%g %a %s %n' /mnt/bindmounts/web-int/index.html", output: '100033:100033 640 34 /mnt/bindmounts/web-int/index.html', key: 'fileAfter', requires: ['hostAfter'], requiresRuntime: { owner301: 'mapped' } },
      { host: 'pve02', input: 'pct exec 301 -- runuser -u www-data -- test -r /srv/content/index.html', output: 'Simulatore: il comando ospite termina con exit status 0; lettura consentita a www-data.', key: 'readAfter', requires: ['fileAfter'], requiresRuntime: { ct301: 'running', owner301: 'mapped' } }
    ],
    choiceLabel: 'Come chiudi l’errore di permesso?', choices: [
      { id: 'open', label: 'chmod -R 777 sulla directory e nessun piano di backup aggiuntivo.' },
      { id: 'mapped', label: 'Verifico il mapping, assegno la directory dedicata a 100033:100033, mantengo ro=1 e pianifico backup separato.' },
      { id: 'priv', label: 'Rendo privilegiato il CT per far coincidere tutti gli ID.' }
    ], correct: 'mapped', success: 'www-data legge il file nel CT con mp0 in sola lettura. Proprietà corretta solo nella directory dedicata; il contenuto bind resta fuori dal backup CT e richiede copia separata.'
  },
  quizzes: [
    { question: 'Perché UID 33 nel CT corrisponde a 100033 sull’host nel caso?', options: ['Perché il mapping verificato parte da 100000', 'Perché Nginx usa sempre UID 100033 ovunque', 'Perché ro=1 cambia gli UID'], correct: 0, why: 'Il mapping del caso parte da 100000 e somma l’UID 33. L’offset deve essere verificato, non assunto in qualunque ambiente.', analogy: 'Due elenchi numerano la stessa persona con offset diverso.' },
    { question: 'Quale effetto ha ro=1 sul mount?', options: ['Include automaticamente i file nel backup CT', 'Impedisce scritture dal CT attraverso mp0', 'Rende il CT una VM'], correct: 1, why: 'ro=1 limita la scrittura via mount. Il backup dei dati bind resta una responsabilità separata.', analogy: 'Puoi leggere il libro, ma non scriverci; serve comunque una copia di sicurezza.' },
    { question: 'Che cosa entra in vzdump quando mp0 è un bind mount host?', options: ['Tutti i file di mp0', 'Una copia magica dal PBS', 'La configurazione può registrare mp0, ma non i file del bind mount'], correct: 2, why: 'PVE non gestisce il contenuto di bind mounts come volume di storage nel backup del CT. Devi proteggerlo a parte.', analogy: 'L’inventario registra l’indirizzo del magazzino, non porta via la merce.' }
  ],
  decision: { prompt: 'Il collega dice: «Permesso negato? chmod 777 e chiudiamo». Che cosa registri?', options: [
    { id: 'all', label: 'Applico chmod 777: è più veloce e abbiamo già vzdump.', correct: false, why: 'I permessi globali ampliano l’esposizione; vzdump non include i file del bind mount.' },
    { id: 'specific', label: 'Correggo solo la proprietà mappata della directory dedicata, verifico come www-data e richiedo un backup separato.', correct: true, why: 'La correzione segue l’identità effettiva e mantiene visibili le lacune di recupero.' },
    { id: 'remove', label: 'Disattivo unprivileged per evitare di capire UID/GID.', correct: false, why: 'Aumentare i privilegi non è una risposta proporzionata a un problema di proprietà.' }
  ] },
  procedure: ['Usa una fonte host dedicata e senza symlink; non montare /, /etc o directory di sistema.', 'Controlla UID/GID del processo e uid_map/gid_map effettivi; subuid/subgid da soli non provano il mapping attivo.', 'Monta in sola lettura se il flusso non deve scrivere e correggi la proprietà soltanto sulla fonte ispezionata del CT.', 'Prova come utente del servizio e documenta che il bind mount richiede backup e ripristino indipendenti.'],
  validation: 'CT 301 è stato fermato per configurare mp0 e riavviato. www-data (UID/GID 33) ha ricevuto Permission denied con directory host 0:0 0750 e file 0:0 0640. Oltre a subuid/subgid, uid_map e gid_map dentro il CT mostrano 0→100000 per 65536 ID. Dopo aver cambiato soltanto la piccola fonte dedicata in 100033:100033, directory e file sono stati ricontrollati e il test di lettura come www-data termina con successo. mp0 resta ro=1; il contenuto non è stato salvato o ripristinato.',
  diaryPrompt: 'Registra l’offset UID/GID verificato, i permessi prima/dopo, il motivo di ro=1 e come proteggerai separatamente il contenuto del bind mount.',
  closing: 'La lettura funziona senza chmod 777 e senza privilegiare il CT. Nella prossima lezione userai questa evidenza per una decisione sicura di manutenzione e recupero.',
  images: ['assets/aula-19-p1-v4.png', 'assets/aula-19-p2-v7.png']
};

