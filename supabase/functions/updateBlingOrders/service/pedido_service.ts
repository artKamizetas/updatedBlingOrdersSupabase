import {
  PedidoBlingApiPedidoById,
  ResponseApiBlingPedidoById,
  ResponseApiBlingPedidosAlterados,
} from "../types/bling/pedido.ts";
import { SupabaseServiceApi } from "./api/supabase_service_api.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import { getFormattedTodayDate } from "../utils/index.ts";
import { TokenSupabase } from "../types/bling/token.ts";
import { ApiBlingRequest } from "./api/bling_service_api.ts";
import { ResponsePedidoSupabase } from "../types/supabase/pedido.ts";
import { VendedorService } from "./vendedor_service.ts";
import { ClientService } from "./client_service.ts";
import { StatusVendasService } from "./status_vendas_service.ts";
import { LojaService } from "./loja_service.ts";
import { ResquestPedidoSupabase } from "../types/supabase/pedido.ts";

class PedidoService {
  private db: SupabaseServiceApi;
  private apiBlingRequest: ApiBlingRequest;
  private vendedorService: VendedorService;
  private clientService: ClientService;
  private statusVendasService: StatusVendasService;
  private lojaService: LojaService;

  constructor(supabase: SupabaseClient, tokens: TokenSupabase) {
    this.db = new SupabaseServiceApi(supabase);
    this.vendedorService = new VendedorService(supabase);
    this.clientService = new ClientService(supabase);
    this.statusVendasService = new StatusVendasService(supabase);
    this.lojaService = new LojaService(supabase);
    this.apiBlingRequest = new ApiBlingRequest(supabase, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      code: tokens.code,
    });
  }

  async obterPedidoById(
    idsPedidosAlterados: number[],
  ): Promise<PedidoBlingApiPedidoById[]> {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const pedidosCompletos: PedidoBlingApiPedidoById[] = [];

    for (const id of idsPedidosAlterados) {
      const pedido: ResponseApiBlingPedidoById = await this.apiBlingRequest
        .apiV3GetPedidoById(id);
      pedidosCompletos.push(pedido.data);
      await delay(550); // espera entre chamadas
    }

    return pedidosCompletos;
  }

  async obterPedidosAlterados() {
    const dateHoje = getFormattedTodayDate();
    const horaAtualFormatada = "23:59";
    const horasAntesFormatada = "00:01";
    //const { horaAtualFormatada, horasAntesFormatada } = formatTimer();

    const responsePedidosAlterados: ResponseApiBlingPedidosAlterados =
      await this.apiBlingRequest
        .apiV3GetPedidosAlteradosHoje(
          dateHoje,
          dateHoje,
          horasAntesFormatada,
          horaAtualFormatada,
        );

    if (!responsePedidosAlterados) {
      throw new Error("Nenhum pedido alterado hoje");
    }
    const pedidosAlterados = responsePedidosAlterados.data;

    console.log(
      "Quantidade de pedidos alterados api pedidos alterados = ",
      pedidosAlterados.length,
    );
    const idsPedidosAlterados = pedidosAlterados.map(
      (pedidoAlterado) => {
        return pedidoAlterado.id;
      },
    );
    return idsPedidosAlterados;
  }

  async update(pedido_bling: PedidoBlingApiPedidoById) {
    try {
      const vendedor = await this.vendedorService.select(
        pedido_bling.vendedor.id,
      );

      const client = await this.clientService.select(
        pedido_bling.contato.id,
      );

      const status_venda = await this.statusVendasService.select(
        pedido_bling.situacao.id,
      );

      const loja = await this.lojaService.select(pedido_bling.loja.id);
      if (!loja) console.error("Loja nao encontrada");

      const id_vendedor = vendedor?.id || null;

      const id_client = client?.id || null;
      const id_status_venda = status_venda?.id || null;
      const id_loja = loja?.id || null;

      const pedidoAtualizado = this.formatPedidoData(
        pedido_bling,
        id_vendedor,
        id_client,
        id_status_venda,
        id_loja,
      );
      await this.db.update("pedidos", pedidoAtualizado, {
        numero: pedido_bling.numero,
      });

      return pedidoAtualizado.numero;
    } catch (error) {
      console.error(error.message);
      return { success: false, message: error.message };
    }
  }

  async create(pedido_bling: PedidoBlingApiPedidoById): Promise<string> {
    try {
      const pedido = this.formatPedidoData(pedido_bling);

      await this.db.insert("pedidos", pedido);

      const pedidoData: ResponsePedidoSupabase[] | null = await this.db.select(
        "pedidos",
        "id_bling",
        pedido_bling.id,
      );

      if (pedidoData && pedidoData.length > 0) {
        const id_pedido = pedidoData[0].id!;
        return id_pedido;
      } else {
        throw new Error(
          `Pedido com ID ${pedido_bling.id} não encontrado após inserção.`,
        );
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw new Error(`Erro ao criar pedido: ${error.message}`);
    }
  }

  async select(numeroPedido: number) {
    try {
      const pedido: ResponsePedidoSupabase[] | null = await this.db.select(
        "pedidos",
        "numero",
        numeroPedido,
      );

      return pedido && pedido?.length > 0 ? pedido[0] : null;
    } catch (err) {
      console.error("Erro inesperado:", err);
      throw new Error(`Erro select pedidoService: ${err.message}`);
    }
  }

  formatPedidoData(
    pedido_bling: PedidoBlingApiPedidoById,
    id_vendedor?: string | null,
    id_client?: string | null,
    id_status_venda?: string | null,
    id_loja?: string | null,
  ): ResquestPedidoSupabase {
    const dataPrevista = pedido_bling.dataPrevista === "0000-00-00"
      ? null
      : pedido_bling.dataPrevista;
    const pedido: ResquestPedidoSupabase = {
      id_bling: pedido_bling.id,
      numero: pedido_bling.numero,
      cliente: pedido_bling.contato.nome,
      data: pedido_bling.data,
      data_prevista: dataPrevista,
      desconto: pedido_bling.desconto.valor,
      id_cliente: id_client,
      id_cliente_bling: pedido_bling.contato.id,
      id_loja_bling: pedido_bling.loja.id,
      id_situacao_bling: pedido_bling.situacao.id,
      id_vendedor_bling: pedido_bling.vendedor.id,
      observacao: pedido_bling.observacoes,
      observacoes_internas: pedido_bling.observacoesInternas,
      valor_pago: pedido_bling.total,
      valor_total: pedido_bling.totalProdutos,
      id_loja: id_loja,
      id_situacao: id_status_venda,
      id_vendedor: id_vendedor,
      updated_at: new Date().toISOString(),
    };
    console.log("Pedido formatado:", pedido);

    return pedido;
  }
}

export { PedidoService };
