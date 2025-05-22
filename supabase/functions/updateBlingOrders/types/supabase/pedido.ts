export interface ResponsePedidoSupabase extends ResquestPedidoSupabase {
  id: string;
}

export interface ResquestPedidoSupabase {
  id_bling: number;
  numero: number;
  id_situacao_bling: number;
  id_cliente_bling: number;
  cliente: string;
  id_vendedor_bling: number;
  id_loja_bling: number;
  data: string;
  data_prevista: string | null;
  desconto: number;
  valor_total: number;
  valor_pago: number;
  observacao: string;
  observacoes_internas: string;
  id_situacao?: string | null;
  id_vendedor?: string | null;
  id_loja?: string | null;
  id_cliente?: string | null;
  updated_at?: string;
}
