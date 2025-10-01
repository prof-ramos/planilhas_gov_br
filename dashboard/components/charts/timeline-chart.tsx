'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TimelineChartProps {
  data: Array<{
    ano: number
    total_vagas: number
    total_registros: number
  }>
}

export function TimelineChart({ data }: TimelineChartProps) {
  // Calcular estatísticas para descrição textual
  const totalVagas = data.reduce((sum, item) => sum + item.total_vagas, 0)
  const anoMaior = data.reduce((max, item) =>
    item.total_vagas > max.total_vagas ? item : max, data[0])
  const anoMenor = data.reduce((min, item) =>
    item.total_vagas < min.total_vagas ? item : min, data[0])

  const descricaoGrafico = `Gráfico de linha mostrando evolução de ${totalVagas.toLocaleString('pt-BR')} vagas entre ${data[0]?.ano || 2001} e ${data[data.length - 1]?.ano || 2025}. Maior volume em ${anoMaior?.ano} com ${anoMaior?.total_vagas.toLocaleString('pt-BR')} vagas. Menor volume em ${anoMenor?.ano} com ${anoMenor?.total_vagas.toLocaleString('pt-BR')} vagas.`

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Evolução de Vagas por Ano</CardTitle>
        <CardDescription>
          Histórico de autorizações de concursos públicos federais (2001-2025)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Descrição textual para screen readers */}
        <div className="sr-only" role="img" aria-label={descricaoGrafico}>
          {descricaoGrafico}
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} aria-hidden="true">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="ano"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toLocaleString('pt-BR')}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-gray-500">
                            Ano
                          </span>
                          <span className="font-bold text-gray-900">
                            {payload[0].payload.ano}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-gray-500">
                            Vagas
                          </span>
                          <span className="font-bold text-gray-900">
                            {payload[0].value?.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total_vagas"
              name="Total de Vagas"
              stroke="#1351B4"
              strokeWidth={2}
              dot={{ fill: '#1351B4', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
