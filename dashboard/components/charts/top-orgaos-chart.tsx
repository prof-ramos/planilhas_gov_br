'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TopOrgaosChartProps {
  data: Array<{
    orgao_entidade: string
    total_vagas: number
    total_autorizacoes: number
  }>
}

export function TopOrgaosChart({ data }: TopOrgaosChartProps) {
  // Truncate long organization names
  const processedData = data.map(item => ({
    ...item,
    orgao_short: item.orgao_entidade.length > 30
      ? item.orgao_entidade.substring(0, 30) + '...'
      : item.orgao_entidade
  }))

  // Descrição textual para acessibilidade
  const totalVagas = data.reduce((sum, item) => sum + item.total_vagas, 0)
  const listaOrgaos = data.slice(0, 3).map((org, i) =>
    `${i + 1}º: ${org.orgao_entidade} com ${org.total_vagas.toLocaleString('pt-BR')} vagas`
  ).join('. ')

  const descricao = `Gráfico de barras horizontais mostrando os 10 órgãos com mais vagas. Total de ${totalVagas.toLocaleString('pt-BR')} vagas. Top 3: ${listaOrgaos}`

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Top 10 Órgãos por Vagas</CardTitle>
        <CardDescription>
          Organizações com maior número de vagas autorizadas (histórico completo)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="sr-only" role="img" aria-label={descricao}>
          {descricao}
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={processedData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toLocaleString('pt-BR')}`}
            />
            <YAxis
              type="category"
              dataKey="orgao_short"
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={200}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-white p-3 shadow-sm">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-gray-500">
                            Órgão
                          </span>
                          <span className="font-bold text-gray-900">
                            {data.orgao_entidade}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-gray-500">
                              Vagas
                            </span>
                            <span className="font-bold text-gray-900">
                              {data.total_vagas.toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-gray-500">
                              Autorizações
                            </span>
                            <span className="font-bold text-gray-900">
                              {data.total_autorizacoes.toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="total_vagas" fill="#1351B4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
