# 💰 FinanciaChallenger: Logs e Info das Pastas

---

## 🗓 Histórico de Atualizações

## **🗓 Data:** 29/07/2025
- 🖼️ Trocada a logo da Codi para uma logo de banco genérico.  
- 🛒 Alterado o `ModalVendas` para vendas genéricas.  
- 🎨 Cores dos modals alteradas de roxo para verde/vermelho.  
- 📊 Ajustadas as tabelas da página de vendas.

## **🗓 Data:** 05/08/2025
- ➕ Botões de ação reativados na página de Gastos (`ActionButtons`) e Vendas (`HeaderActionButtons`).  
- 🧱 Refatoração do layout das seções de filtros (ano/mês) nas páginas Gastos e Vendas.  
- ⚙️ Adicionado ícone de perfil no header (prévia para futura página de perfil).

## **🗓 Data:** 25/08/2025
- ⚙️ Criada página de Login (`LoginPage.tsx`) com lógica de simulação.  
- ✨ Mensagem de erro exibida para credenciais inválidas.

## **🗓 Data:** 26/08/2025
- 👤 Criada página de Perfil (`ProfilePage.tsx`).  
- 🛠️ Modais `EditProfileModal.tsx` e `ChangePasswordModal.tsx` implementados.  
- 🔄 Atualização de estado do usuário corrigida usando spread operator.  
- 🧭 Navegação atualizada no Header e AppSidebar com Perfil e Logout.  

## **🗓 Data:** 26/08/2025 – Fase 3 (Refatoração e Centralização)
- 🔧 Contextos para Gastos e Vendas criados (substituindo localStorage).  
- 🔒 `PrivateRoute` implementado para proteger rotas internas.  
- ♻️ Refatoradas páginas Dashboard, Gastos e Vendas para consumir dados dos contextos.  
- 🗄️ Estado do usuário centralizado no `AuthContext`.  
- 🧩 Preparação para backend futuro.

## **🗓 Data:** 08/09/2025 – Backend Inicial
- 📁 Criada pasta `backend`.  
- 📄 `package.json` do backend criado.  
- 🖥️ `server.js` implementado para rodar backend e banco de dados.  
- 🛡️ Middleware `authMiddleware.js` criado.  
- 📂 Rotas `auth.js` implementadas.  
- 🔐 `.env` criado (não enviado ao GitHub).

## **🗓 Data:** 14/09/2025 – Configuração do Servidor
- 🐛 Corrigido erro 404 no React Router (SPA) usando `try_files`.  
- 🔧 Nginx configurado para redirecionar `/api/` para backend na porta 4000.  
- 🖥️ Backend escutando em `0.0.0.0:4000`.  
- 🚀 Testes de registro via curl e navegador funcionando.

## **🗓 Data:** 15/09/2025
- 🔐 Backend atualizado (`auth.js`) para reset/forgetPassword.  
- 📝 Página resetPassword criada.  
- 🛤️ `BrowserRouter` substituído por `HashRouter` para corrigir F5.

## **🗓 Data:** 16/09/2025
 Backend
- 🧾 Testado adicionar os dados de vendas e gastos na página do frontend.

 Frontend
- ⚙️ Ajustes em arquivos nos Contexts e `ModalVenda` para arrumar a exibição de vendas e gastos.  
- 🐞 Corrigido bug de troca de username.

 Status
- ✅ Site funcional e utilizável.  
- 🛠️ Futuramente serão adicionadas novas funcionalidades e realizados testes para verificar outros erros.


## **🗓 Data:** 19/09/2025

 🔧 Backend
- ✅ Conexão entre **backend**, **NGINX** e **frontend** está 100% funcional.
- 🔐 Middleware de autenticação com JWT revisado e operando corretamente.
- 🧾 Inserção de dados na tabela `vendas` funcionando sem erros de coluna ou validação.

 💻 Frontend
- 🛠 Correções aplicadas:
  - ✅ Formulário de **venda** agora salva os dados corretamente.
  - 📊 Cards de **TIR**, **PAYBACK** e **Investimento** restaurados e visíveis.
  - 🎨 Ajuste de **cores** na tabela de **dashboard** e **gastos** para melhor contraste.
  - 🧹 Remoção do campo redundante `tipoVenda` para simplificar o fluxo de dados.
  - 🐞 Correções de pequenos bugs visuais e de estado nos componentes.

 📌 Observações
- 🔄 Ajustes pendentes para consolidar o **Plano 1.0** do site.
- 🧪 Testes manuais estão sendo feitos gradualmente para garantir estabilidade.
- 💡 Próximos passos: arrumar para colocar os dados de gastos.

## **🗓 Data:** 20/09/2025

 🔧 Backend
- ✅ Corrigido o erro de criação de novas contas (registro de usuários funcionando corretamente).
- 🧾 Registro de novos dados na página de **gastos** funcionando sem erros.

 💻 Frontend
- 🛠 Ajustes aplicados para consolidar o funcionamento básico do site.
- 📊 Fluxo de gastos atualizado e integrado com o backend.
- 🎨 Pequenos ajustes visuais e de estado nos componentes para melhor experiência.

 📌 Observações
- 🏁 O site está no **Plano 1.0**.
- 🔄 Funcionalidade básica do site operando corretamente.
- 💡 Próximos passos: implementação de recursos avançados e otimizações.


## **🗓 Data:** 23/09/2025

 🔧 Backend / Frontend
- 🐛 Corrigido bug de não atualização dos dados na página de gastos.
- 🎨 Corrigido o visual da tabela de vendas e removido o tipo de venda (informação inútil).
- 🆕 Criado novo arquivo `metrics.js` para funcionalidades adicionais de métricas.

 📌 Observações
- ⚠️ Ainda precisa corrigir o DashboardKPI.
- 💡 Próximos passos: ajustes no DashboardKPI e melhorias visuais adicionais.

---

## 🗂 Estrutura do Projeto

| Pasta / Arquivo | Função / Descrição |
|-----------------|------------------|
| backend/ | Código do backend (Node.js + Express) |
| backend/package.json | Dependências e scripts do backend |
| backend/server.js | Arquivo principal do backend |
| backend/middleware/authMiddleware.js | Middleware de autenticação |
| backend/routes/auth.js | Rotas de autenticação |
| backend/checkUsers.js | Verifica usuários no banco |
| backend/.env | Variáveis de ambiente (não enviado ao GitHub) |
| node_modules/ | Dependências do frontend |
| public/ | Arquivos estáticos (HTML, favicon, etc.) |
| src/ | Código fonte do frontend |
| src/assets/ | Recursos estáticos (imagens, ícones) |
| src/components/ | Componentes reutilizáveis |
| src/contexts/ | Contextos React (Auth, Vendas, Gastos) |
| src/pages/ | Páginas do app (Dashboard, Login, Perfil, etc.) |
| src/services/api.ts | Comunicação com backend |
| src/types/ | Tipagens TypeScript |
| App.tsx | Componente principal |
| main.tsx | Entrada do React |
| index.css / App.css | Estilos globais |

---

## 📦 Frontend – Dependências

| Biblioteca | Função |
|-----------|-------|
| react | Biblioteca principal do frontend |
| react-dom | Renderização do React |
| react-router-dom | Navegação entre páginas |
| axios | Comunicação com backend via HTTP |
| tailwindcss | Framework CSS para estilo rápido e responsivo |
| @heroicons/react | Ícones pré-definidos para React |
| chart.js / react-chartjs-2 | Criação de gráficos financeiros |
| moment | Manipulação de datas |
| uuid | Geração de IDs únicos |
| lucide-react | Biblioteca de ícones alternativos |
| financejs | Funções financeiras auxiliares |
| @radix-ui/react-* | Componentes UI acessíveis (tooltip, dialog, separator, slot) |

---

## 📦 Backend – Dependências

| Biblioteca | Função |
|-----------|-------|
| express | Servidor web para APIs REST |
| mysql2 | Conexão com MySQL |
| sqlite3 | Banco de dados leve para testes (opcional) |
| jsonwebtoken | Geração e validação de tokens JWT |
| bcrypt | Hash de senhas para segurança |
| cors | Habilita comunicação frontend ↔ backend |
| dotenv | Variáveis de ambiente |
| nodemon | Reinício automático do servidor durante desenvolvimento |
| joi | Validação de dados (schemas) para requests e inputs |
