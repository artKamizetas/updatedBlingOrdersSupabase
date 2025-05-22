export interface ResponseClientSupabase extends RequestClientSupabase {
  id: string;
  created_at: Date;
}

export interface RequestClientSupabase {
  id_bling: number;
  nome: string;
  situacao: string;
  documento: number;
  telefone: number;
  celular: number;
  updated_at: Date;
}
