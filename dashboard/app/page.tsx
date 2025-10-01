import { Suspense } from 'react'
import { Building2, Users, FileText, TrendingUp } from 'lucide-react'
import { KPICard } from '@/components/dashboard/kpi-card'
import { TimelineChart } from '@/components/charts/timeline-chart'
import { TopOrgaosChart } from '@/components/charts/top-orgaos-chart'
import { TipoAutorizacaoChart } from '@/components/charts/tipo-autorizacao-chart'
import { getKPIStats, getVagasPorAno, getTopOrgaos, getDistribuicaoTipo } from '@/lib/supabase/queries'

async function DashboardContent() {
  const [kpiStats, vagasPorAno, topOrgaos, distribuicaoTipo] = await Promise.all([
    getKPIStats(),
    getVagasPorAno(),
    getTopOrgaos(10),
    getDistribuicaoTipo()
  ])

  return (
    <>
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total de Vagas (2001-2025)"
          value={kpiStats.totalVagas}
          description="Vagas autorizadas em 25 anos"
          icon={Users}
        />
        <KPICard
          title="Vagas em 2025"
          value={kpiStats.vagasAnoAtual}
          description="Autorizações do ano atual"
          icon={TrendingUp}
        />
        <KPICard
          title="Órgãos Contratantes"
          value={kpiStats.totalOrgaos}
          description="Entidades da União"
          icon={Building2}
        />
        <KPICard
          title="Total de Autorizações"
          value={kpiStats.totalRegistros}
          description="Atos oficiais registrados"
          icon={FileText}
        />
      </div>

      {/* Timeline Chart */}
      <div className="grid gap-4 md:grid-cols-7">
        <TimelineChart data={vagasPorAno} />
        <TipoAutorizacaoChart data={distribuicaoTipo} />
      </div>

      {/* Top Organizations Chart */}
      <div className="grid gap-4">
        <TopOrgaosChart data={topOrgaos} />
      </div>
    </>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4 h-96 bg-gray-200 rounded-lg animate-pulse" />
        <div className="col-span-3 h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <header className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard de Concursos Públicos</h1>
      </header>
      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardContent />
      </Suspense>
    </main>
  )
}
