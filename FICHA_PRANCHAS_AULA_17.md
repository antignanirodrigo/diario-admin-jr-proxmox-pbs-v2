# Ficha dos 12 quadros — aula 17

> **Atualização 02/10/2026:** a tabela abaixo é o storyboard histórico. O par ativo P1 `aula-17-p1-v7.png` / P2 `aula-17-p2-v8.png` trocou quadros repetidos por camada Linux/OCI, inventário vazio e árvore de critérios. As nove falas e o parecer final estão em `AUDITORIA_PRANCHAS_17.md` e nos PNGs ativos.

Ticket INF-117. Três pedidos: A Windows → VM; B serviço Linux simples → **candidato** a LXC não privilegiado; C Docker/OCI → VM recomendada por PVE. Nenhuma VM/CT é criada nesta aula. `pct list` e `pveam list local` retornam tabelas vazias no cenário. O storage `local` tinha apenas 1G disponível na aula 16; a obtenção do template fica para a próxima aula depois de verificação de capacidade.

Referências canônicas de personagem: `assets/aula-01.png`, `assets/aula-01-p2-hq-v3.png`. Comparar com pares ativos das aulas 14–16 para **não** repetir pose, câmera ou função narrativa. Arte 1536×1024, 3×2, balões italianos legíveis atribuídos a personagens. Quadros puramente técnicos usam cartão narrativo distinto de balão. Texto/valores compostos em SVG; arte base sem caracteres gerados.

| Quadro | Cena e função diferentes | Texto permitido | Estado |
| --- | --- | --- | --- |
| P1-Q1 | Sênior entrega pilha de pastas ao Júnior no corredor técnico; cartão do ticket ao pé do quadro | Tre servizi, tre verifiche | problema |
| P1-Q2 | Corte arquitetônico: host Linux, namespace LXC e VM com kernel próprio; sem atores | Kernel condiviso ≠ kernel ospite | conceito |
| P1-Q3 | Envelope A junto a console de VM vazio, símbolo Windows como requisito em cartão, não VM ligada | A: Windows → VM | decisão proposta |
| P1-Q4 | Close no caderno de mapeamento UID/GID; cartão inferior informa que B é apenas candidato | B: LXC non privilegiato, test pendenti | conceito/proposta |
| P1-Q5 | Planta técnica vista de cima com camadas OCI dentro de contorno de VM; sem instância criada | C: Docker/OCI dentro una VM QEMU | decisão proposta |
| P1-Q6 | Plano lateral do Júnior posicionando cartões num mural vertical de destinos vazios; Sênior observa | Nessuna istanza ancora creata | plano |
| P2-Q1 | Close extremo do Sênior canônico; três requisitos refletidos nos óculos, sem pastas ou pose contemplativa repetida | Prima leggiamo A, B e C | retomada dos requisitos |
| P2-Q2 | Terminal escuro com tabelas vazias `pct list` e `pveam list local`, sem prosa falsa | Nessun CT/template locale nel caso | observado no simulador |
| P2-Q3 | Mural técnico vertical com A→VM, B→LXC tracejado/candidato, C→VM, sem status verde | Piano, non istanze attive | escolha |
| P2-Q4 | Bancada de teste desocupada com quatro sinais âmbar de compatibilidade, rede, storage e backup; nenhum teste concluído | Controlli pendenti | pendente |
| P2-Q5 | Sênior e Júnior caminham lado a lado no corredor, tablet sem escrita; balão do Sênior marca os limites | B resta candidato; verificare i vincoli | decisão |
| P2-Q6 | Close em checklist de quatro caixas vazias e cadeado, sem cartões cromáticos repetidos | Nessuna VM o CT creata | encerramento parcial |

Proibido: Windows dentro de LXC, CT B rodando, Docker em LXC privilegiado como opção padrão, qualquer selo de backup ou restauração validada, `pct list` contendo explicações narrativas, template já baixado ou espaço `local` suficiente presumido. P1 precisa de parecer independente antes da geração da P2; P2 e par só serão ativados após novo parecer.
