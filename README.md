# 💰 FinanciaChallenger 1.0.0: Seu Sistema de Gestão Financeira Genérico

---

## 🚀 Sobre o Projeto

O **FinanciaChallenger** é uma evolução do projeto **Codi Cash**, originalmente desenvolvido para o **Challenge da Codi Academy**. Enquanto o Codi Cash era focado no gerenciamento de vendas de cursos, este novo projeto transforma a aplicação em **uma plataforma de gestão financeira genérica**, permitindo o controle de **vendas, despesas e indicadores financeiros** de qualquer projeto ou negócio.

Este projeto surgiu como um desafio pessoal: integrar **frontend e backend**, utilizando **Node.js**, **MySQL remoto** e **React + TypeScript + Tailwind**, aproveitando um subdomínio gratuito da Hostinger para testes e aprendizado.  

🔗 **Link do site funcional:** [https://www.sevenscash.sevensreview.com.br/](https://www.sevenscash.sevensreview.com.br/)  
> ⚠️ Sempre usar `www` no link.

---

## 🧩 Motivação e Aprendizado

Durante o curso da Codi Academy, trabalhamos em um projeto de finanças que originalmente registrava vendas e despesas de cursos. Minha proposta foi:  

1. **Adicionar backend completo** com Node.js e MySQL, permitindo que cada usuário tenha seus próprios dados.  
2. **Generalizar o módulo de vendas**, tornando-o aplicável a qualquer tipo de transação financeira.  
3. **Aprender na prática integração de frontend e backend**, algo que nunca havia feito antes.  

Essa atualização foi feita durante as férias, aproveitando o conhecimento recente em backend e banco de dados, transformando o site em **uma ferramenta de gestão financeira real e funcional**.

---

## 🛠️ Tecnologias Usadas

| Camada | Tecnologia | Função |
| :---- | :--------- | :---- |
| Frontend | React + TypeScript + Tailwind | Interface web moderna, responsiva e interativa |
| Backend | Node.js | Servidor e API para persistência de dados |
| Banco de Dados | MySQL (remoto via Hostinger/phpMyAdmin) | Armazenamento de vendas, despesas e usuários |
| Hospedagem | Hostinger | Subdomínio e suporte para backend e banco |
| Rotas SPA | React Router (HashRouter) | Navegação entre páginas sem quebrar o SPA |

---

## 🗂️ Estrutura Atual do Site

### 🔑 Cadastro e Login
- Necessário criar **usuário com username/email e senha**.
- Cada usuário possui seu próprio ambiente de dados financeiros.

### 📊 Dashboard
- **VPL (Valor Presente Líquido)**: Diferença de fluxo de caixa ano a ano, mês a mês e dia a dia.
- **Ferramentas adicionais de matemática financeira**:
  - TIR (Taxa Interna de Retorno)
  - Payback (tempo necessário para retorno do investimento)
- Observação: Para utilizar TIR e Payback, é necessário registrar **gastos como investimentos iniciais**.

### 💸 Página de Gastos
- Cadastro completo de despesas (fixas e variáveis)
- Tabelas detalhadas e gráficos interativos
- Edição e exclusão de entradas

### 📈 Página de Vendas
- Cadastro genérico de vendas
- Visualização de transações por período
- Interface simples, mas funcional, não limitada a cursos

---

## 🛣️ Funcionalidades Planejadas (Futuras Atualizações)

| Funcionalidade | Descrição |
| :------------- | :-------- |
| Página de Previsão/Planejamento | Ferramenta de planejamento financeiro baseada em matemática financeira |
| Dashboard Aprimorado | Gráficos avançados, KPIs e análises detalhadas |
| Exportação de Dados | Exportar vendas e despesas para planilhas |
| Identidade Visual Atualizada | Ícones, favicon e layout renovado |
| Exclusão de Registros Avançada | Remover múltiplos lançamentos de uma vez |
| Integração Completa com Backend | Melhor performance, segurança e escalabilidade |

---

## 📂 Estrutura de Desenvolvimento

- **Frontend:** React + TypeScript + Tailwind, hospedado no subdomínio da Hostinger.
- **Backend:** Node.js, API RESTful, conexão com MySQL remoto.
- **Banco:** MySQL via phpMyAdmin (Hostinger), cada usuário possui seus dados separados.
- **Versionamento:** GitHub [Repositório Atualizado](https://github.com/zSevens7/FinanciaChallenger)
- **Log de mudanças:** [LOGS.md](https://github.com/zSevens7/FinanciaChallenger/blob/main/LOGS.md)

---

## 📬 Contato e Suporte

Qualquer dúvida, bug ou sugestão:  

- Email: **gabrielteperino@yahoo.com.br**  
- Site pessoal: [https://www.sevensnovels.com.br](https://www.sevensnovels.com.br)  

---

## ✨ Considerações Finais

O **FinanciaChallenger** é um projeto em constante evolução, com foco em aprendizado, integração de tecnologias e criação de uma ferramenta financeira **prática, genérica e funcional**.  
A versão atual é **1.0.0**, mas novas funcionalidades e melhorias serão implementadas nas próximas atualizações.
