export interface ResponseItemSupabase extends ResquestItemSupabase {
  id: string;
}

export interface ResquestItemSupabase {
  id_pedido_bling: number;
  id_produto_bling: number;
  desconto_item: number;
  valor_unidade: number;
  quantidade: number;
  id_pedido: string;
  id_produto: string | null;
  numero_pedido?: number;
}