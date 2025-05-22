export interface ResponseProdutoSupabase {
  id: string;
  id_bling: number;
  id_produto_pai: number
  descricao:string
  codigo:string
  preco_custo: number
  preco_venda: number
  estoque: number
  situcao: string
  imagem: string
}