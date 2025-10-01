'use client'

import { useState, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/tables/data-table'
import { AutorizacaoRow } from '@/lib/supabase/data-queries'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, FileText, Building2, TrendingUp } from 'lucide-react'

const columns: ColumnDef<AutorizacaoRow>[] = [
  {
    accessorKey: 'dou_publicacao_ano',
    header: () => <div className="font-semibold">Ano de Publicação</div>,
    cell: ({ row }) => {
      const ano = row.getValue('dou_publicacao_ano') as number | null
      return ano ? (
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-gray-400" aria-hidden="true" />
          <span className="font-medium text-gray-900">{ano}</span>
        </div>
      ) : <span className="text-gray-400">-</span>
    },
  },
  {
    accessorKey: 'orgao_entidade',
    header: () => <div className="font-semibold">Órgão/Entidade</div>,
    cell: ({ row }) => {
      const orgao = row.getValue('orgao_entidade') as string | null
      return orgao ? (
        <div className="flex items-start gap-2">
          <Building2 className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span className="max-w-[280px] truncate text-gray-900" title={orgao}>
            {orgao}
          </span>
        </div>
      ) : <span className="text-gray-400">-</span>
    },
  },
  {
    accessorKey: 'cargos',
    header: () => <div className="font-semibold">Cargo</div>,
    cell: ({ row }) => {
      const cargo = row.getValue('cargos') as string | null
      return cargo ? (
        <span className="max-w-[200px] truncate text-gray-900 font-medium" title={cargo}>
          {cargo}
        </span>
      ) : <span className="text-gray-400">-</span>
    },
  },
  {
    accessorKey: 'escolaridade',
    header: () => <div className="font-semibold">Escolaridade</div>,
    cell: ({ row }) => {
      const escolaridade = row.getValue('escolaridade') as string | null

      const escolaridadeMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
        'Nível Superior': { label: 'Superior', variant: 'default' },
        'Nível Intermediário': { label: 'Intermediário', variant: 'secondary' },
        'Nível Médio': { label: 'Médio', variant: 'secondary' },
        'Nível Fundamental': { label: 'Fundamental', variant: 'outline' },
      }

      const mapped = escolaridadeMap[escolaridade || ''] || { label: escolaridade || '', variant: 'outline' as const }

      return escolaridade ? (
        <Badge variant={mapped.variant} className="whitespace-nowrap">
          {mapped.label}
        </Badge>
      ) : <span className="text-gray-400">-</span>
    },
  },
  {
    accessorKey: 'vagas',
    header: () => <div className="font-semibold text-right">Vagas</div>,
    cell: ({ row }) => {
      const vagas = row.getValue('vagas') as number | null
      return vagas ? (
        <div className="text-right">
          <span className="inline-flex items-center gap-1 font-bold text-blue-600">
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            {vagas.toLocaleString('pt-BR')}
          </span>
        </div>
      ) : <span className="text-gray-400 text-right block">-</span>
    },
  },
  {
    accessorKey: 'tipo_autorizacao',
    header: () => <div className="font-semibold">Tipo de Autorização</div>,
    cell: ({ row }) => {
      const tipo = row.getValue('tipo_autorizacao') as string | null

      const tipoMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
        'Concurso Público': { label: 'Concurso Público', variant: 'default' },
        'Provimento Originário': { label: 'Prov. Originário', variant: 'secondary' },
        'Provimento Adicional': { label: 'Prov. Adicional', variant: 'outline' },
        'Provimento Excepcional': { label: 'Prov. Excepcional', variant: 'destructive' },
        'Contratação Temporária': { label: 'Temporário', variant: 'outline' },
      }

      const mapped = tipoMap[tipo || ''] || { label: tipo || '', variant: 'outline' as const }

      return tipo ? (
        <Badge variant={mapped.variant} className="whitespace-nowrap">
          {mapped.label}
        </Badge>
      ) : <span className="text-gray-400">-</span>
    },
  },
  {
    accessorKey: 'ato_oficial',
    header: () => <div className="font-semibold">Ato Oficial</div>,
    cell: ({ row }) => {
      const ato = row.getValue('ato_oficial') as string | null
      return ato ? (
        <div className="flex items-start gap-2">
          <FileText className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span className="max-w-[180px] truncate text-xs text-gray-600" title={ato}>
            {ato}
          </span>
        </div>
      ) : <span className="text-gray-400">-</span>
    },
  },
]

interface ExplorerTableProps {
  data: AutorizacaoRow[]
  availableYears: { year: number; count: number }[]
}

export function ExplorerTable({ data, availableYears }: ExplorerTableProps) {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')

  // Calcular métricas agregadas
  const metrics = useMemo(() => {
    const filteredData = selectedYear === 'all'
      ? data
      : data.filter(item => item.dou_publicacao_ano === selectedYear)

    const totalVagas = filteredData.reduce((sum, item) => sum + (item.vagas || 0), 0)
    const totalRegistros = filteredData.length

    const orgaosUnicos = new Set(filteredData.map(item => item.orgao_entidade).filter(Boolean))
    const totalOrgaos = orgaosUnicos.size

    const tiposDistribuicao = filteredData.reduce((acc, item) => {
      const tipo = item.tipo_autorizacao || 'Outros'
      acc[tipo] = (acc[tipo] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const tipoMaisComum = Object.entries(tiposDistribuicao).sort((a, b) => b[1] - a[1])[0]

    return {
      totalVagas,
      totalRegistros,
      totalOrgaos,
      tipoMaisComum: tipoMaisComum ? tipoMaisComum[0] : 'N/A',
    }
  }, [data, selectedYear])

  // Filtrar dados por ano selecionado
  const filteredData = useMemo(() => {
    if (selectedYear === 'all') return data
    return data.filter(item => item.dou_publicacao_ano === selectedYear)
  }, [data, selectedYear])

  // Total de registros no banco (de todos os anos)
  const totalRecordsInDatabase = useMemo(() => {
    return availableYears.reduce((sum, y) => sum + y.count, 0)
  }, [availableYears])

  return (
    <div className="space-y-6">
      {/* Filtro por Ano */}
      <div className="flex items-center gap-3 flex-wrap">
        <label htmlFor="year-filter" className="text-sm font-medium text-gray-700">
          Filtrar por ano:
        </label>
        <select
          id="year-filter"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <option value="all">
            Todos os anos ({totalRecordsInDatabase.toLocaleString('pt-BR')} registros no total)
          </option>
          {availableYears.map(({ year, count }) => (
            <option key={year} value={year}>
              {year} ({count.toLocaleString('pt-BR')} registros)
            </option>
          ))}
        </select>
        {selectedYear !== 'all' && filteredData.length === 0 && (
          <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            ⚠️ Nenhum registro deste ano nos primeiros 500 carregados
          </span>
        )}
        {data.length === 500 && (
          <span className="text-xs text-gray-500">
            (Mostrando primeiros 500 registros mais recentes)
          </span>
        )}
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total de Vagas</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.totalVagas.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {selectedYear === 'all' ? 'Todos os anos' : `Ano ${selectedYear}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total de Registros</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.totalRegistros.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Autorizações encontradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Órgãos Únicos</CardTitle>
            <Building2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.totalOrgaos.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Entidades distintas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tipo Mais Comum</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-gray-900 leading-tight mt-1">
              {metrics.tipoMaisComum}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Maior frequência
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <DataTable columns={columns} data={filteredData} />
    </div>
  )
}
