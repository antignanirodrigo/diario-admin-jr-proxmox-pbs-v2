# Auditoria independente — aula 17 (01/10/2026)

**Tema:** escolher VM ou LXC para três serviços. **Ativos:** `assets/aula-17-p1-v3.png` e `assets/aula-17-p2-v4.png` (1536 × 1024, seis quadros cada). Revisão independente e somente leitura por revisor Level 99, com comparação explícita com aulas 14–16 e entre as duas pranchas. Aprovação visual do par não equivale a auditoria comercial integral das aulas anteriores.

## Conteúdo e estado técnico

A revisão técnica reprovou inicialmente respostas simuladas de `pct list` e `pveam list local` com prosa explicativa que um terminal real não emitiria. As saídas foram corrigidas para cabeçalhos de tabelas vazias; a interpretação narrativa foi deslocada para o texto pedagógico. O revisor aprovou o conteúdo após a correção. A e C são planejados em VM; B é somente candidato a LXC não privilegiado. Não há VM/CT ou template local criado nesta aula. Testes de compatibilidade, rede, storage e backup seguem pendentes. O storage `local` ficou com 1G livre na aula 16, portanto a aula 18 deve conferir capacidade antes de baixar template.

## Portão da primeira prancha

- **P1 v1 — reprovada:** Q4 repetia a explicação diante de vidro/tela das aulas 14–15; Q5 repetia o cubo em caixa de Q2 e não explicitava Docker dentro de VM; Q6 repetia o plano de personagens ante racks das aulas 16.
- **P1 v2 — reprovada:** Q4, Q5 e Q6 viraram três documentos centrais vistos de cima, com mãos/canetas e ação equivalente; Q6 reencenava o caderno da aula 16.
- **P1 v3 — aprovada:** Q6 virou plano lateral do mural vertical e cartões de destinos vazios, quebrando a sequência de documentos. Q4 mapeia UID/GID; Q5 mostra OCI dentro da VM QEMU. Balão de Windows e cartões são legíveis, sem implantação falsa. Somente após esse parecer a P2 foi gerada.

## Portão da segunda prancha e do par

- **P2 v1 — reprovada:** Q1 repetia a pose de mão no queixo da aula 14; Q6 repetia os três cartões coloridos do fechamento da P1.
- **P2 v2 — reprovada:** Q1 passou a repetir a entrega/leitura de pastas da P1-Q1. Q6 virou checklist aberto de quatro pendências e foi aceito.
- **P2 v3 — reprovada:** o close de Q1 resolveu a composição repetida, mas alterou o rosto do Sênior para alguém visivelmente mais velho, com cabelo e barba brancos em excesso.
- **P2 v4 e par — aprovados:** Q1 mantém close e reflexos dos três requisitos, com identidade canônica compatível com P2-Q5/P1/aula 01. Q2 mostra os cabeçalhos e tabelas vazias; Q3 marca B como candidato tracejado; Q4 mostra quatro controles pendentes; Q5 tem balão atribuível e rosto legível; Q6 termina com checklist não concluído. Não há reencenação bloqueante das aulas 14–16 ou entre as duas pranchas.

**Observação não bloqueante:** o cilindro que representa C em P2-Q3 é genérico; o texto superior e P1-Q5 identificam Docker/OCI. A revisão foi visual e documental em simulador, sem executar operações reais no Proxmox.

**Verificação de ativação:** `npm.cmd test` 26/26; página da aula 17 e ambos PNGs HTTP 200 no portal 4170. A ficha de 12 quadros foi atualizada para registrar as cenas finais.
