import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";


class SupabaseServiceApi {
  constructor(private supabase: SupabaseClient) {
    if (!supabase) throw new Error("SupabaseClient não foi fornecido.");
  }

  async update(table:string, data: object, conditions: object) {
    try {
      const { error, data: updatedData } = await this.supabase
        .from(table)
        .update(data)
        .match(conditions);

      if (error) {
        console.error(`Erro ao atualizar ${table}:`, error.message);
        throw new Error(
          `Erro na atualização do Supabase para ${table}: ${error.message}`,
        );
      }

      return updatedData;
    } catch (error: any) {
      console.error(
        `Erro inesperado ao atualizar ${table}:`,
        error.message || error
      );
      throw new Error(
        `Erro de conexão ou exceção inesperada ao atualizar ${table}: ${
          error.message || error
        }`,
      );
    }
  }

  async insert(table: string, data: object) {
    try {
      const { error, data: insertedData } = await this.supabase
        .from(table)
        .insert(data);

      if (error) {
        throw new Error(`Erro ao inserir em ${table}: ${error.message}`);
      }

      return insertedData;
    } catch (error) {
      console.error("Erro de conexão ao inserir em", table, ":", error);
      throw new Error(`Erro ao inserir em ${table}: ${error.message}`);
    }
  }

  async delete(table: string, column: string, value: string | number) {
    try {
      const { data: deletedData, error } = await this.supabase
        .from(table)
        .delete()
        .eq(column, value);

      if (error) {
        throw new Error(`Erro ao deletar em ${table}: ${error.message}`);
      }

      return deletedData;
    } catch (error) {
      console.error("Erro de conexão ao deletar em", table, ":", error);
      throw new Error(`Erro ao deletar em ${table}: ${error.message}`);
    }
  }

  async select(table: string, column?: string, value?: string | number) {
    try {
      let query = this.supabase.from(table).select();

      if (column !== undefined && value !== undefined) {
        query = query.eq(column, value);
      }
      const { data, error } = await query;

      if (error) {
        throw new Error(`Erro ao consultar ${table}: ${error.message}`);
      }
      return data.length > 0 ? data : null;   
    } catch (error) {
      console.error("Erro de conexão ao consultar", table, ":", error);
      throw new Error(
        `Erro ao consultar ${table}: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }
}

export { SupabaseServiceApi };
