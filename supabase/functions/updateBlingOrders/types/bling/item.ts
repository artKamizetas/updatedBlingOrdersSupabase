export interface ItemBlingApiPedidoById {
  id: number;
  codigo: string;
  unidade: string;
  quantidade: number;
  desconto: number;
  valor: number;
  aliquotaIPI: number;
  descricao: string;
  descricaoDetalhada: string;
  produto: {
    id: number;
  };
  comissao: {
    base: number;
    aliquota: number;
    valor: number;
  };
}
