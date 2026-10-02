# Direção de arte pré-produção — módulo 06, aulas 21–24

**Estado:** portão visual preliminar. Nenhuma prancha deve ser gerada antes do parecer técnico-visual conjunto com o roteiro de laboratório aprovado. Esta bíblia descreve a **encenação**, não autoriza comandos, saídas ou estados não constantes do simulador. Escopo: armazenamento e integridade, 2 pranchas por aula, 6 quadros por prancha, 1536 × 1024, italiano em todo texto ao aluno.

## Referências e continuidade

- Personagens canônicos: `assets/aula-01.png` e `assets/aula-01-p2-hq-v3.png`. Júnior: 26–28 anos, cabelo castanho-escuro ondulado e desalinhado, barba leve, moletom grafite e crachá TI. Sênior: 42–45 anos, cabelo curto escuro-grisalho penteado, barba grisalha, óculos pretos retangulares e blazer escuro. Rejeitar rosto juvenil, cabelos brancos longos, troca de roupa ou proporção entre quadros.
- HQ adulta de tinta e luz ciano/âmbar, datacenter de racks fechados e consoles plausíveis. Balões **desenhados como forma única orgânica**, com cauda curta e emissor humano inequívoco. Sem elipse sobre triângulo. Texto exato composto depois em SVG; imagem base sem letras, números, logotipos improvisados, terminais ou falsas saídas.
- Quatro a cinco falas úteis na prancha 1 e três a quatro na prancha 2 como objetivo editorial (cerca de 6–8 por par). Isso não autoriza balão em quadro de terminal/diagrama se prejudicar a leitura. Diálogos devem conduzir hipótese, dúvida, limite e decisão; placas técnicas mostram fatos. O desenho deve reservar espaço físico para o balão *antes* da renderização do texto.
- Faixa de legenda de 46–56 px dentro da margem inferior de cada quadro, afastada das mãos e evidências. Em quadros com personagens, reservar no alto uma ilha visual de aproximadamente 180 × 100 px por fala, com no máximo duas ou três linhas curtas. Em quadros técnicos, reservar área escura e lisa para texto vetorial, sem microtipografia dentro do bitmap. Nenhum balão sobre rosto, disco, indicador de falha ou dado que será testado.
- Cabeçalho branco e sarjeta regular; leitura Q1→Q6 da esquerda para a direita e de cima para baixo. P1 é incidente/hipótese, P2 é investigação/evidência/limite. Os estados finais serão copiados do roteiro: observado, proposto, pendente ou executado. Nunca trocar um pelo outro por conveniência visual.

## Matriz anti-repetição: pares ativos 17–20

Inspeção visual feita dos PNGs ativos 17 P1 v7/P2 v8, 18 P1 v5/P2 v7, 19 P1 v4/P2 v7 e 20 P1 v5/P2 v3. O par 17 usa fichas coloridas dos serviços, mapa de kernel, terminal de inventário vazio e checklist de criação pendente. O 18 usa catálogo de templates, dois storages, controles de CT e Nginx/HTTP local. O 19 usa cofre, cadeado, diagrama UID e bind mount, barreira `ro=1`. O 20 usa alerta âmbar de patch, botões de proteção, indicador de espaço, pacote em simulação, restauração pendente e pasta de aprovação. **Proibição neste módulo:** repetir o Júnior sentado com mão no queixo diante de monitor, o Sênior de braço aberto junto a ícones flutuantes, dois personagens curvados sobre cartões no piso, mesma parede de seis ícones e a composição “quadro central = três caixas com setas; Q6 = pasta pausada”. A presença de racks e a paleta ciano são continuidade, não licença para repetir câmera, gesto e função.

Gramática nova do módulo: close macro de baia e etiqueta física, gaveta de mídia, corte didático de camadas de storage, planta superior de shelf, quadro de manutenção com cronologia de evidências, trilho de capacidade e representação discreta de metadados. Variar entre macro, plano médio, vista superior e corte de equipamento. Não desenhar discos em gavetas fictícias sem referência técnica, peças soltas ou manipulação física de disco que o laboratório não executa.

## Aula 21 — Tipos de storage e conteúdo permitido

**Conceito curricular:** a ISO já existe em `local` e `local-lvm` não aceita conteúdo `iso`; distinguir directory, LVM-thin, ZFS e storage de rede. O ticket INF-121 é diagnóstico de compatibilidade e classificação de destinos, sem upload, cópia, alteração de configuração ou criação de volume.

| Quadro | Câmera / ação / locação | Função visual e fala planejada | Área técnica / estado máximo |
| --- | --- | --- | --- |
| P1-Q1 | Vista de ombro diagonal: Júnior observa o seletor de ISO sem `local-lvm`, mão suspensa antes do clique. | Incidente; Júnior pergunta por que não encontra o destino. **1 fala.** | Sem caixa de erro ou ação de upload; observado. |
| P1-Q2 | Macro da tela recortada em quatro tipos de storage sem nomes impressos no bitmap. | Mostrar que tipo de storage e tipo de conteúdo são dimensões diferentes. | Quatro cartões SVG sem check verde; conceito, não operação. |
| P1-Q3 | Plano baixo lateral: Sênior gira uma ficha técnica física para o Júnior, sem pose de braço aberto. | Distinguir “onde guardar” de “que conteúdo aceita”. **1 fala.** | Nenhum resultado técnico no bitmap; hipótese. |
| P1-Q4 | Corte em camadas: filesystem directory e volume de blocos apresentados com texturas distintas. | Contrastar arquivo de ISO e disco virtual sem afirmar matriz universal. | Rótulos SVG vindos do roteiro; proposto. |
| P1-Q5 | Close nas mãos do Júnior comparando linhas de configuração num monitor inclinado. | Conferir conteúdo permitido antes de mudar destino. **1 fala.** | Comando/UI exatos só após roteiro; observado. |
| P1-Q6 | Corredor de racks em perspectiva baixa; Júnior em pé com tablet de inventário e Sênior ao fundo, sem mesa, folha ou caneta. | Encerrar P1 indicando as consultas ainda necessárias. **1 fala curta.** | Nenhum upload concluído; pendente. |
| P2-Q1 | Monitor frontal largo com tabela literal de `pvesm status`; Júnior pequeno ao lado, sem balão. | Evidência de status/capacidade sem repetir seletor de ISO e sem microbalão. | Overlay determinístico em três linhas completas, cada pool com Total/Used/Available; observado. |
| P2-Q2 | Vista superior da bancada: Júnior sublinha `local` numa folha de decisão ao lado da lista que comprova a ISO existente; nenhuma ficha é movida. | Evidenciar a localização antes de escolher. | `pvesm list local --content iso` observado; escolha ainda não executada. |
| P2-Q3 | Plano de volumes VM 100 e CT 301 no thin pool, visto por trás do painel, sem repetir P1-Q4. | Sênior aponta a diferença entre `images` e `rootdir`. **1 fala.** | `pvesm list local-lvm --content images/rootdir`; observado. |
| P2-Q4 | Macro da tabela de IDs `vm-100-disk-0` / `vm-301-disk-0` em tela escura, sem personagens. | Comparação real dos dois tipos de volume. | SVG do simulador, nunca texto gerado. |
| P2-Q5 | Sênior e Júnior em corredor lateral de racks, vistos em perfil caminhando, não curvados sobre piso. | Sênior pergunta o que ainda não foi verificado; Júnior responde. **2 falas.** | Não alegar disponibilidade, redundância ou backup. |
| P2-Q6 | Plano de mesa com registro INF-121 e mapa de conteúdo, sem pasta pausada. | Diagnóstico documentado e limite. | `Nessun volume spostato`; nenhum upload ou mudança. |

**Meta de falas:** cinco em P1 + duas em P2 = sete no par ativo proposto. Q1 e P2-Q1 têm ângulos e evidências diferentes; P1-Q2 não é a parede de ícones da aula 17 nem o catálogo de templates da 18.

## Aula 22 — ZFS: pool, vdev e redundância

**Conceito curricular:** escolher desenho de redundância conforme discos e requisito; distinguir tolerância a falha de backup. Não mostrar pool real criado se a aula só planejar. Não desenhar “mirror” ou RAIDZ com discos/contagens não definidos no roteiro.

| Quadro | Câmera / ação / locação | Função visual e fala planejada | Área técnica / estado máximo |
| --- | --- | --- | --- |
| P1-Q1 | Vista superior oblíqua de bandejas de discos **fechadas** com etiquetas vazias; Júnior segura planta do shelf. | Incidente/capacidade; pergunta quantas falhas o desenho suporta. **1 fala.** | Quantidade de discos apenas do roteiro; observado. |
| P1-Q2 | Corte didático do shelf para vdev e pool em camadas, sem holograma de cubos. | Definir hierarquia física e lógica. | Nomes/quantidades via SVG; conceito. |
| P1-Q3 | Sênior em plano lateral com régua e planta técnica, sem tocar discos. | “Non basta contare i dischi.” **1 fala.** | Sem promessa de desempenho/capacidade. |
| P1-Q4 | Duas colunas de blocos em papel técnico vistas de cima: à esquerda pares 01/02 e 03/04; à direita RAIDZ2 único com quatro discos. | Mostrar que duas falhas no mesmo mirror quebram o primeiro desenho, enquanto RAIDZ2 tolera quaisquer dois discos. | Geometria e capacidade aproximada de 2 TiB antes de overhead apenas do roteiro; sem pool real. |
| P1-Q5 | Close do Júnior calculando margem em folha, não monitor de barras. | Questionar capacidade utilizável versus proteção. **1 fala.** | Cálculo SVG; pendente de validação. |
| P1-Q6 | Plano geral da sala com shelf ao fundo; personagens diante de planta, por ângulo oposto ao Q1. | Hipótese escolhida para teste. **1 fala.** | Sem pool criado ou estado ONLINE fictício. |
| P2-Q1 | Quadro técnico isométrico baixo mostrando distribuição de dados/paridade validada. | Comparar consequências de uma falha por desenho. | Diagrama e legenda SVG; conceito, não teste físico. |
| P2-Q2 | Júnior analisa uma ficha de risco em bancada metálica, Sênior fora de foco. | Pergunta se redundância resolve exclusão acidental. **1 fala.** | Não reencenar snapshot/bind do módulo LXC. |
| P2-Q3 | Sênior diante de dois cenários espaciais separados: local e destino independente. | Resposta sobre backup separado. **1 fala.** | PBS só como plano futuro se não integrado. |
| P2-Q4 | Quadro de comparação de cenários sem personagens. | Evidência de cálculo/seleção real do laboratório. | Só fatos registrados; sem números genéricos. |
| P2-Q5 | Macro de etiqueta “plano” presa a desenho de vdev, mão do Júnior anotando ressalva. | Júnior resume limitação. **1 fala curta.** | Escolha proposta/executada conforme lab. |
| P2-Q6 | Plano externo amplo da fileira de racks, duas vias visuais para disponibilidade local e cópia independente. | Fecho conceitual sem medalha de sucesso. | Nenhuma recuperação testada. |

**Meta de falas:** 4+3=7. Anti-clone: sem cubos LXC, escudos da aula 20 ou cofre da 19; o shelf e a planta são objetos de ZFS, não cartões no piso.

## Aula 23 — Manutenção do ZFS

**Conceito curricular:** observar `zpool status`, interpretar erro, executar scrub, confirmar que o device segue `DEGRADED`, verificar autorização/IDs/sobressalente/registro de backup, executar `zpool replace` em simulação e acompanhar `replacing-2`/resilver até `ONLINE`. A imagem não pode resolver o problema antes da evidência. Em especial, “scrub” não é backup nem substitui disco por si só. O salto desde a aula 22 é explícito: `tank-lab` foi provisionado entre as aulas sob mudança INF-122 no ambiente simulado.

| Quadro | Câmera / ação / locação | Função visual e fala planejada | Área técnica / estado máximo |
| --- | --- | --- | --- |
| P1-Q1 | Macro de indicador âmbar numa gaveta hot-swap fechada; Júnior entra no enquadramento ao fundo. | Incidente visual discreto, não incêndio/falha catastrófica. **1 fala.** | Indicador só como metáfora, não diagnóstico confirmado. |
| P1-Q2 | Terminal frontal limpo, sem pessoa, colunas para status do pool. | Primeira evidência `zpool status` se lab o oferece. | Saída SVG exata; observado. |
| P1-Q3 | Sênior e Júnior vistos através do vidro do corredor, Sênior aponta linha de erro em tablet. | Diferenciar alerta de causa. **1 fala.** | Não afirmar disco físico defeituoso sem prova. |
| P1-Q4 | Close no mapa físico-lógico entre baia e identificador do vdev. | Evitar remover dispositivo errado. | IDs apenas do roteiro; hipótese. |
| P1-Q5 | Júnior anota plano de manutenção em prancha vertical, sem mexer no hardware. | Ordem: diagnosticar, planejar, executar somente na simulação. **1 fala.** | Sem estado ONLINE novo. |
| P1-Q6 | Sênior segura etiqueta de bloqueio diante da baia; Júnior afasta a mão. | Suspender ação apressada e pedir confirmação. **1 fala.** | Pendente. |
| P2-Q1 | Quadro técnico de linha temporal com pontos “antes / ação / depois” vazios. | Sequência de evidência, sem resultado antes da execução. | Textos SVG condicionais. |
| P2-Q2 | Plano de ombro invertido: Júnior opera console, rack apenas ao fundo. | Comando simulado de scrub/substituição conforme roteiro. **1 fala.** | Executado só se simulador registrar. |
| P2-Q3 | Close do progresso em terminal plano. | Mostrar espera/reconstrução e risco residual. | Sem 100% instantâneo; output real. |
| P2-Q4 | Vista superior de ordem de serviço assinada e etiquetas antigas/novas; Júnior no canto do quadro, console ao lado. | Júnior anuncia a substituição simulada após conferir `ata-LAB-03` e `/dev/disk/by-id/ata-LAB-05`. **1 fala.** | `zpool replace` só após os quatro gates do roteiro; execução simulada. Não desenhar mão puxando caddy se o roteiro não mostra a troca física. |
| P2-Q5 | Corte do monitor em dois momentos separados por divisor temporal claro: `replacing-2` e o avanço didático, sem relógio acelerado. | Interpretar resilver em curso sem afirmar tempo real. | SVG: `DEGRADED` durante reconstrução; conclusão ainda pendente. |
| P2-Q6 | Sênior e Júnior em plano médio diante do terminal final, ângulo invertido da primeira prancha. | Sênior separa `ONLINE` de prova de backup externo. **1 fala.** | SVG final `ONLINE`, `ata-LAB-05`, `errors: No known data errors` apenas após avanço simulado. |

**Meta de falas:** 4+3=7. Anti-clone: não replicar painel âmbar de atualização da aula 20; aqui a câmera macro parte da baia, e a evidência dominante é `zpool status`, não um checklist genérico.

## Aula 24 — Storage compartilhado e pressão de capacidade

**Conceito curricular:** comparar NFS, iSCSI e thin provisioning para migração/crescimento. Diagnosticar espaço de dados e metadados antes de travamento; não prometer migração, HA ou expansão se a aula não executar. Não inferir capacidade de um gráfico meramente ilustrativo.

| Quadro | Câmera / ação / locação | Função visual e fala planejada | Área técnica / estado máximo |
| --- | --- | --- | --- |
| P1-Q1 | Plano geral transversal da sala: duas fileiras de hosts e um armário de storage ao fundo, Júnior caminha entre elas. | Incidente de crescimento/migração; pergunta onde ficará o disco. **1 fala.** | Topologia lógica apenas com nomes do roteiro. |
| P1-Q2 | Vista de corte de caminho de rede para arquivo e bloco, visual distinto de duas caixas com seta. | Contrastar NFS e iSCSI sem representar ambos como o mesmo protocolo. | Rótulos e portas só se lab os inclui; conceito. |
| P1-Q3 | Sênior examina mapa de dependências numa placa de vidro, ângulo visto por trás da placa. | Destacar que shared storage depende de rede/servidor. **1 fala.** | Não chamar shared de backup. |
| P1-Q4 | Macro de camadas fina/grossa em um disco lógico recortado. | Alocação thin versus capacidade física. | Sem números inventados. |
| P1-Q5 | Júnior lê duas métricas distintas em monitor baixo, câmera ao nível da mesa. | Dados e metadados precisam de checagens separadas. **1 fala.** | Overlay de medição real. |
| P1-Q6 | Sênior segura o plano de migração e para o Júnior na porta da sala. | Não migrar antes de resolver risco de capacidade. **1 fala.** | Pendente, sem freeze falso. |
| P2-Q1 | Terminal frontal de diagnóstico, sem rostos. | Evidência quantitativa do espaço/metadata. | Saída SVG literal do lab. |
| P2-Q2 | Júnior diante de mapa de dois caminhos de acesso, câmera lateral longa. | Interpretar qual requisito cada tecnologia atende. **1 fala.** | Comparação, não implantação. |
| P2-Q3 | Corte técnico de reservatório thin com alocação e limite separados. | Explicar por que disco virtual livre não implica storage físico livre. | Apenas números simulados. |
| P2-Q4 | Sênior aponta para folha de medições **pontuais** do thin pool, não parede de ícones ou gráfico histórico. | Definir investigação da margem atual. **1 fala.** | `Data% 95.00` e `Meta% 88.00`; sem série temporal, previsão ou limiar inventado. |
| P2-Q5 | Júnior reposiciona uma etiqueta de decisão na planta, visto de lado. | Expõe escolha e dependências ainda abertas. **1 fala.** | Proposto/executado conforme lab. |
| P2-Q6 | Plano amplo de racks com uma rota de dados destacada e quadro de risco em SVG. | Fecho do módulo: capacidade observada, risco e próxima ação. | Não afirmar VM migrada, HA, backup ou ausência de risco sem prova. |

**Meta de falas:** 4+3=7. Anti-clone: a aula 18 tem barra de espaço `local` e split de storage para template/rootfs; esta aula usa simultaneamente caminho compartilhado e **duas** métricas de thin provisioning, com outra câmera e outra decisão. A aula 20 tem 6 GB disponíveis no rootfs de CT; não reutilizar esse número nem aquela interface.

## Portão antes da primeira imagem

1. Roteirista entrega uma ficha técnica de 12 quadros por aula, laboratório executável, comandos/ajuda/opções, textos italianos, saídas/status e fatos proibidos.
2. Diretor de arte confronta cada quadro acima com o roteiro, corrige qualquer estado ou texto incompatível e emite parecer `PRONTO` ou `REPROVADO` por aula. Se reprovar, nenhuma geração para aquela aula.
3. No par pronto, produzir somente P1. Revisor Level 99 independente verifica P1. Apenas com `APROVADA` criar P2; depois revisão individual de P2 e revisão conjunta do par, inclusive comparação com três pares anteriores.
4. Ativar os dois arquivos juntos, testar o portal e registrar auditoria. Aprovação pré-produção não substitui aprovação da prancha renderizada.

## Parecer cruzado de pré-produção — 02/10/2026

Material cruzado: `ROTEIRO_MODULO_06_21-24.md` revisto, plano curricular, padrão de pranchas, protocolo Level 99 e dez PNGs canônicos/ativos (aula 01 e pares 17–20). As falas propostas no roteiro são sete na 21, sete na 22, sete na 23 e oito na 24, distribuídas em personagens e ações; não há necessidade de balões em todos os quadros. Minha bíblia visual oferece até uma fala adicional em alguns pontos; **vale sempre a fala congelada no roteiro**, sem inventar balão para bater meta.

| Aula | Coerência dos 12 quadros e estados | Continuidade / repetição | Parecer de storyboard |
| --- | --- | --- | --- |
| 21 | P1 diagnostica tipo/conteúdo; P2 evidencia ISO já presente em `local`, VM 100 e CT 301 em `local-lvm`; nenhum upload ou mutação. Textos técnicos cabem em terminal SVG, não no bitmap. | Macro de seletor e tabela de volumes diferem dos cartões A/B/C da 17 e do catálogo de templates da 18. | **PRONTO PARA IMPLEMENTAR LABORATÓRIO; IMAGEM BLOQUEADA** até a saída exata estar no simulador. |
| 22 | Comparação dois mirrors versus RAIDZ2 com quatro discos simulados; não criar pool. Boas zonas para geometria vetorial e falas junto aos personagens. | Shelf/planta e câmera superior diferem de ícones flutuantes e barreiras da 19–20. | **PRONTO PARA IMPLEMENTAR LABORATÓRIO; IMAGEM BLOQUEADA** até o inventário e a escolha estarem implementados. |
| 23 | P1: `DEGRADED`/`READ 3` e scrub planejado. P2: scrub executado mas ainda `DEGRADED`; gate de autorização/ID/backup; replace simulado; resilver em curso; avanço didático; `ONLINE` final. Quadro P2-Q5 exige divisor temporal inequívoco, não uma animação que pareça recuperação instantânea. | A abertura em close de baia não pode copiar o alerta documental da 20. Evitar a pose do Sênior diante de cadeado da 19. | **PRONTO PARA IMPLEMENTAR LABORATÓRIO; IMAGEM BLOQUEADA** até gates e transições auditáveis estarem no simulador. |
| 24 | P1 mede Data%/Meta% e mantém VM 100 local; P2 compara NFS/iSCSI sem configurar endpoints ou migrar. `192.0.2.x` precisa ser rotulado como cenário didático, jamais rede ativa. | Duas métricas do thin pool e mapa de dependências diferem do `local` 1 GB da 18 e rootfs 6 GB da 20. | **PRONTO PARA IMPLEMENTAR LABORATÓRIO; IMAGEM BLOQUEADA** até saídas e estados estarem no simulador. |

**Parecer geral: PRONTO PARA IMPLEMENTAÇÃO DO CONTEÚDO, REPROVADO PARA GERAÇÃO DE IMAGEM NESTE MOMENTO.** O roteiro e a direção estão coerentes, inclusive a correção da aula 23. A condição restante é objetiva: implementar aulas/laboratórios em `data/` e simulador, testar cada resultado e congelar textos/estados. Só depois este diretor revisa a ficha final, libera P1 de cada aula e o revisor independente aplica o protocolo por prancha e por par. A aprovação de pré-produção não antecipa aprovação comercial.
