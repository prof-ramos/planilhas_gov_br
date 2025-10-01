export type Database = {
  public: {
    Tables: {
      autorizacoes_uniao: {
        Row: {
          id?: number
          orgao_entidade: string | null
          vinculo_orgao_entidade: string | null
          setor: string | null
          cargos: string | null
          escolaridade: string | null
          vagas: number | null
          ato_oficial: string | null
          tipo_autorizacao: string | null
          data_provimento: string | null
          dou_link: string | null
          dou_publicacao_ano: number | null
          dou_concurso_portaria: string | null
          dou_concurso_link: string | null
          link_publicacao_dou: string | null
          area_atuacao_governamental: string | null
          observacoes: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          orgao_entidade?: string | null
          vinculo_orgao_entidade?: string | null
          setor?: string | null
          cargos?: string | null
          escolaridade?: string | null
          vagas?: number | null
          ato_oficial?: string | null
          tipo_autorizacao?: string | null
          data_provimento?: string | null
          dou_link?: string | null
          dou_publicacao_ano?: number | null
          dou_concurso_portaria?: string | null
          dou_concurso_link?: string | null
          link_publicacao_dou?: string | null
          area_atuacao_governamental?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          orgao_entidade?: string | null
          vinculo_orgao_entidade?: string | null
          setor?: string | null
          cargos?: string | null
          escolaridade?: string | null
          vagas?: number | null
          ato_oficial?: string | null
          tipo_autorizacao?: string | null
          data_provimento?: string | null
          dou_link?: string | null
          dou_publicacao_ano?: number | null
          dou_concurso_portaria?: string | null
          dou_concurso_link?: string | null
          link_publicacao_dou?: string | null
          area_atuacao_governamental?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
