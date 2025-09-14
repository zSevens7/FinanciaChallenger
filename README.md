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

-  🔧 **Criados contextos para Gastos e Vendas** (GastosContext.tsx e VendasContext.tsx) para centralizar o estado e substituir chamadas diretas ao localStorage.
-  🔒 **Implementado PrivateRoute** para proteger rotas internas usando AuthContext.
-  ♻️ **Refatoradas páginas Dashboard, Gastos e Vendas** para consumir dados dos contextos em vez do localStorage.
-  🗄️ **Centralizado o estado do usuário** no AuthContext com funções de login, logout e registro.
-  🧩 **Preparação para backend futuro**, mantendo todo o estado de dados e autenticação gerenciados pelos contextos no frontend.

**🗓 Data:** 08/09/2025

### Backend
- 📁 **Criada a pasta `backend`** com estrutura inicial.  
- 📄 **Criado `package.json`** do backend.  
- 🖥️ **Criado `server.js`** para rodar o backend e gerenciar o banco de dados.  
- 🛡️ **Criada a pasta `middleware`** com `authMiddleware.js` para autenticação.  
- 📂 **Criada a pasta `routes`** com `auth.js` para rotas de autenticação.  
- 🔍 **Criado `checkUsers.js`** para verificar se o banco de dados possui usuários.  
- 🔐 **Criado arquivo `.env`** para variáveis de ambiente (não enviado para o GitHub).

### Frontend
- 🛠️ **Arquivos ajustados:** `AppSidebar.tsx`, `AuthContext.tsx`, `ProfilePage.tsx`, `RegisterPage.tsx`.  
  - Agora é possível **criar contas reais** e logar com elas.  
  - Logout no perfil está funcionando corretamente.  
- 🌐 **Criado `services/api.ts`** para conectar frontend ao backend.  

### Observações
- ⚠️ O arquivo `.env` não deve ser enviado para o GitHub, conforme padrão do `.gitignore`.

**🗓 Data:** 14/09/2025

## 🔧 Configuração do Servidor e Resolução de Problemas
- 🐛 Corrigido erro 404 ao dar F5 nas rotas do React Router através da configuração adequada do Nginx para Single Page Applications (SPA), adicionando `try_files $uri $uri/ /index.html;` no bloco `location /`.
- 🔧 Ajustada a configuração do Nginx para redirecionar corretamente as requisições da API (`/api/`) para o backend na porta 4000, resolvendo problemas de CORS e proxy reverso.
- 🖥️ Configurado o backend para escutar em todas as interfaces (`0.0.0.0`) e na porta 4000, garantindo que o Nginx possa se comunicar com ele.
- 🚀 Testes bem-sucedidos de registro de usuários tanto via `curl` quanto no navegador, confirmando que a API e o frontend estão se comunicando corretamente.
- 📝 Documentação do processo de solução de problemas e configuração para referência futura.

## 🌐 Frontend
- 🔗 Rotas do React Router agora funcionam corretamente, incluindo ao recarregar a página (F5) em qualquer rota.
- 🧪 Testes de registro e login realizados com sucesso no navegador, integrando completamente o frontend com o backend.

## 📊 Banco de Dados
- 👥 Tabela de usuários está sendo preenchida corretamente com novos registros, confirmando a integração com o MySQL.

## ✅ Status Atual
- ✅ Backend rodando na porta 4000 e respondendo às requisições.
- ✅ Nginx configurado como proxy reverso e servindo o frontend React.
- ✅ Frontend integrado com o backend através da API.
- ✅ Problemas de CORS e rotas resolvidos.
- ❌ Arrumar o envio do link do email quando o usuário esquece a senha.
- ❌ Os dados de vendas/gastos ainda não estão interligando ao banco de dados ou backend; é necessário investigar a causa.


---
---
## Estrutura do Projeto

| Pasta / Arquivo | Função / Descrição |
|-----------------|------------------|
| backend/ | Código do backend (Node.js + Express) |
| backend/package.json | Gerenciador de dependências do backend |
| backend/server.js | Arquivo principal do backend para rodar servidor e banco de dados |
| backend/middleware/authMiddleware.js | Middleware de autenticação do backend |
| backend/routes/auth.js | Rotas de autenticação (login, register) |
| backend/checkUsers.js | Verifica se existem usuários no banco de dados |
| backend/.env | Variáveis de ambiente do backend (não enviado para GitHub) |
| node_modules/ | Dependências do frontend |
| public/ | Arquivos públicos estáticos (HTML, favicon, etc.) |
| src/ | Código fonte principal do frontend |
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
| src/services/ | Serviços de API ou lógica externa (ex: `api.ts` para comunicação com backend) |
| src/types/ | Tipagens TypeScript do projeto |
| src/utils/ | Funções utilitárias gerais |
| App.css | Estilos globais do app |
| App.tsx | Componente principal do React |
| index.css | Estilos globais adicionais |
| main.tsx | Ponto de entrada do React |


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

## 🛠️ Tecnologias Atuais

O frontend do **FinanciaChallenger** é construído com base nas seguintes tecnologias modernas:

- **HTML5, CSS3 e JavaScript**.
- **TailwindCSS** para estilização eficiente e responsiva.
- **ReactJS** com abordagem mobile first, garantindo uma arquitetura de código limpa e modular.

