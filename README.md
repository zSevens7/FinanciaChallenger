
# 💰 Codi Cash - Sistema de Gestão Financeira

## 🎯 Objetivo do Projeto

O **Codi Cash** é um software de gestão financeira desenvolvido com o objetivo de facilitar o controle das finanças de cada unidade da **Codi Academy**. Este sistema permite o cadastro, visualização e gestão de **vendas, despesas e indicadores financeiros** através de uma interface web moderna, responsiva e intuitiva.

Este projeto foi desenvolvido como parte de um **Challenge**, com foco exclusivo no desenvolvimento do **frontend** da aplicação, garantindo uma experiência de usuário otimizada e uma arquitetura de código limpa e modular.

---

## 🚀 Escopo do Desafio (Frontend)

O desafio consistiu em desenvolver a interface completa e funcional do sistema, utilizando tecnologias modernas e garantindo:

- Interfaces responsivas para diversos dispositivos (**mobile first**).
- Alta usabilidade e navegação intuitiva.
- Componentização e reutilização de código para escalabilidade e manutenção.
- Estrutura de projeto limpa e organizada.

---

## ✨ Funcionalidades Requeridas

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

## 🛠️ Requisitos Técnicos

- **HTML5, CSS3 e JavaScript**.
- **TailwindCSS**.
- **ReactJS** com abordagem **mobile first**.
- Estrutura modular com componentes reutilizáveis.

---

## ✅ Critérios de Avaliação

- Interface responsiva e funcional.
- Boa organização do código.
- Reutilização de componentes.
- Alinhamento com os requisitos.
- Apresentação final.

---

## 📦 Entregáveis

- Repositório no GitHub.
- Link de deploy (Vercel, Netlify, etc).
- Documentação para rodar localmente.
- Documentação do frontend.
- Apresentação do projeto.

---

### CHALLENGEVII-TARDE-UFJF

---

## 🎨 Protótipos no Figma

O design visual do projeto foi inicialmente estruturado no Figma pelo grupo, servindo como base para o desenvolvimento da interface do sistema.

- 🔗 [Visualizar protótipo mobile](https://www.figma.com/proto/GqZUatYhyc7vB4leHz24uO/CodiAcademy--Copy-?page-id=2612%3A9344&node-id=2612-9353&p=f&viewport=115%2C266%2C0.16&t=Dd2gEp0czH9oICpj-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=2612%3A9353&show-proto-sidebar=1)
- 🔗 [Visualizar protótipo desktop](https://www.figma.com/proto/GqZUatYhyc7vB4leHz24uO/CodiAcademy--Copy-?page-id=618%3A11050&node-id=654-29657&p=f&viewport=309%2C338%2C0.05&t=U968KR5HwadZvLsa-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=654%3A29584&show-proto-sidebar=1)

---


## 🚀 Guia Rápido: Adicionando Dados de Teste


### 1. Adicionar Vendas Simuladas

```javascript
const nomes = ["João Silva", "Maria Oliveira", "Carlos Santos", "Ana Souza", "Pedro Lima", "Juliana Costa", "Lucas Rocha", "Fernanda Alves", "Rafael Martins", "Camila Ribeiro"];
const cursos = ["online", "presencial"];
const vendasSimuladas = [];

for (let i = 0; i < 50; i++) {
    const ano = 2023 + Math.floor(Math.random() * 3); // 2023, 2024, 2025
    const mes = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
    const dia = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");

    const data = `${ano}-${mes}-${dia}`;
    const tipoCurso = cursos[Math.floor(Math.random() * cursos.length)];
    const nomeCliente = nomes[Math.floor(Math.random() * nomes.length)];
    const email = nomeCliente.toLowerCase().replace(" ", ".") + "@example.com";
    const telefone = `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const valorBruto = Math.floor(800 + Math.random() * 2200); // entre R$800 e R$3000
    const desconto = Math.floor(Math.random() * 200);
    const imposto = Math.floor(valorBruto * 0.1); // 10%
    const comissao = Math.floor(valorBruto * 0.05); // 5%
    const valorFinal = valorBruto - desconto - imposto - comissao;

    vendasSimuladas.push({
        id: Date.now() + i,
        data,
        tipoCurso,
        nomeCliente,
        email,
        telefone,
        valorBruto,
        desconto,
        imposto,
        comissao,
        valorFinal,
    });
}
localStorage.setItem("vendas", JSON.stringify(vendasSimuladas));
console.log("✅ 50 vendas simuladas adicionadas no localStorage!");
```
### 2. Adicionar Vendas Simuladas
```javascript
const categorias = [
    "moradia",
    "contas_casa",
    "internet_telefone",
    "impostos_taxas",
    "dividas_emprestimos",
    "folha_pagamento",
    "vale_transporte",
    "imposto_sobre_folha",
    "outros"
];

const tipos = [
    "fixo_essencial",
    "fixo_nao_essencial",
    "variavel_essencial",
    "variavel_nao_essencial",
    "extraordinario",
    "recorrente",
    "unico",
    "outro_tipo"
];

const nomesGasto = [
    "Aluguel",
    "Conta de Luz",
    "Água",
    "Internet",
    "Telefone",
    "IPTU",
    "Empréstimo",
    "Folha de Pagamento",
    "Transporte Funcionários",
    "INSS Patronal",
    "Netflix",
    "Spotify",
    "Compra de Material",
    "Assinatura de Software",
    "Deslocamento",
    "Hospedagem de Site",
    "Compra Equipamento",
    "Reparo de Máquina",
    "Pagamento Freelancer",
    "Outros"
];

const gastosSimulados = [];

// Adiciona investimento inicial
gastosSimulados.push({
    id: 1,
    data: "2023-01-01",
    nome: "Investimento Inicial",
    preco: -10000, // Ajustado para ser negativo, representando uma saída de caixa
    categoria: "investimentos_poupanca",
    tipoDespesa: "investimento"
});

// Adiciona os outros 49 gastos
for (let i = 2; i <= 50; i++) {
    const nome = nomesGasto[Math.floor(Math.random() * nomesGasto.length)];
    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
    const tipoDespesa = tipos[Math.floor(Math.random() * tipos.length)];

    const ano = 2023 + Math.floor(Math.random() * 3);
    const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const data = `${ano}-${mes}-${dia}`;

    const preco = parseFloat((Math.random() * 1000 + 50).toFixed(2)); // Valor positivo
    const precoComSinal = -preco; // Transformando em negativo para representar despesa

    gastosSimulados.push({
        id: i,
        data,
        nome,
        preco: precoComSinal, // Salva o preço como negativo
        categoria,
        tipoDespesa
    });
}

localStorage.setItem("gastos", JSON.stringify(gastosSimulados));

console.log("✅ Dados de gastos salvos no localStorage, incluindo o investimento inicial.");
```




## 🌐 Hospedagem do Projeto

O projeto está disponível online em:

🔗 **https://codi-vercel2-0.vercel.app/**

---

## 3. Entendendo o Investimento Inicial nos Gastos

O item **“Investimento Inicial”** é essencial para que as métricas **TIR**, **Payback** e **VPL** funcionem corretamente.

- O **TIR** e o **Payback** são calculados **por ano**, ou seja, não acumulam vários anos.
- Portanto, para analisar esses indicadores em cada ano, deve-se adicionar manualmente um **Investimento Inicial** no início do ano (idealmente com base nos custos do ano anterior).

---

## 📊 Entendendo as Métricas Financeiras

### 🔢 VPL (Valor Presente Líquido)

- Calcula o valor presente de fluxos futuros descontados por uma taxa.
- Serve para avaliar a viabilidade do projeto:
  - **VPL > 0**: Projeto é viável.
  - **VPL < 0**: Projeto não é viável.
  - **VPL = 0**: Projeto apenas cobre os custos.
- No Codi Cash, o **Saldo Líquido Acumulado** no gráfico representa o VPL visual.

### 📈 TIR (Taxa Interna de Retorno)

- Taxa que zera o VPL de um projeto.
- Representa a **rentabilidade** do projeto.
- Quanto maior a TIR, melhor o investimento.

### ⏳ Payback

- Tempo necessário para **recuperar o investimento inicial** com os lucros.
- Indicador de liquidez: quanto menor, mais rápido o retorno.
- No sistema, é exibido **em meses**.

---

## 💻 Como o Projeto Foi Implementado

### 🧰 Tecnologias Principais

- **React**: UI declarativa e eficiente.
- **TypeScript**: Tipagem estática para maior robustez.
- **Tailwind CSS**: Estilização rápida com classes utilitárias.

---

## 📦 Bibliotecas e Ferramentas

### 🛠️ Produção

- [`@heroicons/react`](https://github.com/tailwindlabs/heroicons), [`lucide-react`](https://lucide.dev/): Ícones SVG.
- [`@radix-ui/react-*`](https://www.radix-ui.com/): Componentes acessíveis (modais, tooltips, etc.).
- [`chart.js`](https://www.chartjs.org/), [`react-chartjs-2`](https://react-chartjs-2.js.org/), [`recharts`](https://recharts.org/): Gráficos interativos.
- [`clsx`](https://www.npmjs.com/package/clsx), [`class-variance-authority`](https://cva.style/), [`tailwind-merge`](https://tailwind-merge.vercel.app/): Gerenciamento inteligente de classes CSS.
- [`financejs`](https://github.com/ebradyjobory/finance.js): Cálculos de VPL, TIR, Payback.
- [`moment`](https://momentjs.com/): Manipulação e formatação de datas.
- [`react-router-dom`](https://reactrouter.com/): Roteamento SPA.
- [`react-datepicker`](https://reactdatepicker.com/), [`react-icons`](https://react-icons.github.io/react-icons/): Utilitários de UI.

### ⚙️ Desenvolvimento

- [`eslint`](https://eslint.org/), [`prettier`](https://prettier.io/): Linting e formatação.
- [`vite`](https://vitejs.dev/), [`@vitejs/plugin-react`](https://vitejs.dev/guide/): Build moderno e rápido.
- `@types/*`, `typescript`: Tipagens e compilação.
- `tailwindcss`, `postcss`, `autoprefixer`: Pipeline de estilização CSS.

---

## ⚠️ Observação Importante

> 🔍 **Detalhe sobre os dados automáticos de gasto**  
> O código insere automaticamente um **"Investimento Inicial"** no início do ano. Isso é **fundamental** para o cálculo de **TIR** e **Payback**, pois essas métricas dependem de um **fluxo de caixa inicial negativo**.
>
> ❗ **Limitação Atual:**  
> As métricas **TIR** e **Payback** funcionam apenas **por ano**, e **não** consideram múltiplos anos.
>
> ✅ **Recomendação:**  
> Se deseja acompanhar esses indicadores anualmente, **adicione sempre** um gasto chamado `Investimento Inicial` no começo de cada ano, com base nos custos do final do ano anterior (por exemplo, dezembro).
>
> 💡 **Melhoria Futuramente:**  
> A lógica pode ser expandida para comportar **projeções multi-ano** e auxiliar em um **planejamento estratégico de longo prazo**.

---


### 📝 Licença
Este projeto foi desenvolvido como aprendizado no curso da [Codi Academy](https://codiacademy.com.br/).

### 👨‍💻 Autoria  
Desenvolvido por:  
- [Gabriel Teperino](https://github.com/zSevens7)  
- [Vitor Reis](https://github.com/vitorszreis)  
- [Rayan Morais](https://github.com/rayancmorais)

---

### 🙏 **Agradecimentos**  
Obrigado por dedicar seu tempo para ler e testar este projeto! Seu interesse e feedback são muito importantes para nós.  
Fique à vontade para abrir issues, sugestões ou colaborar!

---


