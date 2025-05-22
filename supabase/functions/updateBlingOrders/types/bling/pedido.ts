import { ClienteBligApiPedidoById } from "./client.ts";
import { ItemBlingApiPedidoById } from "./item.ts";

export interface ResponseApiBlingPedidosAlterados {
  data: [
    PedidoBlingApiPedidosAlterados,
  ];
}
interface PedidoBlingApiPedidosAlterados {
  id: number;
  numero: number;
  numeroLoja: string;
  data: string;
  dataSaida: string;
  dataPrevista: string;
  totalProdutos: number;
  total: number;
  contato: {
    id: number;
    nome: string;
    tipoPessoa: string;
    numeroDocumento: string;
  };
  situacao: {
    id: number;
    valor: number;
  };
  loja: {
    id: number;
  };
}

export interface ResponseApiBlingPedidoById {
  data: PedidoBlingApiPedidoById;
}

export interface PedidoBlingApiPedidoById {
  id: number;
  numero: number;
  numeroLoja: string;
  data: string;
  dataSaida: string;
  dataPrevista: string;
  totalProdutos: number;
  total: number;
  contato:ClienteBligApiPedidoById;
  situacao: {
    id: number;
    valor: number;
  };
  loja: {
    id: number;
  };
  numeroPedidoCompra: string;
  outrasDespesas: number;
  observacoes: string;
  observacoesInternas: string;
  desconto: {
    valor: number;
    unidade: string;
  };
  categoria: {
    id: number;
  };
  notaFiscal: {
    id: number;
  };
  tributacao: {
    totalICMS: number;
    totalIPI: number;
  };
  itens: ItemBlingApiPedidoById[];
  parcelas: [
    {
      id: number;
      dataVencimento: string;
      valor: number;
      observacoes: string;
      formaPagamento: {
        id: number;
      };
    },
  ];
  transporte: {
    fretePorConta: number;
    frete: number;
    quantidadeVolumes: number;
    pesoBruto: number;
    prazoEntrega: number;
    contato: {
      id: number;
      nome: string;
    };
    etiqueta: {
      nome: string;
      endereco: string;
      numero: string;
      complemento: string;
      municipio: string;
      uf: string;
      cep: string;
      bairro: string;
      nomePais: string;
    };
    volumes: [
      {
        id: number;
        servico: string;
        codigoRastreamento: string;
      },
    ];
  };
  vendedor: {
    id: number;
  };
  intermediador: {
    cnpj: string;
    nomeUsuario: string;
  };
  taxas: {
    taxaComissao: number;
    custoFrete: number;
    valorBase: number;
  };
}
