# Planejamento do Dashboard de Concursos Públicos

## Visão Geral

Dashboard analítico para visualização e exploração de dados de concursos públicos brasileiros (2001-2025), permitindo análises temporais, organizacionais e setoriais das autorizações e provimentos de vagas no serviço público federal.

## Objetivos do Dashboard

### Objetivo Principal
Fornecer visibilidade completa sobre o histórico de concursos públicos federais, permitindo análises de tendências, identificação de oportunidades e compreensão dos padrões de contratação governamental.

### Objetivos Específicos
1. **Transparência**: Facilitar acesso público aos dados oficiais de concursos
2. **Análise Temporal**: Mostrar evolução de vagas e autorizações ao longo de 25 anos
3. **Insights Organizacionais**: Identificar órgãos com maior demanda de pessoal
4. **Planejamento de Carreira**: Ajudar candidatos a identificar oportunidades por cargo e escolaridade
5. **Pesquisa Acadêmica**: Suportar estudos sobre gestão pública e políticas de RH

## Público-Alvo

1. **Candidatos a Concursos**: Buscam informações sobre vagas históricas e tendências
2. **Gestores Públicos**: Analisam padrões de contratação e planejamento de RH
3. **Pesquisadores**: Estudam políticas públicas de gestão de pessoas
4. **Jornalistas**: Investigam tendências no serviço público
5. **Cidadãos**: Interessados em transparência governamental

## Arquitetura Técnica

### Stack Tecnológica Proposta

**Frontend**
- **Framework**: Next.js 14+ (App Router) com TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **Gráficos**: Recharts ou Chart.js
- **Tabelas**: TanStack Table (React Table v8)
- **Estado**: Zustand ou React Context
- **Queries**: TanStack Query (React Query)

**Backend**
- **Database**: PostgreSQL via Supabase (já implementado)
- **API**: Supabase REST API + RLS policies
- **Cache**: React Query cache + Supabase edge caching

**Infraestrutura**
- **Hospedagem Frontend**: Vercel
- **Hospedagem Backend**: Supabase
- **CI/CD**: GitHub Actions
- **Monitoramento**: Vercel Analytics + Sentry (opcional)

### Estrutura do Projeto

```
planilhas_gov_br_dashboard/
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx                 # Home/Overview
│   │   ├── timeline/
│   │   │   └── page.tsx            # Análise temporal
│   │   ├── organizations/
│   │   │   ├── page.tsx            # Lista de órgãos
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Detalhes do órgão
│   │   ├── positions/
│   │   │   ├── page.tsx            # Lista de cargos
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Detalhes do cargo
│   │   ├── authorizations/
│   │   │   └── page.tsx            # Análise de autorizações
│   │   └── search/
│   │       └── page.tsx            # Busca avançada
│   ├── api/
│   │   └── stats/
│   │       └── route.ts            # Cache de estatísticas
│   └── layout.tsx
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── charts/
│   │   ├── TimelineChart.tsx
│   │   ├── DistributionChart.tsx
│   │   └── TrendChart.tsx
│   ├── tables/
│   │   └── DataTable.tsx
│   └── filters/
│       └── FilterPanel.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── types.ts
│   └── utils/
│       ├── data-formatting.ts
│       └── calculations.ts
└── types/
    └── database.ts
```

## Funcionalidades Principais

### 1. Dashboard Overview (Home)

**KPIs no Topo**
- Total de vagas autorizadas (2001-2025)
- Vagas autorizadas no ano atual
- Número de órgãos contratantes
- Distribuição por nível de escolaridade

**Visualizações**
- Gráfico de linha: Evolução de vagas por ano
- Gráfico de barras: Top 10 órgãos por vagas
- Gráfico de pizza: Distribuição por tipo de autorização
- Gráfico de área: Tendência de escolaridade ao longo do tempo

**Filtros Globais**
- Range de anos
- Órgão/Entidade
- Tipo de autorização
- Nível de escolaridade

### 2. Análise Temporal (Timeline)

**Visualizações**
- Linha do tempo interativa (2001-2025)
- Heatmap de vagas por mês/ano
- Comparação ano a ano (YoY)
- Identificação de períodos de alta/baixa

**Insights Automáticos**
- "Ano com maior número de vagas: 2014 (X vagas)"
- "Crescimento médio anual: Y%"
- "Períodos de redução: 2015-2017"

**Funcionalidades**
- Zoom temporal
- Comparação entre períodos
- Download de dados filtrados

### 3. Análise Organizacional

**Visão Geral**
- Lista paginada de órgãos
- Ordenação por vagas, autorizações, período
- Busca por nome de órgão

**Detalhes do Órgão**
- Histórico de vagas do órgão
- Cargos mais frequentes
- Distribuição de escolaridade
- Timeline de autorizações
- Vínculos organizacionais (hierarquia)

**Comparação**
- Comparar até 5 órgãos simultaneamente
- Métricas: vagas totais, média anual, tipos de autorização

### 4. Análise de Cargos

**Visão Geral**
- Grid/tabela de cargos
- Agrupamento por área de atuação
- Filtro por escolaridade

**Detalhes do Cargo**
- Total de vagas históricas
- Órgãos que mais contrataram
- Evolução temporal
- Escolaridade requerida
- Atos oficiais relacionados

**Insights para Candidatos**
- "Cargo com mais vagas em 2024"
- "Órgãos que historicamente contratam este cargo"
- "Média de vagas/ano"

### 5. Análise de Autorizações

**Tipos de Autorização**
- Concurso Público
- Provimento Originário
- Provimento Adicional
- Provimento Excepcional
- Contratação Temporária

**Visualizações**
- Funil de conversão (Autorização → Provimento)
- Taxa de provimentos adicionais/excepcionais
- Tempo médio entre autorização e provimento

**Análise de Padrões**
- Órgãos com mais provimentos excepcionais
- Cargos com maior taxa de provimento adicional
- Tendências de contratação temporária

### 6. Busca Avançada e Filtros

**Campos de Busca**
- Texto livre (busca em órgão, cargo, ato oficial)
- Filtros combinados:
  - Período (data início/fim)
  - Órgão/Entidade
  - Cargo
  - Escolaridade
  - Tipo de autorização
  - Range de vagas (min-max)
  - Área de atuação governamental

**Resultados**
- Tabela paginada com ordenação
- Export para CSV/JSON
- Salvar buscas favoritas (futuro)

### 7. Exploração de Dados (Data Explorer)

**Tabela Interativa**
- Todas as colunas disponíveis
- Ordenação multi-coluna
- Filtros por coluna
- Paginação server-side
- Seleção de colunas visíveis

**Features Avançadas**
- Pivô de dados (crosstab)
- Agregações customizadas
- Export completo

## Páginas e Rotas

| Rota | Título | Descrição |
|------|--------|-----------|
| `/` | Overview | Dashboard principal com KPIs e visão geral |
| `/timeline` | Análise Temporal | Evolução histórica de vagas |
| `/organizations` | Órgãos | Lista e busca de órgãos |
| `/organizations/[slug]` | Detalhes do Órgão | Perfil completo do órgão |
| `/positions` | Cargos | Lista e busca de cargos |
| `/positions/[slug]` | Detalhes do Cargo | Perfil completo do cargo |
| `/authorizations` | Autorizações | Análise de tipos de autorização |
| `/search` | Busca Avançada | Interface de busca complexa |
| `/explorer` | Data Explorer | Tabela completa com filtros |
| `/about` | Sobre | Informações sobre o projeto e dados |
| `/api-docs` | API Docs | Documentação da API (futuro) |

## Queries SQL Otimizadas

### Query 1: KPIs Overview
```sql
-- Total de vagas por ano
SELECT
  dou_publicacao_ano as ano,
  COUNT(*) as total_registros,
  SUM(vagas) as total_vagas,
  COUNT(DISTINCT orgao_entidade) as total_orgaos
FROM autorizacoes_uniao
WHERE dou_publicacao_ano IS NOT NULL
GROUP BY dou_publicacao_ano
ORDER BY ano DESC;
```

### Query 2: Top Órgãos
```sql
-- Top 10 órgãos por vagas
SELECT
  orgao_entidade,
  SUM(vagas) as total_vagas,
  COUNT(*) as total_autorizacoes,
  COUNT(DISTINCT cargos) as total_cargos
FROM autorizacoes_uniao
WHERE vagas IS NOT NULL
GROUP BY orgao_entidade
ORDER BY total_vagas DESC
LIMIT 10;
```

### Query 3: Distribuição por Tipo
```sql
-- Distribuição por tipo de autorização
SELECT
  tipo_autorizacao,
  COUNT(*) as quantidade,
  SUM(vagas) as total_vagas,
  ROUND(AVG(vagas), 2) as media_vagas
FROM autorizacoes_uniao
WHERE tipo_autorizacao IS NOT NULL
GROUP BY tipo_autorizacao
ORDER BY total_vagas DESC;
```

### Query 4: Tendências Temporais
```sql
-- Evolução mensal (quando disponível)
SELECT
  DATE_TRUNC('year', TO_DATE(data_provimento, 'DD/MM/YYYY')) as periodo,
  tipo_autorizacao,
  SUM(vagas) as vagas
FROM autorizacoes_uniao
WHERE data_provimento IS NOT NULL
  AND data_provimento ~ '^\d{2}/\d{2}/\d{4}$'
GROUP BY periodo, tipo_autorizacao
ORDER BY periodo, tipo_autorizacao;
```

### Query 5: Análise de Cargos
```sql
-- Cargos mais demandados
SELECT
  cargos,
  escolaridade,
  COUNT(*) as frequencia,
  SUM(vagas) as total_vagas,
  COUNT(DISTINCT orgao_entidade) as orgaos_contratantes
FROM autorizacoes_uniao
WHERE cargos IS NOT NULL
GROUP BY cargos, escolaridade
ORDER BY total_vagas DESC
LIMIT 50;
```

## Performance e Otimização

### Estratégias de Cache
1. **React Query**: Cache de 5 minutos para dados agregados
2. **Supabase Edge**: Cache de queries frequentes
3. **Static Generation**: Páginas estáticas para dados históricos
4. **Incremental Static Regeneration**: Revalidação diária

### Paginação
- **Server-side**: Queries com LIMIT/OFFSET
- **Client-side**: TanStack Table virtual scrolling para grandes datasets
- **Batch Size**: 50-100 registros por página

### Índices Criados (já implementados)
```sql
- idx_autorizacoes_uniao_orgao (orgao_entidade)
- idx_autorizacoes_uniao_cargo (cargos)
- idx_autorizacoes_uniao_tipo_autorizacao (tipo_autorizacao)
- idx_autorizacoes_uniao_ano (dou_publicacao_ano)
```

### Índices Adicionais Recomendados
```sql
-- Índice composto para filtros combinados
CREATE INDEX idx_autorizacoes_uniao_filters
ON autorizacoes_uniao(dou_publicacao_ano, tipo_autorizacao, escolaridade);

-- Índice para busca full-text (futuro)
CREATE INDEX idx_autorizacoes_uniao_search
ON autorizacoes_uniao USING GIN(to_tsvector('portuguese',
  COALESCE(orgao_entidade, '') || ' ' ||
  COALESCE(cargos, '') || ' ' ||
  COALESCE(ato_oficial, '')
));
```

## Design e UX

### Princípios de Design
1. **Clareza**: Visualizações simples e diretas
2. **Acessibilidade**: WCAG 2.1 AA compliance
3. **Responsividade**: Mobile-first design
4. **Performance**: Lazy loading, code splitting
5. **Consistência**: Design system com shadcn/ui

### Paleta de Cores (Sugestão)
- **Primary**: Azul governamental (#1351B4)
- **Secondary**: Verde (#168821)
- **Accent**: Amarelo (#FFCD07)
- **Neutral**: Cinzas (#333, #666, #999, #F5F5F5)
- **Success**: Verde (#00C851)
- **Warning**: Amarelo (#FFB800)
- **Error**: Vermelho (#D32F2F)

### Tipografia
- **Heading**: Rawline (fonte do Governo Federal) ou Inter
- **Body**: Inter ou System Font Stack

## Roadmap de Desenvolvimento

### Fase 1: MVP (4-6 semanas)
- [ ] Setup do projeto Next.js + Supabase
- [ ] Implementar queries básicas e conexão com DB
- [ ] Criar página Overview com KPIs principais
- [ ] Implementar gráfico de timeline
- [ ] Criar tabela de dados básica com paginação
- [ ] Deploy inicial (Vercel + Supabase)

### Fase 2: Features Core (4-6 semanas)
- [ ] Página de análise temporal completa
- [ ] Páginas de órgãos (lista + detalhes)
- [ ] Páginas de cargos (lista + detalhes)
- [ ] Sistema de filtros avançados
- [ ] Implementar todos os gráficos principais
- [ ] Export de dados (CSV/JSON)

### Fase 3: Features Avançadas (4-6 semanas)
- [ ] Análise de autorizações detalhada
- [ ] Data Explorer com pivô
- [ ] Comparação entre órgãos
- [ ] Busca full-text
- [ ] Salvar filtros/buscas
- [ ] Sistema de notificações (novos concursos)

### Fase 4: Polimento e Otimização (2-4 semanas)
- [ ] Otimização de performance
- [ ] Testes A/B de UX
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] SEO optimization
- [ ] Analytics e monitoramento
- [ ] Documentação completa

## Métricas de Sucesso

### Métricas Técnicas
- **Performance**: Lighthouse score > 90
- **Disponibilidade**: Uptime > 99.5%
- **TTFB**: < 200ms
- **FCP**: < 1.5s
- **LCP**: < 2.5s

### Métricas de Produto
- **Usuários ativos mensais**: Meta 10.000 em 6 meses
- **Tempo médio de sessão**: > 5 minutos
- **Taxa de rejeição**: < 40%
- **Queries por sessão**: > 3
- **Downloads de dados**: > 500/mês

### Métricas de Engajamento
- **Páginas mais visitadas**
- **Filtros mais usados**
- **Cargos mais pesquisados**
- **Órgãos mais visualizados**

## Considerações de Segurança

### Supabase RLS Policies
```sql
-- Política: Leitura pública de dados (dados são públicos do DOU)
CREATE POLICY "Enable read access for all users"
ON autorizacoes_uniao FOR SELECT
USING (true);

-- Política: Apenas service role pode inserir/atualizar (backend ETL)
CREATE POLICY "Enable insert for service role only"
ON autorizacoes_uniao FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Enable update for service role only"
ON autorizacoes_uniao FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for service role only"
ON autorizacoes_uniao FOR DELETE
TO service_role
USING (true);
```

### API Rate Limiting
- Implementar rate limiting no nível do Supabase
- 100 requests/minuto por IP
- 1000 requests/hora por IP

### Data Privacy
- Dados são públicos (fonte: DOU)
- Não coletar PII dos usuários
- Cookies apenas para analytics (opt-in)

## Documentação

### Para Desenvolvedores
- README.md completo
- Contributing guidelines
- Arquitetura técnica
- Setup de desenvolvimento
- Convenções de código

### Para Usuários
- Página "Sobre o Projeto"
- FAQ sobre os dados
- Glossário de termos (DOU, provimento, etc.)
- Tutorial de uso do dashboard

## Custos Estimados

### Infraestrutura (Mensal)
- **Supabase**: $0 (Free tier) → $25 (Pro) quando escalar
- **Vercel**: $0 (Hobby) → $20 (Pro) se necessário
- **Total**: $0-45/mês

### Desenvolvimento
- Desenvolvimento interno ou open-source
- Opcional: Contratar designer UX ($500-1000)

## Próximos Passos Imediatos

1. **Validar proposta** com stakeholders
2. **Setup do repositório** do frontend
3. **Criar wireframes** das principais páginas
4. **Definir schema de queries** Supabase
5. **Iniciar Fase 1 MVP**

---

**Última atualização**: 2025-10-01
**Status**: Planejamento aprovado, aguardando início do desenvolvimento
