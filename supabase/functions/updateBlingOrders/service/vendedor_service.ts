import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import { SupabaseServiceApi } from "./api/supabase_service_api.ts";
import { ResponseVendedorSupabase } from "../types/supabase/vendedor.ts";

class VendedorService {
  private db: SupabaseServiceApi;

  constructor(supabase: SupabaseClient) {
    this.db = new SupabaseServiceApi(supabase);
  }
  /*


  async create(vendedor_tiny: Vendedor) {
    const vendedor = {
      id_tiny: vendedor_tiny.id,
      nome: vendedor_tiny.nome,
      situacao: vendedor_tiny.situacao,
      equipe: vendedor_tiny.fantasia,
    };
    const vendedorCreated = await this.db.insert("vendedores", vendedor);

    return vendedorCreated;
  }
  async update(vendedor_tiny: Vendedor) {
    const vendedor = {
      id_tiny: vendedor_tiny.id,
      nome: vendedor_tiny.nome,
      situacao: vendedor_tiny.situacao,
      equipe: vendedor_tiny.fantasia,
    };
    const vendedorUpdated = await this.db.update("vendedores", vendedor, {
      id_tiny: vendedor_tiny.id,
    });

    return vendedorUpdated;
  }
  */

  async select(id_bling: number): Promise<ResponseVendedorSupabase | null> {
    const vendedor: ResponseVendedorSupabase[] | null = await this.db.select(
      "vendedores",
      "id_bling",
      id_bling,
    );
    if (!vendedor || vendedor.length === 0) {
      console.error(
        `[VendedorService] Nenhum vendedor encontrado com id_bling: ${id_bling}`,
      );
      return null;
    }

    if (!vendedor[0]?.id) {
      console.error(
        `[VendedorService] vendedor encontrado, mas sem campo 'id':`,
        vendedor[0],
      );
      return null;
    }
    return vendedor[0];
  }
}
export { VendedorService };
