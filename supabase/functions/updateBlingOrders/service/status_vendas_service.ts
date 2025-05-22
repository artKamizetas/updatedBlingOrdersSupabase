import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import { SupabaseServiceApi } from "./api/supabase_service_api.ts";
import { ResponseClientSupabase } from "../types/supabase/cliente.ts";
import { ResponseStatusVendaSupabase } from "../types/supabase/status_venda.ts";

class StatusVendasService {
  private db: SupabaseServiceApi;

  constructor(supabase: SupabaseClient) {
    this.db = new SupabaseServiceApi(supabase);
  }
  async select(id_bling: number): Promise<ResponseStatusVendaSupabase | null> {
    const status:ResponseStatusVendaSupabase [] | null = await this.db.select(
      "situacoes_vendas",
      "id_bling",
      id_bling,
    );
    if (!status || status.length === 0) {
      console.error(
        `[StatusVendaService] Nenhum status encontrado com id_bling: ${id_bling}`,
      );
      return null;
    }

    if (!status[0]?.id) {
      console.error(
        `[StatusVendaService] Status encontrado, mas sem campo 'id':`,
        status[0],
      );
      return null;
    }
    return status[0];
  }
}
export { StatusVendasService };
