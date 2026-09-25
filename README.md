# PROMPT ESPECIFICAÇÃO TÉCNICA: PAINEL ADMIN MASTER - SUPER APP IBIAPABA (CE)

Você é um Engenheiro de Software Senior especialista em Dashboards Corporativos de Alta Criticidade em React 19, TypeScript, Tailwind CSS e Supabase (PostgreSQL + RLS).
Sua missão é desenvolver o Painel Admin Master e Torre de Controle do Super App Regional da Serra da Ibiapaba (CE), contemplando os 9 municípios serranos: Tianguá, Ubajara, Viçosa do Ceará, São Benedito, Guaraciaba do Norte, Ipu, Ibiapina, Carnaubal e Croatá.

---

### 1. ARQUITETURA DE SEGURANÇA E CONTROLE (ZERO-TRUST)
1. **Isolamento & Autenticação:**
   - Tela de login isolada para administradores com suporte a 2FA/OTP (código numérico de 6 dígitos auto-avançável e atalhos de homologação).
   - Sessão via Token JWT criptografado com papel estrito (`super_admin`, `ops_manager` ou `security_auditor`).
   - Componente de guarda de rota (`ProtectedRoute`) impedindo qualquer renderização sem credencial validada.
2. **Trilha de Auditoria Imutável (Audit Trail):**
   - Registro automático e obrigatório de cada intervenção e login administrativo: ID do admin, IP de origem regional (ex: SerraNet Fibra - Tianguá), timestamp exato (BRT), ação realizada, alvo e assinatura de integridade criptográfica (SHA-256).
   - Exportação do relatório de auditoria em formato JSON para compliance.
3. **Políticas de RLS (Row Level Security):**
   - Configuração de banco de dados garantindo que tabelas financeiras (`financial_transfers`), frotas e operações sensíveis só sejam acessíveis por requisições autenticadas com role administrativo via Supabase.

---

### 2. MÓDULOS OPERACIONAIS DO DASHBOARD

#### A. VISÃO GERAL (BI & TELEMETRIA REGIONAL)
- Indicadores em tempo real: GMV Total Transacionado, Volume de Pedidos em Andamento, Comissão Retida Líquida (média de 12.5%) e Entregadores Conectados na Serra.
- Cards operacionais para as 9 cidades da Serra da Ibiapaba, detalhando faturamento bruto, altitude, frotas ativas e saldo a liquidar por município.
- Gráficos operacionais: Curva de volume horário de pedidos (destacando picos de almoço e jantar serrano) e distribuição por segmento (Restaurantes, Supermercados, Farmácias e Distribuidoras).
- Segmentação temporal (Hoje, Ontem, 7 Dias, Este Mês) e filtro por polo municipal.

#### B. TORRE DE CONTROLE & MOTOR DE ALERTAS SLA EM TEMPO REAL
Monitoramento proativo com engine de SLA automatizado:
- **Alerta Amarelo (Atenção):**
  * Pedidos não aceitos pela loja há mais de 10 minutos.
  * Pedidos prontos no balcão da loja há mais de 15 minutos sem entregador alocado.
- **Alerta Vermelho (Crítico):**
  * Pedidos estagnados/parados há mais de 25 minutos.
  * Entregador com telemetria estática (parado no mapa) há mais de 10 minutos durante corrida ativa na serra (risco de pane ou cerração/neblina).
- Telemetria de motos: acompanhamento de velocidade (km/h), tempo de imobilidade e alertas climáticos.

#### C. AÇÕES RÁPIDAS DE INTERVENÇÃO (1-CLIQUE)
Ações operacionais imediatas em cada card de alerta com modais de confirmação:
1. **Notificar Loja via WhatsApp:** Disparo de mensagem pré-formatada oficial cobrando agilidade do operador da loja com um clique.
2. **Relançar Corrida na Fila:** Reinjeção do pedido com prioridade máxima no pool de entregadores da cidade com bônus de incentivo (+R$ 2,00 a +R$ 5,00).
3. **Atribuir Entregador Manualmente:** Seleção e despacho de entregador livre da frota local para socorrer a entrega.
4. **Cancelar & Reembolsar na Hora:** Cancelamento imediato com devolução do valor via Pix (chave do cliente) ou estorno no cartão de crédito, com justificativa obrigatória registrada na auditoria.

#### D. PROTOCOLO DE PAUSA DE EMERGÊNCIA (SERRA / CLIMA)
- Chave geral e controles individuais por cidade para suspender temporariamente novos pedidos no app em situações extremas:
  * Tempestades severas / neblina densa nas curvas da rodovia CE-187 e serra de Tianguá;
  * Quedas generalizadas de energia elétrica ou internet fibra na serra.
- Mensagem de alerta visível no aplicativo para clientes e lojistas.

#### E. GESTÃO OPERACIONAL DE LOJAS, ENTREGADORES E TAXA DE CHUVA
- **Lojas:** Aprovação manual de novos cadastros, visualização de CNPJ, taxas de comissão e suspensão preventiva.
- **Entregadores:** Homologação de novos motociclistas, verificação de CNH/documentos, bloqueios de segurança e rating.
- **Taxa Dinâmica de Chuva (+R$):** Acionamento manual com valor configurável por cidade (repassado 100% aos entregadores parceiros).

#### F. FINANCEIRO & CENTRAL DE DISPUTAS
- **Central de Disputas:** Mediação master de reclamações de clientes (atraso excessivo, comida fria, item faltante) com opções de estorno Pix, cupom bônus ou rejeição fundamentada.
- **Repasses Semanais via Pix:** Painel de conciliação de faturamento bruto, desconto de taxa de comissão e liquidação em lote com simulação de envio instantâneo via SPI (Banco Central).

---

### 3. DIRETRIZES DE DESIGN E UX
- **Tema:** Suporte nativo a Dark Mode e Light Mode com alternador instantâneo no header.
- **Tipografia:** `Plus Jakarta Sans` para interface executiva e `JetBrains Mono` com números tabulares (`tabular-nums`) para métricas financeiras, relógios e telemetria.
- **Layout:** Barra lateral colapsável com contadores em tempo real, header com relógio regional sincronizado em horário de Brasília (BRT) e controles de injeção de eventos de teste (`+ Pedido Live`, `+ Amarelo`, `+ Vermelho`).
- **Feedback:** Sistema de notificações contextuais (Toasts) não invasivos para cada ação administrativa executada.
