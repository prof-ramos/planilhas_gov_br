import { Suspense } from 'react'
import { getAllAutorizacoes, getAvailableYears } from '@/lib/supabase/data-queries'
import { ExplorerTable } from '@/components/tables/explorer-table'

async function ExplorerContent() {
  const [data, availableYears] = await Promise.all([
    getAllAutorizacoes(500),
    getAvailableYears()
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Todos os Registros</h3>
          <p className="text-sm text-gray-600">
            Visualize e explore todos os dados de autorizações de concursos públicos
          </p>
        </div>
      </div>
      <ExplorerTable data={data} availableYears={availableYears} />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-96 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}

export default function ExplorerPage() {
  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <header className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Data Explorer</h1>
      </header>
      <Suspense fallback={<LoadingSkeleton />}>
        <ExplorerContent />
      </Suspense>
    </main>
  )
}
