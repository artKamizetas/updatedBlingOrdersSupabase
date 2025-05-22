import { authenticateUser } from "./middleware/auth-supabase.ts";
import { SupabaseServiceApi } from "./service/api/supabase_service_api.ts";
import { PedidoService } from "./service/pedido_service.ts";
import { TokenSupabase } from "./types/bling/token.ts";
import { ItemService } from "./service/item_service.ts";

export class Handler {
  private pedidoService: PedidoService;
  private itemService: ItemService;
  private supabaseServiceApi: SupabaseServiceApi;

  constructor() {
    this.pedidoService = {} as PedidoService;
    this.itemService = {} as ItemService;
    this.supabaseServiceApi = {} as SupabaseServiceApi;
  }

  async initialize() {
    console.log("=== Início da initialize ===");
    const { supabase } = await authenticateUser();

    this.supabaseServiceApi = new SupabaseServiceApi(supabase);
    const tokensArray = await this.supabaseServiceApi.select(
      "auth_tokens_bling",
    );
    const tokens: TokenSupabase = tokensArray?.[0];

    if (!tokens) {
      throw new Error("Nenhum token encontrado");
    }
    this.pedidoService = new PedidoService(supabase, tokens);

    this.itemService = new ItemService(supabase);
    console.log("=== Fim da initialize ===");
  }

  async execute(): Promise<{ success: boolean; message: string }> {
    console.log("=== Início do processamento do updateBlingOrders ===");

    try {
      const idPedidosAlterados = await this.pedidoService
        .obterPedidosAlterados();

      if (!idPedidosAlterados || idPedidosAlterados.length === 0) {
        return {
          success: true,
          message: "Nenhum pedido alterado encontrado.",
        };
      }

      const pedidosAlterados = await this.pedidoService.obterPedidoById(
        idPedidosAlterados,
      );
      console.log(
        "Quantidade de pedidos alterados api byId:",
        pedidosAlterados.length,
      );

      for (const pedido of pedidosAlterados) {
        const pedidoExistente = await this.pedidoService.select(pedido.numero);
        if (pedidoExistente) {
          await this.pedidoService.update(pedido);
          await this.itemService.update(pedido, pedidoExistente.id);
          console.log("pedido e itens atualizados:", pedido.numero);
        } else {
          const id_pedido = await this.pedidoService.create(pedido);
          await this.itemService.create(pedido, id_pedido);
          console.log("pedido e itens criados:", pedido.numero);
        }
      }
      return {
        success: true,
        message: "Pedidos atualizados com sucesso.",
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Erro ao atualizar pedidos:", error);

      return {
        success: false,
        message: `Erro ao atualizar pedidos: ${error.message}`,
      };
    } finally {
      console.log("=== Fim do processamento do updateBlingOrders ===");
    }
  }
}
