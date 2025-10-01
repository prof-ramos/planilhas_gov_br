'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TipoAutorizacaoChartProps {
  data: Array<{
    tipo_autorizacao: string
    quantidade: number
    total_vagas: number
  }>
}

const COLORS = ['#1351B4', '#168821', '#FFCD07', '#D32F2F', '#00C851', '#FFB800']

export function TipoAutorizacaoChart({ data }: TipoAutorizacaoChartProps) {
  // Descrição textual para acessibilidade
  const totalVagas = data.reduce((sum, item) => sum + item.total_vagas, 0)
  const distribuicao = data.map(item => {
    const percent = ((item.total_vagas / totalVagas) * 100).toFixed(1)
    return `${item.tipo_autorizacao}: ${item.total_vagas.toLocaleString('pt-BR')} vagas (${percent}%)`
  }).join('. ')

  const descricao = `Gráfico de pizza mostrando distribuição de ${totalVagas.toLocaleString('pt-BR')} vagas por tipo de autorização. ${distribuicao}`

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Distribuição por Tipo de Autorização</CardTitle>
        <CardDescription>
          Proporção de vagas por tipo de autorização
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="sr-only" role="img" aria-label={descricao}>
          {descricao}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ tipo_autorizacao, percent }) =>
                `${tipo_autorizacao}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="total_vagas"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-white p-3 shadow-sm">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-gray-500">
                            Tipo
                          </span>
                          <span className="font-bold text-gray-900">
                            {data.tipo_autorizacao}
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
                              Registros
                            </span>
                            <span className="font-bold text-gray-900">
                              {data.quantidade.toLocaleString('pt-BR')}
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
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
