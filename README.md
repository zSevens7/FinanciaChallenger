# 💰 FinanciaChallenger: Uma Nova Jornada na Gestão Financeira

---

## 🚀 Motivação e Evolução do Projeto

O **FinanciaChallenger** nasce como uma evolução do **Codi Cash**, um sistema de gestão financeira originalmente desenvolvido para o **Challenge da Codi Academy**. Embora o Codi Cash tenha sido criado com foco exclusivo no **frontend** e nas necessidades da Codi Academy, o objetivo principal deste novo projeto é **expandir e refatorar** a aplicação para torná-la uma solução de gestão financeira **genérica e robusta**, acessível a qualquer usuário ou pequena empresa, e não apenas para um contexto específico.

Esta nova fase representa um desafio significativo: integrar um **backend completo com banco de dados**, garantindo que o sistema seja escalável, seguro e capaz de gerenciar dados de forma persistente. A paixão por finanças é o motor por trás dessa iniciativa, buscando construir uma ferramenta poderosa e intuitiva para controle financeiro pessoal ou empresarial.

---

## 🎯 Objetivo do Projeto

O **FinanciaChallenger** visa ser um software de gestão financeira completo, permitindo o cadastro, visualização e gestão de **vendas (receitas), despesas e indicadores financeiros**. Ele oferecerá uma interface web moderna, responsiva e intuitiva, com a capacidade de armazenar e processar dados de forma segura e eficiente.

---

## 🛣️ Próximos Passos e Funcionalidades Planejadas

Esta é a minha visão para o futuro do **FinanciaChallenger**. As funcionalidades listadas abaixo serão implementadas nas próximas fases de desenvolvimento, transformando o projeto em uma ferramenta ainda mais poderosa e flexível:

| Característica Planejada | Descrição Detalhada |
| :----------------------- | :------------------ |
| **Revitalização Visual** | Mudança completa do layout e esquema de cores para uma experiência visual renovada e moderna. |
| **Header Aprimorado** | Inclusão de um ícone de usuário no cabeçalho, visando a integração com futuras funcionalidades de autenticação. |
| **Módulo de Vendas Genérico** | Refatoração do módulo de vendas para permitir o registro de qualquer tipo de transação de receita, tornando-o aplicável a diversos cenários, não apenas cursos. |
| **Identidade Visual da Página** | Alteração do símbolo/favicon da página para refletir a nova identidade do FinanciaChallenger. |
| **Página de Login e Usuário** | Implementação de um sistema de autenticação completo, com telas de login e gerenciamento de perfil de usuário. |
| **Página de Planejamento Financeiro** | Adição de uma nova seção dedicada a ferramentas de planejamento, como orçamentos, metas e projeções financeiras. |
| **Integração com Banco de Dados** | Desenvolvimento de um backend robusto para persistir todos os dados (vendas, despesas, usuários) em um banco de dados, garantindo segurança e escalabilidade. |
| **Exclusão de Registros** | Adição de funcionalidade para remover entradas individuais de vendas ou despesas, oferecendo controle total sobre os dados. |
| **Exportar para as Planilhas** | Funcionalidade para exportar dados financeiros para formatos de planilha, facilitando a análise e o compartilhamento. |

---

## 📌 Mudanças já feitas

**🗓 Data:** 29/07/2025

- 🖼️ Trocada a logo da **Codi** para uma logo de um **banco genérico**.
- 🛒 Alterado o *ModalVendas* para um modal de vendas **genéricas**.
- 🎨 Alteradas as cores dos modals de *roxos* para *verde* e *vermelho*.
- 📊 Ajustadas as tabelas da página de vendas.


**🗓 Data:** 05/08/2025

- ➕ **Botões de ação reativados** na página de **Gastos** (`ActionButtons`), agora posicionados ao lado direito dos filtros de ano/mês.
- ➕ **Adicionados os botões de ação** na página de **Vendas** (`HeaderActionButtons`), também posicionados ao lado dos filtros, com layout responsivo.
- 🧱 **Refatorado o layout** das seções de filtros (ano/mês) nas páginas de **Gastos** e **Vendas**, agrupando filtros e botões em um contêiner flexível (`div`) para melhor organização visual.
- ⚙️ **Adicionado um icone de perfil** no headercontext, ou seja, todas paginas terão um icone de perfil e no futuro vou adicionar a pagina de perfil.

**🗓 Data:** 25/08/2025

-⚙️ **Criada a página de login** (LoginPage.tsx) com a estrutura visual completa.
-✨ **Implementada a lógica de simulação de login**, que exibe uma mensagem de erro ("Usuário ou senha inválidos") para credenciais incorretas.


**🗓 Data:** 26/08/2025

- 👤 **Criada a página de perfil** (`ProfilePage.tsx`) para exibir dados do usuário.
- 🛠️ **Implementados dois modais:** `EditProfileModal.tsx` e `ChangePasswordModal.tsx` para edição de dados e senha.
- 🔗 **Integrados os modais à página de perfil**, usando o estado do React para controlar sua abertura e fechamento.
- 🔄 **Refatorada a lógica de atualização** do estado do usuário com o spread operator para corrigir um erro de tipagem.
- 🧭 **Atualizada a navegação** no `Header` e na `AppSidebar` para incluir o item "Perfil" e o botão "Sair" (logout simulado).

**🗓 Data:** 26/08/2025 – Fase 3 (Refatoração e Centralização)

- 🔧 **Criados contextos para Gastos e Vendas** (`GastosContext.tsx` e `VendasContext.tsx`) para centralizar o estado e substituir chamadas diretas ao `localStorage`.
- 🔒 **Implementado `PrivateRoute`** para proteger rotas internas usando `AuthContext`.
- ♻️ **Refatoradas páginas Dashboard, Gastos e Vendas** para consumir dados dos contextos em vez do `localStorage`.
- 🗄️ **Centralizado o estado do usuário** no `AuthContext` com funções de login, logout e registro.
- 🧩 **Preparação para backend futuro**, mantendo todo o estado de dados e autenticação gerenciados pelos contextos no frontend.

---
## Estrutura do Projeto

| Pasta / Arquivo | Função / Descrição |
|-----------------|------------------|
| node_modules/ | Dependências do projeto |
| public/ | Arquivos públicos estáticos (HTML, favicon, etc.) |
| src/ | Código fonte principal do projeto |
| src/assets/ | Imagens, ícones e outros recursos estáticos |
| src/assets/icons/ | Ícones usados no projeto |
| src/components/ | Componentes reutilizáveis que não pertencem a uma página específica |
| src/components/DashHistory/ | Componentes da tabela de histórico |
| src/components/Header/ | Componentes relacionados ao cabeçalho |
| src/components/ui/ | Componentes de interface genéricos (botões, modals, sidebar) |
| src/components/AppSidebar.tsx | Sidebar principal do app |
| src/components/ConfirmModal.tsx | Modal de confirmação genérico |
| src/components/FloatingBox.tsx | Caixa flutuante reutilizável |
| src/components/MobileSidebar.tsx | Sidebar para versão mobile |
| src/components/ModalGasto.tsx | Modal para registrar gastos |
| src/components/ModalVenda.tsx | Modal para registrar vendas |
| src/components/PrimaryButton.tsx | Botão primário estilizado |
| src/components/PrivateRoute.tsx | Componente para proteger rotas privadas |
| src/contexts/ | Contextos React (Auth, Vendas, Gastos) para gerenciamento de estado global |
| src/features/ | Funcionalidades específicas do app |
| src/features/dashboard/ | Componentes e hooks do dashboard |
| src/features/dashboard/components/ | Gráficos, KPIs e widgets do dashboard |
| src/features/dashboard/hooks/ | Hooks específicos do dashboard |
| src/features/dashboard/dashboardKPI.tsx | Componente KPI do dashboard |
| src/features/gastos/components/ | Componentes da página de gastos |
| src/features/profile/ | Componentes da página de perfil |
| src/features/vendas/ | Componentes da página de vendas |
| src/hooks/ | Hooks personalizados reutilizáveis |
| src/layouts/ | Layouts de páginas |
| src/lib/ | Bibliotecas utilitárias |
| src/pages/ | Páginas do aplicativo (Dashboard, Login, Perfil, etc.) |
| src/services/ | Serviços de API ou lógica externa |
| src/types/ | Tipagens TypeScript do projeto |
| src/utils/ | Funções utilitárias gerais |
| App.css | Estilos globais do app |
| App.tsx | Componente principal do React |
| index.css | Estilos globais adicionais |
| main.tsx | Ponto de entrada do React |


---
## 🛠️ Tecnologias e Bibliotecas

O frontend do **FinanciaChallenger** utiliza as seguintes tecnologias modernas:

### ⚛️ Frontend & Framework
- ⚛️ **ReactJS** – Biblioteca principal para construção da interface.  
- 🌐 **ReactDOM** – Renderização do React no navegador.  
- 🛣️ **React Router DOM** – Gerenciamento de rotas no frontend.  
- 🧩 **TypeScript** – Tipagem estática e maior segurança no código.  
- ⚡ **Vite** – Ferramenta de build rápida e moderna.  

### 🎨 Estilo & UI
- 🎨 **TailwindCSS** – Estilização rápida, responsiva e modular.  
- 🔀 **Tailwind Merge** – Combinação dinâmica de classes Tailwind.  
- 🖼️ **@heroicons/react** – Conjunto de ícones da Heroicons.  
- 💠 **Lucide React** – Ícones leves e alternativos.  
- 🎭 **React Icons** – Ícones prontos para React.  
- 📅 **React Datepicker** – Componente para seleção de datas.  
- 🧱 **@radix-ui/react-dialog** – Componentes de diálogos acessíveis.  
- ➖ **@radix-ui/react-separator** – Separadores visuais reutilizáveis.  
- 🔗 **@radix-ui/react-slot** – Slots para composição de componentes.  
- 💬 **@radix-ui/react-tooltip** – Tooltips acessíveis.  

### 📊 Gráficos & Dados
- 📊 **Chart.js** – Biblioteca de gráficos.  
- 📈 **React ChartJS 2** – Integração do Chart.js com React.  
- 📉 **Recharts** – Biblioteca de gráficos baseada em SVG.  
- 🕒 **Moment.js** – Manipulação de datas e horários.  
- 💰 **FinanceJS** – Funções financeiras (juros, amortização, etc.).  

### 🛠️ Utilitários
- 🧩 **Clsx & Class Variance Authority** – Manipulação condicional de classes CSS.  
- 🆔 **UUID** – Geração de identificadores únicos.  
- 🧹 **ESLint & Prettier** – Linting e formatação de código.


---


## ✨ Funcionalidades Atuais (Herança do Codi Cash)

O projeto base já possui uma série de funcionalidades robustas de frontend, que servirão como alicerce para as futuras implementações:

### 1. Dashboard Principal

- **Resumos Mensais**: Exibição clara de receitas, despesas e balanço do período.
- **Gráficos Interativos**: Gráficos de barras/linhas para visualizar dados financeiros por diferentes períodos (semana, mês, ano).
- **KPIs**: Cards visuais com indicadores chave como Total de Vendas, Total de Despesas e Saldo Líquido.

### 2. Módulo de Vendas

- **Formulário de Cadastro**:
    - Tipo de curso (online ou presencial).
    - Dados do cliente (nome, e-mail, telefone).
    - Valor bruto da venda.
    - Descontos aplicados.
    - Impostos, comissões e taxas de cartão.
    - **Cálculo automático** do Valor Final da venda.

- **Lista de Vendas**: Visualização de todas as vendas cadastradas, com filtros por período e tipo de curso.

### 3. Módulo de Gastos

- **Cadastro de Despesas**:
    - Fixas: Luz, água, aluguel, internet, folha de pagamento, vale transporte, imposto sobre folha.
    - Variáveis: Manutenção, suprimentos, etc.

- **Gestão de Lançamentos**: Edição e exclusão de despesas.
- **Histórico de Gastos**: Visualização detalhada de todas as despesas registradas.

### 4. Visualizações e Gráficos Avançados

- **Gráfico Comparativo**: Receitas vs. Despesas ao longo do tempo.
- **Gráfico de Pizza**: Distribuição dos gastos por categoria.
- **Filtros Dinâmicos**: Por intervalo de tempo e categoria.

### 5. Experiência do Usuário (UX)

- Layout responsivo (desktop, tablet, mobile).
- Navegação clara e fácil.
- Feedback visual (mensagens de sucesso e erro).
- Modais para confirmações e formulários.

---

