# Protocolo do revisor Level 99

Este é o portão de qualidade do curso Proxmox VE + PBS v2. A cada prancha concluída, o produtor entrega a imagem e a ficha dos quadros a um agente **independente e somente leitor**. A prancha seguinte só começa depois do parecer `APROVADA`. Se houver correção, a mesma prancha volta ao revisor. O par completo recebe uma segunda aprovação antes de ser publicado.

## Material obrigatório para a revisão

- Imagem final ampliada, quadro a quadro, e prancha anterior do par (se existir).
- Ficha de 12 quadros, `PADRAO_PRANCHAS.md`, aula em `data/` e guia de comandos correspondente.
- Pranchas próximas já aprovadas, para detectar reciclagem e mudança de estilo.
- No mínimo os três pares de aulas anteriores em uma comparação visual lado a lado, além das duas pranchas da aula atual. O parecer deve citar pares de quadros comparados por aula/prancha/quadro; aprovação genérica de “sem repetição” não basta.
- Saídas reais do laboratório simulado; documentação oficial PVE/PBS quando houver dúvida factual.

## Critérios de reprovação imediata

1. Comando, opção, saída, IP, FQDN, VMID, porta, VLAN, versão, resultado ou estado que não corresponda à aula. Uma ação planejada não pode aparecer como executada ou validada.
2. Legenda, interface ou diálogo em italiano incorreto, texto cortado, pequeno demais ou ilegível na ampliação normal.
3. Menos ou mais de seis quadros, ordem confusa, quadro repetido dentro da aula ou imagem reaproveitada de outra aula. O segundo painel precisa avançar a história, não refazer o primeiro.
   Reprovar também reencenação sem cópia literal: mesma pose, posição dos personagens, câmera e função narrativa em quadros correspondentes de aulas vizinhas. Personagens e paleta constantes são identidade visual; storyboard constante é repetição.
4. Júnior ou Sênior descaracterizado; troca de idade, rosto, roupa, traço, paleta ou linguagem visual entre as duas pranchas.
5. Balão ou legenda cobrindo rosto, terminal ou elemento que seja necessário para entender a lição; equipamentos de datacenter fantasiosos ou anatomicamente incoerentes.
6. Texto técnico gerado no bitmap com grafia não verificável. Para entrega comercial, exigir composição determinística de comandos e interfaces.

## Parecer obrigatório

```text
Aula / prancha / arquivo / data:
Parecer: APROVADA | REPROVADA
Inspeção: resolução total; Q1–Q6; par lado a lado; aula/laboratório; pranchas vizinhas
Comparação editorial: citar três pares anteriores e os quadros mais semelhantes, com decisão explícita sobre pose, câmera, ação e evidência técnica
Falhas bloqueantes: quadro, localização, evidência e correção necessária
Observações não bloqueantes: quadro e melhoria sugerida
Liberação: próxima prancha SIM | NÃO
Liberação do par para ativação SIM | NÃO | não aplicável
Limite da revisão: o que não foi possível confirmar
```

Um parecer sem inspeção visual e comparação técnica não libera a próxima prancha. A revisão deve ser registrada no arquivo de auditoria do lote e no plano geral de pranchas. O produtor não pode substituir o parecer independente pela própria opinião.
