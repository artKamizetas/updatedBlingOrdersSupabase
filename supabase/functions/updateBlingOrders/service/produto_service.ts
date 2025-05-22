import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import { SupabaseServiceApi } from "./api/supabase_service_api.ts";
import { ResponseProdutoSupabase } from "../types/supabase/produto.ts";

class ProdutoService {
  private db: SupabaseServiceApi;

  constructor(supabase: SupabaseClient) {
    this.db = new SupabaseServiceApi(supabase);
  }
  async select(
    id_produto_bling: number,
  ): Promise<ResponseProdutoSupabase[] | null> {
    try {
      const produto: ResponseProdutoSupabase[] | null = await this.db.select(
        "produtos",
        "id_bling",
        id_produto_bling,
      );
    

      return produto && produto?.length > 0 ? produto : null;
    } catch (err) {
      console.error("Erro inesperado no select produtoService:", err);
      throw new Error(`Erro select ProdutoController: ${err.message}`);
    }
  }
}

export { ProdutoService };
