import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import { SupabaseServiceApi } from "./api/supabase_service_api.ts";
import { ResponseClientSupabase } from "../types/supabase/cliente.ts";

class ClientService {
  private db: SupabaseServiceApi;

  constructor(supabase: SupabaseClient) {
    this.db = new SupabaseServiceApi(supabase);
  }
  /*
  async create(client_bling: ClienteBligApiPedidoById) {
    const client:RequestClientSupabase = {
      id_bling:client_bling.id,
      nome:client_bling.nome,
      situacao:client_bling.
    };
    const vendedorCreated = await this.db.insert("vendedores", vendedor);

    return vendedorCreated;
  }
  */
  async select(id_bling: number): Promise<ResponseClientSupabase | null> {
    const clients: ResponseClientSupabase[] | null = await this.db.select(
      "clientes",
      "id_bling",
      id_bling,
    );
    if (!clients || clients.length === 0) {
      console.error(
        `[ClientService] Nenhuma cliente encontrado com id_bling: ${id_bling}`,
      );
      return null;
    }

    if (!clients[0]?.id) {
      console.error(
        `[ClientService] cliente encontrado, mas sem campo 'id':`,
        clients[0],
      );
      return null;
    }
    return clients[0];
  }
  /*
  async update(vendedor_tiny) {
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
}
export { ClientService };
