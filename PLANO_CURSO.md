# Plano curricular — Proxmox VE + Proxmox Backup Server

**Estado:** planejamento editorial em português; aulas 01–21 produzidas como protótipo interativo em italiano, com 42 pranchas. Aulas 22–24 estão em produção; 25–48 permanecem planejadas.  
**Carga proposta:** 48 aulas em 12 módulos de 4; 32 aulas de Proxmox VE e infraestrutura, 16 aulas de PBS, backup e recuperação.  
**Referência técnica inicial:** Proxmox VE 9.2 e Proxmox Backup Server 4.2, conferidos em setembro de 2026. Versões, comandos e telas devem ser reconferidos antes de cada lote de produção.  
**Formato previsto por aula:** chamado narrativo, conceito, laboratório interativo com consequência observável, decisão técnica, 3 questões comentadas, diário de bordo e **2 pranchas**. A primeira prancha apresenta o incidente; a segunda mostra investigação, correção e evidência de validação. Meta editorial: 96 pranchas e 144 questões.

**Idioma de produção:** todo texto voltado ao aluno — interface, narrativa, diálogos, legendas, instruções, feedback e questões — será escrito e revisado em italiano. Comandos, caminhos, nomes de serviços e saídas técnicas serão preservados quando sua grafia real for necessária. Evitar tradução mecânica de termos que mudaria o significado operacional.

**Referência visual aprovada para a produção:** as duas pranchas da aula 1 do NS8 (`../CURSO_NETHSERVER_8/assets/aula-1.png` e `../CURSO_NETHSERVER_8/assets/aula-1-p2.png`), além da continuidade de personagens e cenário ao longo daquele curso. Manter HQ técnica de seis quadros (3 × 2), Júnior e Sênior adultos consistentes, datacenter realista em azul, diagrama e terminal legíveis, progressão incidente → análise → ação → evidência. As novas pranchas de Proxmox/PBS terão balões, painéis e legendas em italiano, sem reaproveitar arte como se fosse uma cena de outro produto.

Esta edição é separada de `CURSO_PROXMOX_INTERATIVO` (40 missões, porta 4175) e de `CURSO_PROXMOX_VE_PBS` (material HTML estático). O protótipo das primeiras 21 aulas abre pelo portal 4170 em `/CURSO_PROXMOX_VE_PBS_V2/`. O acervo existente serve como fonte a revisar, não como conteúdo automaticamente aprovado para a nova edição. O número da aula, seu título, o chamado, o laboratório e as pranchas deverão tratar do mesmo problema.

## Módulo 1 — Fundamentos e desenho do laboratório (aulas 01–04)

**01. O que Proxmox VE e PBS resolvem.** O aluno distingue hipervisor, máquina virtual, container, armazenamento e servidor de backup. No chamado inicial, desenha o caminho de uma aplicação desde o host físico até a recuperação de seus dados e identifica o papel de cada produto.

**02. Hardware e limites reais da virtualização.** Analisa CPU com VT-x/AMD-V, RAM, discos, controladoras e placas de rede antes de aprovar um host. O laboratório apresenta três servidores candidatos; o aluno escolhe um e justifica as restrições de capacidade e redundância.

**03. Topologia, endereços e isolamento do ambiente de treino.** Planeja nós, redes de gestão, tráfego das VMs e rede de backup sem expor serviços por acidente. A entrega é um diagrama simples com nomes, IPs, portas e dependências que acompanhará o curso.

**04. Risco, RPO, RTO e critérios de aceite.** Traduz a necessidade de negócio em perda máxima de dados e tempo máximo de recuperação, sem prometer números antes dos testes. O aluno define metas verificáveis para uma VM crítica e prepara a primeira revisão do plano.

## Módulo 2 — Instalação e operação básica do PVE (aulas 05–08)

**05. Preparação do host para instalar o PVE.** Confere firmware, virtualização, mídia de instalação, relógio, DNS e estratégia de disco. Uma inconsistência de hardware impede o avanço até que o aluno registre a correção adequada.

**06. Primeira instalação e acesso seguro.** Instala um nó, define FQDN e rede estática e acessa a interface HTTPS na porta 8006. O laboratório pede confirmação do nó e da conectividade de gestão antes de criar qualquer carga.

**07. Interface web, terminal e tarefas do nó.** Navega por Datacenter, Node, storage, logs e histórico de tarefas; usa comandos de inspeção para explicar o que a interface mostra. O aluno investiga uma tarefa que falhou e coleta evidências antes de agir.

**08. Repositórios, atualização e janela de manutenção.** Distingue repositórios compatíveis, lê avisos do gerenciador de pacotes e planeja atualização com backup e retorno operacional. A revisão do módulo exige identificar o risco de atualizar um host com VMs críticas sem janela e sem validação posterior.

## Módulo 3 — Rede do hipervisor (aulas 09–12)

**09. Linux bridge e conexão da primeira VM.** Mostra como interface física, `vmbr` e placa virtual se relacionam. O aluno corrige uma VM sem rede localizando a falha na bridge, em vez de trocar endereços ao acaso.

**10. Rede de gestão, gateway e bonds.** Separa acesso administrativo do tráfego das cargas e entende quando redundância de links depende também do switch. O laboratório simula perda de uma interface e exige manter o acesso de gestão.

**11. VLANs e bridge VLAN-aware.** Configura uma VLAN de servidores e outra de usuários, conferindo tags nos dois lados da conexão. O aluno explica por que uma VM alcança a rede errada e corrige o caminho sem eliminar a segmentação.

**12. Firewall e diagnóstico de conectividade.** Aplica regras em nível apropriado e interpreta testes de DNS, rota e porta 8006. A revisão integrada exige restaurar acesso legítimo à gestão mantendo o bloqueio de tráfego indevido.

## Módulo 4 — Máquinas virtuais KVM (aulas 13–16)

**13. Criar uma VM com escolhas conscientes.** Seleciona ISO, firmware, tipo de máquina, CPU, memória e rede para um servidor Linux de teste. O laboratório mostra a configuração resultante e pede que o aluno identifique parâmetros incompatíveis com o sistema convidado.

**14. Disco VirtIO e QEMU Guest Agent.** Compara controladoras e introduz o agente de convidado para observabilidade e operações consistentes. O aluno corrige uma VM cujo endereço IP não aparece e verifica se o agente está realmente ativo dentro do sistema.

**15. Capacidade: vCPU, memória e espaço.** Interpreta uso real de CPU, ballooning quando aplicável, overcommit e crescimento de disco, sem apresentar uma configuração universal. O desafio é ajustar uma VM lenta a partir de métricas, preservando margem no host.

**16. Ciclo de vida, snapshots, clones e templates.** Cria um template e um clone, testa desligamento adequado e usa snapshot para uma mudança pontual. A revisão exige explicar por que snapshot local não substitui um backup recuperável após perda do host.

## Módulo 5 — Containers LXC (aulas 17–20)

**17. Decidir entre VM e container.** Compara isolamento, kernel compartilhado, consumo e compatibilidade das aplicações. O aluno escolhe a tecnologia para três serviços diferentes e documenta por que um deles exige VM.

**18. Criar e operar um LXC desprivilegiado.** Usa template, define recursos e rede e executa comandos de ciclo de vida. O laboratório valida o serviço por dentro e por fora do container, com atenção ao isolamento de usuário.

**19. Volumes, bind mounts e mapeamento de IDs.** Investiga um erro de permissão causado por UID/GID no host e no container. O aluno corrige acesso ao dado sem abrir permissões indiscriminadamente.

**20. Segurança e manutenção de LXC.** Revisa privilégios, atualizações, limites de recursos e implicações de backup dos volumes. A revisão pede uma decisão fundamentada sobre como manter e recuperar um serviço containerizado.

## Módulo 6 — Armazenamento e integridade (aulas 21–24)

**21. Tipos de storage no PVE.** Distingue conteúdo permitido em directory, LVM-thin, ZFS e armazenamento de rede. O aluno resolve o caso de uma ISO enviada ao storage errado e identifica onde cada artefato deve ficar.

**22. ZFS: pool, vdev e redundância.** Planeja mirror ou RAIDZ a partir da quantidade de discos, capacidade e tolerância a falhas. O laboratório evidencia que redundância do pool protege disponibilidade local, mas não resolve exclusão acidental ou desastre do local.

**23. Manutenção do ZFS.** Lê `zpool status`, interpreta erro de disco, planeja scrub e acompanha substituição simulada. A aprovação depende de confirmar o retorno a um estado saudável e registrar o risco residual durante a reconstrução.

**24. Storage compartilhado e pressão de capacidade.** Compara NFS, iSCSI e thin provisioning para um caso concreto de migração e crescimento. A revisão pede diagnosticar falta de espaço antes que uma VM congele por esgotamento de dados ou metadados.

## Módulo 7 — Cluster, quorum e disponibilidade (aulas 25–28)

**25. Criar um cluster de PVE.** Apresenta Corosync, requisitos de rede e entrada de nós no cluster. O aluno monta três nós simulados e valida que a comunicação entre eles é estável antes de ativar recursos críticos.

**26. Quorum e o problema dos dois nós.** Explica votos e comportamento quando há partição de rede; testa um cenário com testemunha externa quando apropriado. O laboratório impede uma decisão que poderia deixar os nós sem consenso sobre o estado do cluster.

**27. Migração e dependências de armazenamento.** Compara migração online e offline e verifica rede, CPU e local do disco antes de mover a carga. O aluno diagnostica por que uma VM específica não pode migrar no estado apresentado.

**28. HA, watchdog e teste controlado de falha.** Configura uma carga elegível para alta disponibilidade e observa o que ocorre quando um nó falha. A revisão mede o tempo de retorno do serviço e registra limites; HA não é apresentado como substituto do backup.

## Módulo 8 — Redes e storage avançados (aulas 29–32)

**29. SDN sem perder a rede de gestão.** Entende zones e VNets e cria uma rede virtual simples para um grupo de VMs. O aluno mantém o caminho administrativo separado e valida a conectividade dos convidados.

**30. VXLAN e diagnóstico entre nós.** Compara segmentação VLAN e rede sobreposta, identifica requisitos de underlay e MTU. O laboratório simula comunicação parcial entre VMs em nós diferentes e exige localizar o ponto da quebra.

**31. Ceph: quando faz sentido e o que exige.** Apresenta MON, MGR, OSD, pools e rede de storage, incluindo custo de hardware e operação. O aluno decide se um ambiente pequeno precisa mesmo de Ceph ou se uma solução mais simples atende ao requisito.

**32. Falha de OSD e saúde do Ceph.** Lê estados de saúde e topologia de discos antes de trocar um OSD simulado. A revisão do bloco exige evitar ações apressadas com o cluster degradado e confirmar a recuperação de redundância.

## Módulo 9 — Fundamentos e implantação do PBS (aulas 33–36)

**33. Arquitetura de backup e regra 3-2-1.** Distingue backup, snapshot, cópia remota e verificação; desenha um fluxo PVE → PBS → segunda localização. O aluno relaciona esse desenho às metas de RPO e RTO definidas na aula 04.

**34. Instalar o PBS e preparar o armazenamento.** Dimensiona CPU, RAM, rede e espaço do servidor de backup; instala a plataforma e acessa a interface HTTPS na porta 8007. O laboratório valida relógio, conectividade e saúde do destino antes de aceitar cargas.

**35. Datastore, namespaces e permissões.** Cria um datastore de treino, organiza backups e concede apenas os privilégios necessários a um operador. O aluno detecta uma permissão excessiva e limita o alcance do token antes da integração.

**36. Integrar PVE e PBS com confiança TLS.** Cadastra o PBS como storage do PVE, valida certificado ou fingerprint e usa identidade apropriada. A revisão exige demonstrar comunicação funcional sem esconder segredo em material didático ou aceitar uma identidade de servidor desconhecida.

## Módulo 10 — Rotina de backup (aulas 37–40)

**37. Primeiro backup de VM e consistência.** Cria uma tarefa, observa o snapshot e entende o papel do sistema convidado e do QEMU Guest Agent. O aluno verifica o resultado no PBS e registra o que o sucesso da tarefa ainda não comprova sobre a restauração.

**38. Backup de LXC e arquivos do host.** Compara a proteção de um container com o uso de `proxmox-backup-client` para dados de um host Linux. O laboratório identifica um volume que ficou fora do escopo e corrige o plano antes de considerá-lo completo.

**39. Agenda, janela, deduplicação e capacidade.** Monta uma rotina com frequência alinhada ao RPO e observa dados enviados, economia de armazenamento e crescimento do datastore. O aluno ajusta concorrência e horário para não saturar a infraestrutura.

**40. Falha de backup e resposta operacional.** Investiga uma execução interrompida por rede, permissão ou falta de espaço, usando tarefas e logs. A revisão exige corrigir a causa, executar novamente e apresentar evidência de um ponto de recuperação válido.

## Módulo 11 — Retenção, integridade e segunda cópia (aulas 41–44)

**41. Políticas de retenção e prune.** Traduz requisitos de dias, semanas e meses em uma política que preserve pontos de recuperação úteis. O aluno usa simulação antes de aplicar a regra e explica quais snapshots seriam removidos.

**42. Garbage collection e espaço recuperável.** Mostra a diferença entre apagar referências por prune e liberar chunks não usados por GC. O laboratório prevê a evolução do espaço e evita prometer liberação imediata após mudar a retenção.

**43. Verificação de integridade e alertas.** Configura Verify Jobs e interpreta um backup corrompido ou incompleto. O aluno diferencia “arquivo armazenado” de “backup íntegro” e encaminha uma nova cópia quando a verificação falha.

**44. Sincronização remota, criptografia e chaves.** Monta uma segunda cópia com controle de acesso e testa o uso de uma chave mantida fora do servidor protegido. A revisão inclui a possibilidade de perder a chave: backup cifrado sem chave recuperável não atende ao plano de desastre.

## Módulo 12 — Restauração e simulado final (aulas 45–48)

**45. Restaurar um único arquivo.** Localiza um ponto de recuperação, extrai o arquivo solicitado e valida conteúdo e permissões sem sobrescrever o original. O chamado exige registrar quem solicitou a restauração e qual versão foi entregue.

**46. Restaurar VM e LXC em rede isolada.** Recupera cargas com identificadores distintos e verifica boot, serviço, dados e conectividade antes da promoção. O aluno evita conflitos de IP e identidade com o ambiente ainda em produção.

**47. Perda do nó ou do PBS: plano de reconstrução.** Define a ordem de recuperação de gestão, acesso ao backup, chaves, rede e serviços. O laboratório testa a restauração a partir da segunda cópia quando o destino principal está indisponível.

**48. Incidente final: recuperar e medir.** Um nó falha e um arquivo crítico é excluído; o aluno decide a ordem de resposta, restaura a carga e o arquivo e coleta evidências. A conclusão compara RPO e RTO medidos com as metas da aula 04 e exige registrar o que ainda precisa melhorar.

## Critérios de produção e aceite

- Em cada laboratório, explicar antes da execução a finalidade de cada comando, o significado de todos os subcomandos, argumentos e opções usados, como interpretar a saída e como consultar a ajuda real (`--help`, `help` ou manual, conforme a ferramenta). A consulta de ajuda deve funcionar no simulador sem contar como evidência técnica. Identificar explicitamente qualquer comando exclusivo da simulação.
- O terminal deve oferecer TAB para autocompletar apenas comandos válidos no nó selecionado, `help` para listar os comandos disponíveis e um painel lateral de objetivos que marque automaticamente as evidências executadas. Em telas estreitas, o painel pode ficar abaixo do terminal. Cada questão deve manter o feedback correto/incorreto e a justificativa visíveis sob a própria pergunta, inclusive após recarregar a página.
- Cada aula precisa de um objetivo observável, uma falha plausível e uma validação que dependa das ações do aluno. O simulador deve bloquear conclusões prematuras.
- As duas pranchas contam a mesma história do laboratório, no padrão visual concreto do NS8, com Júnior e Sênior adultos, ambiente técnico coerente, comandos legíveis e revisão visual de toda a tipografia italiana antes da publicação.
- Questões e decisões devem explicar por que alternativas falham. Evitar números absolutos de desempenho ou recuperação que o laboratório não mediu.
- Conteúdo de PBS deve distinguir **backup feito**, **backup verificado** e **restauração testada**. A conclusão do curso requer as três evidências.
- A versão antiga continua independente até que a nova edição tenha conteúdo, testes, pranchas aprovadas e um endereço definido. Este documento, sozinho, não altera a aplicação da porta 4175.

## Fontes primárias para conferência técnica

- [Downloads oficiais do Proxmox VE](https://www.proxmox.com/en/downloads/proxmox-virtual-environment)
- [Documentação oficial do Proxmox VE](https://pve.proxmox.com/pve-docs/)
- [Downloads oficiais do Proxmox Backup Server](https://www.proxmox.com/en/downloads/proxmox-backup-server)
- [Documentação oficial do PBS](https://pbs.proxmox.com/docs/)
- [Armazenamento e datastores do PBS](https://pbs.proxmox.com/docs/storage.html)
- [Gerenciamento de usuários e permissões do PBS](https://pbs.proxmox.com/docs/user-management.html)
- [Cliente de backup, criptografia e recuperação de chaves](https://pbs.proxmox.com/docs/backup-client.html)

