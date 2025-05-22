import { PedidoBlingApiPedidoById } from "../types/bling/pedido.ts";
import { ResponsePedidoSupabase } from "../types/supabase/pedido.ts";
import { SupabaseServiceApi } from "./api/supabase_service_api.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import { ProdutoService } from "./produto_service.ts";
import { ItemBlingApiPedidoById } from "../types/bling/item.ts";
import { ResquestItemSupabase } from "../types/supabase/item.ts";

class ItemService {
  private db: SupabaseServiceApi;
  private produtoService: ProdutoService;

  constructor(supabase: SupabaseClient) {
    this.db = new SupabaseServiceApi(supabase);
    this.produtoService = new ProdutoService(supabase);
  }

  async update(pedido_bling: PedidoBlingApiPedidoById, id_pedido: string) {
    try {
      await this.db.delete("itens", "id_pedido", id_pedido);
      console.log("Itens deletados do pedido:", id_pedido);
    } catch (error) {
      console.error("Erro ao deletar em itens:", error);
      throw new Error(`Erro ao deletar em itens: ${error.message}`);
    }
    await this.create(pedido_bling, id_pedido);

    console.log("Todos os itens atualizados com sucesso do pedido",id_pedido);
  }

  async create(pedido_bling: PedidoBlingApiPedidoById, id_pedido: string) {
    const itemDataArray = await Promise.all(
      pedido_bling.itens.map((item) =>
        this.formatItemData(pedido_bling,item,id_pedido)
      ),
    );
    console.log("Quantidade de itens:", itemDataArray.length);
    try {
      await this.db.insert("itens", itemDataArray);
      console.log("Novo item inserido:", id_pedido);
    } catch (error) {
      console.error("Erro ao inserir em itens:", error);
      throw new Error("Erro ao inserir itens. Pedido não foi finalizado.");
    }
  }
  async formatItemData(
    pedido_bling: PedidoBlingApiPedidoById,
    item: ItemBlingApiPedidoById,
    id_pedido: string, 
  ): Promise<ResquestItemSupabase> {

    const produtos = await this.produtoService.select(item.produto.id);
    if (!produtos) console.error("Produto nao encontrado");
    

    return {
      id_pedido,
      id_pedido_bling:pedido_bling.id,
      id_produto:produtos ? produtos[0].id : null,
      desconto_item: item.desconto,
      id_produto_bling:item.produto.id,
      quantidade:item.quantidade,
      valor_unidade:item.valor    
    };
  }
}

export { ItemService };
