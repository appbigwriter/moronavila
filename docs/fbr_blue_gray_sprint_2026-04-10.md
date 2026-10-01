# FBR Systems: Conceito, PRD Consolidado e Tasklist Blue/Gray Sprint

Atualizado em: 2026-04-08  
Prazo de fechamento: 2026-04-10

## 1. Escopo desta consolidação

Este documento consolida apenas o recorte dos sistemas FBR deste projeto, com foco no que precisa ser fechado para entrega operacional até `10/04`.

Base utilizada nesta análise:

- `docs/PRD_softphone.md`
- `docs/softphone.md`
- `docs/softphone_detail.md`
- `docs/softphone_env.md`
- `docs/system_tasklist.md`
- `docs_server/arquitetura.md`
- `src/**`
- `mac-server.ts`
- `supabase/migrations/**`

Observações relevantes da análise:

- Não encontrei os arquivos canônicos `fbr-arquitetura.md`, `securitycoderules.md` e `DESIGN_STANDARDS.md`; por isso, a consolidação abaixo usa os docs existentes e o código real como fonte principal.
- O projeto atual está em `Vite + React + TypeScript`, embora parte dos documentos antigos ainda descreva `Next.js`.
- `npm run lint` e `npm run build` estão passando no estado atual do repositório.

## 2. Conceito consolidado do sistema FBR

O sistema FBR deste projeto é um hub operacional interno para a MoronaVila, unificando:

- gestão de moradores e elegibilidade de acesso
- controle de internet e dispositivos por MAC
- módulo de softphone interno com prontidão para SIP/WebRTC
- diretório operacional da casa
- inbox operacional do morador
- suporte administrativo para pagamentos, manutenção, avisos e rotinas da operação

O conceito central é:

- o app é o centro de operação
- o campo mestre `habilitado` decide se o morador pode usar o sistema
- o softphone é um módulo interno do app, e não um produto isolado
- o backend local existe para apoiar integrações, diretório, rollout, inbox e automações
- o banco Supabase é a fonte estrutural dos dados do produto
- PBX, porta e automações reais só devem entrar em produção quando houver infraestrutura homologada

## 3. Diagnóstico atual do projeto

### 3.1 O que já está entregue

- autenticação com Supabase
- views administrativas e de morador para operação principal
- campo `habilitado` incorporado ao fluxo do app
- `motivo_bloqueio` incorporado ao cadastro do morador
- `mac-server.ts` com endpoints de softphone, inbox, rollout, healthcheck, PIX, chat e MAC
- módulo `SoftphoneDock` com shell, sincronização, checklist, diretório, contadores e modo `mock`/`sipjs`
- migrations para colunas do softphone, inbox e elegibilidade
- painéis de rollout do softphone em Dashboard, Internet e Moradores

### 3.2 Lacunas reais identificadas

- documentação desatualizada em relação à stack atual e à estrutura real do repositório
- backend local ainda concentrado em um arquivo monolítico (`mac-server.ts`)
- integração da inbox existe no backend e no dock, mas ainda não existe fluxo administrativo completo para recados manuais
- geração automática de recados a partir de pagamento, manutenção, internet e operação ainda está parcial
- regra de desligamento automático de `habilitado` por inadimplência e/ou saída ainda não está fechada no produto
- endpoints de porta e PBX continuam em modo placeholder
- há heurísticas e fallbacks no frontend e no acesso ao perfil do residente que precisam ser endurecidos
- faltam checklists finais de homologação operacional e técnica

### 3.3 Riscos de fechamento até 10/04

- fechar visualmente o softphone sem fechar o fluxo real da inbox
- deixar `habilitado` apenas como regra de UI, sem automação operacional confiável
- manter docs antigos dizendo `Next.js` enquanto a entrega real roda em `Vite`
- depender de placeholder de porta/PBX sem delimitar claramente o que fica fora do go-live

## 4. PRD Frontend

### 4.1 Objetivo

Entregar uma interface única, clara e operacional para administradores e moradores, com foco em elegibilidade, internet, rollout do softphone e inbox do morador.

### 4.2 Perfis

- Administrador
- Morador

### 4.3 Requisitos funcionais

- o login deve respeitar o bloqueio por `habilitado = false`
- o morador deve perder acesso ativo se sua elegibilidade mudar durante a sessão
- o Dashboard deve refletir indicadores operacionais reais do sistema FBR
- a view de Moradores deve exibir prontidão e bloqueios do softphone por residente
- a view de Internet deve concentrar o rollout técnico, checklist individual e indicadores de rede
- o `SoftphoneDock` deve funcionar como ponto único de acesso ao softphone e à inbox operacional
- o morador deve visualizar contadores de `voice`, `note` e `package`
- o morador deve conseguir marcar recados como lidos dentro do dock
- o sistema deve comunicar claramente quando algo está bloqueado por `habilitado`, internet, ausência de MAC ou falta de ramal

### 4.4 Requisitos não funcionais

- feedback claro de loading, erro e vazio
- sem discrepância visual entre painéis que mostram o mesmo status
- sem depender de texto técnico para o morador entender um bloqueio
- UI responsiva e estável em desktop

### 4.5 Fora de escopo para este fechamento

- telefonia externa
- UX avançada de PBX real
- redesign completo da aplicação inteira
- nova arquitetura de frontend

## 5. PRD Backend

### 5.1 Objetivo

Entregar uma camada backend confiável para sustentar elegibilidade, rollout do softphone, inbox do morador, integrações operacionais e preparação da infraestrutura real.

### 5.2 Componentes do backend FBR

- `mac-server.ts` como backend local atual
- Supabase como banco e autenticação
- migrations em `supabase/migrations`
- endpoints internos do softphone
- endpoints auxiliares de pagamento/PIX, chat e MAC

### 5.3 Requisitos funcionais

- toda rota sensível deve exigir sessão válida
- rotas administrativas devem exigir papel administrativo
- a inbox do morador deve retornar apenas itens do próprio residente
- a marcação de leitura deve respeitar ownership do morador
- o rollout do softphone deve refletir bloqueios e pendências reais
- o backend deve consolidar critérios de prontidão do residente
- a regra de `habilitado` deve ser reutilizável e auditável
- o sistema deve suportar recados manuais e recados automáticos
- as migrations críticas devem estar aplicadas e coerentes com o código

### 5.4 Requisitos não funcionais

- respostas padronizadas
- logs operacionais mínimos para troubleshooting
- redução de heurísticas inseguras
- documentação objetiva dos endpoints internos

### 5.5 Fora de escopo para este fechamento

- refatoração completa para múltiplos serviços
- automação avançada de telefonia real
- integração definitiva com hardware de porta antes de homologação

## 6. Tasklist de fechamento

Critério de prioridade:

- `P0`: obrigatório para fechar até `10/04`
- `P1`: importante, mas entra apenas se os `P0` estiverem completos

### 6.1 Blue Sprint

Sprint dedicada a tudo que é frontend.

1. `BLUE-01` `[FRONTEND][P0]` Consolidar a UX de bloqueio por elegibilidade em `App`, `ProfileModal`, `InternetView`, `ResidentsView` e `SoftphoneDock`.
   Done: todos os pontos que dependem de `habilitado`, `internet_active`, `softphone_enabled`, `softphone_extension` e `mac_address` exibem o mesmo racional de bloqueio.

2. `BLUE-02` `[FRONTEND][P0]` Finalizar o fluxo visual da inbox no `SoftphoneDock`.
   Done: contadores, lista, estado lido/não lido e feedback após clique funcionam sem inconsistência visual.

3. `BLUE-03` `[FRONTEND][P0]` Padronizar estados de loading, erro e vazio nos painéis FBR.
   Done: Dashboard, Internet, Moradores e Softphone não dependem de silêncio visual quando falha uma carga parcial.

4. `BLUE-04` `[FRONTEND][P0]` Fechar a leitura operacional do rollout do softphone no Dashboard e Internet.
   Done: números, filtros, badges e rótulos exibem a mesma origem e a mesma regra de negócio.

5. `BLUE-05` `[FRONTEND][P0]` Revisar a experiência do morador para cadastro/prontidão do softphone.
   Done: o morador consegue entender claramente o que falta para ficar apto ao rollout sem depender de suporte técnico.

6. `BLUE-06` `[FRONTEND][P1]` Ajustar o `SoftphoneDock` para separar com clareza o que está pronto, o que é placeholder e o que depende de PBX real.
   Done: o dock comunica corretamente os modos `Aguardando PBX`, `Pronto`, `Ativo` e limitações de porta.

7. `BLUE-07` `[FRONTEND][P1]` Revisar a consistência textual e de encoding nas telas do sistema FBR.
   Done: remover textos corrompidos, labels ambíguos e mensagens herdadas de contexto antigo.

8. `BLUE-08` `[FRONTEND][P1]` Revisar performance perceptiva e chunking do frontend.
   Done: eliminar imports dinâmicos inúteis/ambíguos destacados pelo build e estabilizar a carga do módulo softphone.

### 6.2 Gray Sprint

Sprint dedicada a backend, banco, docs, infra e demais arquivos.

1. `GRAY-01` `[BACKEND][P0]` Modularizar o `mac-server.ts` em áreas mínimas de domínio.
   Done: separar ao menos softphone, auth/guards, payments e utilitários para reduzir risco de manutenção no fechamento.

2. `GRAY-02` `[BACKEND][P0]` Consolidar a regra mestre de elegibilidade do residente.
   Done: backend e banco possuem uma regra explícita para bloquear/desbloquear por `habilitado`, `motivo_bloqueio`, status e inadimplência.

3. `GRAY-03` `[BACKEND][P0]` Implementar automação operacional para desligamento consultivo/efetivo de `habilitado`.
   Done: existe regra definida e aplicada para morador inadimplente e/ou fora da casa, com trilha mínima de auditoria.

4. `GRAY-04` `[BACKEND][P0]` Fechar o fluxo da inbox do morador no backend.
   Done: leitura, ownership, recados automáticos e contrato de retorno estão padronizados e documentados.

5. `GRAY-05` `[BACKEND][P0]` Criar o fluxo administrativo de recados manuais.
   Done: admin consegue criar recados em `resident_messages` com tipagem consistente e visibilidade correta por morador.

6. `GRAY-06` `[BACKEND][P0]` Ligar eventos do sistema à inbox.
   Done: pelo menos pagamentos e manutenção geram recados automáticos de forma previsível; internet e softphone ficam documentados conforme disponibilidade.

7. `GRAY-07` `[BACKEND][P0]` Endurecer autenticação e autorização dos fluxos FBR.
   Done: remover dependências perigosas de fallback por e-mail/heurística onde houver risco de identidade; rotas administrativas exigem guarda única e clara.

8. `GRAY-08` `[BACKEND][P0]` Revisar e validar migrations críticas do projeto.
   Done: `softphone_columns`, `softphone_inbox`, `resident_habilitado` e `resident_motivo_bloqueio` estão coerentes com o código e documentadas na ordem correta.

9. `GRAY-09` `[BACKEND][P0]` Documentar oficialmente o contrato dos endpoints FBR.
   Done: env, health, rollout, config, directory, inbox e door/open possuem contrato objetivo com autenticação, payload e resposta.

10. `GRAY-10` `[BACKEND][P0]` Atualizar a documentação do projeto para o estado real.
   Done: remover referência legada a `Next.js`, `AI Studio` e textos antigos; README e docs passam a refletir `Vite + React + mac-server + Supabase`.

11. `GRAY-11` `[BACKEND][P1]` Fechar a homologação do placeholder de porta.
   Done: documentar precisamente se o go-live sairá com `none`, `dtmf`, `http-relay` ou `extension`, sem promessa implícita de ação real.

12. `GRAY-12` `[BACKEND][P1]` Preparar a ativação do PBX real sem acoplar isso ao fechamento atual.
   Done: checklist de variáveis, healthcheck, testes de WSS e passos de homologação ficam prontos para a próxima fase.

13. `GRAY-13` `[BACKEND][P1]` Padronizar logs e troubleshooting do backend local.
   Done: erros relevantes do `mac-server` têm mensagens consistentes e rastreáveis.

14. `GRAY-14` `[BACKEND][P1]` Criar checklist final de homologação por perfil.
   Done: existe checklist objetivo para admin, morador, softphone e segurança básica antes do fechamento.

## 7. Ordem recomendada de execução até 10/04

### Dia 08/04

- `GRAY-02`
- `GRAY-04`
- `GRAY-07`
- `GRAY-08`
- `GRAY-10`

### Dia 09/04

- `BLUE-01`
- `BLUE-02`
- `BLUE-03`
- `BLUE-04`
- `GRAY-05`
- `GRAY-06`

### Dia 10/04

- `GRAY-09`
- `GRAY-14`
- `BLUE-05`
- `BLUE-06`
- smoke test final

## 8. Fechamento executivo

Se o objetivo é terminar até `10/04`, o fechamento mais realista não é “construir tudo”, e sim:

- fechar a regra de elegibilidade
- fechar a inbox operacional
- endurecer backend/autorização
- alinhar a documentação ao código real
- deixar PBX e porta explicitamente preparados, mas fora do go-live se ainda dependerem de infraestrutura externa

Em outras palavras:

- Blue Sprint fecha experiência, clareza e leitura operacional do frontend
- Gray Sprint fecha regra de negócio, backend, banco, documentação e prontidão real de entrega
