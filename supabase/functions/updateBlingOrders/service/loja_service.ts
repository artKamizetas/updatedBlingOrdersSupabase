import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import { SupabaseServiceApi } from "./api/supabase_service_api.ts";
import { ResponselojaSupabase } from "../types/supabase/loja.ts";

class LojaService {
  private db: SupabaseServiceApi;

  constructor(supabase: SupabaseClient) {
    this.db = new SupabaseServiceApi(supabase);
  }
  async select(id_bling: number): Promise<ResponselojaSupabase | null> {
    const lojas: ResponselojaSupabase[] | null = await this.db.select(
      "lojas",
      "id_bling",
      id_bling,
    );
    if (!lojas || lojas.length === 0) {
      console.error(
        `[LojaService] Nenhuma loja encontrada com id_bling: ${id_bling}`,
      );
      return null;
    }

    if (!lojas[0]?.id) {
      console.error(
        `[LojaService] Loja encontrada, mas sem campo 'id':`,
        lojas[0],
      );
      return null
    }
    return lojas[0];
  }
}
export { LojaService };
