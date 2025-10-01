# Dashboard de Concursos Públicos

Dashboard analítico para visualização e análise de dados históricos de concursos públicos federais brasileiros (2001-2025).

## 🎯 Visão Geral

Este dashboard fornece análises detalhadas de 25 anos de dados oficiais do Diário Oficial da União (DOU) sobre autorizações e provimentos de vagas no serviço público federal, incluindo:

- **KPIs principais**: Total de vagas, vagas por ano, órgãos contratantes
- **Análise temporal**: Evolução de vagas ao longo de 25 anos
- **Análise organizacional**: Top órgãos por número de vagas
- **Distribuição por tipo**: Concursos públicos, provimentos originários, adicionais e excepcionais
- **Data Explorer**: Tabela interativa com paginação e filtros

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui + Radix UI
- **Gráficos**: Recharts
- **Tabelas**: TanStack Table (React Table v8)
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: Vercel (recomendado)

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn
- Projeto Supabase configurado com a tabela `autorizacoes_uniao`

## 🚀 Setup do Projeto

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

**Onde encontrar essas credenciais:**
1. Acesse [app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em Settings → API
4. Copie a `Project URL` e a `anon/public` key

### 3. Verificar Banco de Dados

Certifique-se de que a tabela `autorizacoes_uniao` está criada e populada no Supabase. Se ainda não estiver, execute os scripts do backend:

```bash
# No diretório raiz do projeto (planilhas_gov_br/)
cd ..
python scripts/process_spreadsheets.py
python scripts/apply_migration.py
python scripts/upload_to_supabase_normalized.py
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver o dashboard.

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🚢 Deploy

### Deploy no Vercel (Recomendado)

1. **Conecte seu repositório ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe o repositório do GitHub

2. **Configure as variáveis de ambiente:**
   - Adicione `NEXT_PUBLIC_SUPABASE_URL`
   - Adicione `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy:**
   - O Vercel detectará automaticamente Next.js
   - Clique em "Deploy"

### Deploy Manual

```bash
npm run build
```

O build estará em `.next/`. Você pode hospedar em qualquer serviço que suporte Next.js.

## 📁 Estrutura do Projeto

```
dashboard/
├── app/                          # App Router do Next.js
│   ├── page.tsx                 # Página principal (Overview)
│   ├── explorer/
│   │   └── page.tsx             # Data Explorer
│   ├── layout.tsx               # Layout raiz
│   └── globals.css              # Estilos globais
├── components/
│   ├── charts/                  # Componentes de gráficos
│   │   ├── timeline-chart.tsx
│   │   ├── top-orgaos-chart.tsx
│   │   └── tipo-autorizacao-chart.tsx
│   ├── dashboard/
│   │   └── kpi-card.tsx         # Card de KPI
│   ├── layout/
│   │   └── navbar.tsx           # Barra de navegação
│   ├── tables/
│   │   └── data-table.tsx       # Tabela de dados genérica
│   └── ui/                      # Componentes UI (shadcn)
│       ├── card.tsx
│       └── badge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Cliente Supabase
│   │   ├── queries.ts           # Queries para KPIs e gráficos
│   │   └── data-queries.ts      # Queries para tabelas
│   └── utils.ts                 # Utilitários (cn, etc.)
└── types/
    └── database.ts              # Tipos TypeScript do banco
```

## 🔍 Funcionalidades

### Dashboard Overview (/)
- 4 KPIs principais (Total de vagas, vagas 2025, órgãos, autorizações)
- Gráfico de linha: Evolução de vagas por ano
- Gráfico de barras: Top 10 órgãos por vagas
- Gráfico de pizza: Distribuição por tipo de autorização

### Data Explorer (/explorer)
- Tabela interativa com paginação (50 registros por página)
- Colunas: Ano, Órgão, Cargo, Escolaridade, Vagas, Tipo, Ato Oficial
- 500 registros carregados (configurável)

## 🔧 Customização

### Alterar Número de Registros no Explorer

Edite `app/explorer/page.tsx`:

```typescript
const data = await getAllAutorizacoes(1000) // Altere de 500 para 1000
```

### Adicionar Novos KPIs

1. Crie a query em `lib/supabase/queries.ts`
2. Adicione o KPICard em `app/page.tsx`

### Cores do Dashboard

As cores seguem a paleta do Governo Federal:
- Primary: `#1351B4` (Azul)
- Secondary: `#168821` (Verde)
- Accent: `#FFCD07` (Amarelo)

Edite em `components/charts/` para customizar.

## 📊 Dados

Os dados são carregados do Supabase a partir da tabela `autorizacoes_uniao`, que contém:

- **25 anos de histórico** (2001-2025)
- **3.691+ registros** de autorizações
- **16 colunas** normalizadas (órgão, cargo, vagas, tipo, etc.)
- **Índices otimizados** para queries rápidas

## 🐛 Troubleshooting

### Erro: "Failed to fetch data"
- Verifique se as variáveis de ambiente estão corretas
- Confirme que a tabela `autorizacoes_uniao` existe no Supabase
- Verifique se as RLS policies permitem leitura pública

### Gráficos não aparecem
- Verifique se há dados no banco (query pode retornar vazio)
- Abra o console do navegador para ver erros

### Build falha
- Execute `npm install` novamente
- Verifique se todas as importações estão corretas
- Certifique-se de que `.env.local` existe

## 📝 Próximos Passos (Roadmap)

Conforme o [DASHBOARD_PLAN.md](../DASHBOARD_PLAN.md):

- [ ] Fase 2: Páginas de análise temporal, órgãos e cargos
- [ ] Fase 3: Filtros avançados, export de dados, comparações
- [ ] Fase 4: Otimização de performance, testes, SEO

## 📄 Licença

Este projeto utiliza dados públicos do Diário Oficial da União (DOU).

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou pull request no repositório.

---

**Desenvolvido com Next.js 15 + Supabase**
**Dados**: Diário Oficial da União (DOU) | 2001-2025
