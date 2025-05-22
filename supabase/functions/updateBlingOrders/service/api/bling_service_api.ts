import { GetBlingAuthenticate } from "../../middleware/auth-bling.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";

class ApiBlingRequest {
  private getBlingAuthenticate: GetBlingAuthenticate;
  private tokens: { accessToken: string; refreshToken: string; code: string };

  constructor(
    supabase: SupabaseClient,
    tokens: { accessToken: string; refreshToken: string; code: string },
  ) {
    this.getBlingAuthenticate = new GetBlingAuthenticate(supabase);
    this.tokens = tokens;
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
  ): Promise<any> {
    let res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.tokens.accessToken}`,
      },
    });

    if (res.status === 401) {
      console.log("Token expirado. Renovando...");
      let newTokens = await this.getBlingAuthenticate
        .getAccessTokenByRefreshToken(
          this.tokens.refreshToken,
        );
      if (!newTokens) {
        newTokens = await this.getBlingAuthenticate
          .getAccessTokenByCodeOAuth(
            this.tokens.code,
          );

        if (!newTokens) {
          throw new Error("Falha ao renovar tokens");
        }
      }

      this.tokens.accessToken = newTokens.access_token;
      this.tokens.refreshToken = newTokens.refresh_token;

      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newTokens.access_token}`,
        },
      });
    }

    if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
    return await res.json();
  }

  apiV3GetPedidosAlteradosHoje(
    dataAlteracaoInicial: string,
    dataAlteracaoFinal: string,
    horaInicial: string,
    horaFinal: string,
  ) {
    try {
      const arrayHoraInicial = horaInicial.split(":");
      const arrayHoraFinal = horaFinal.split(":");
      const horaInicialFormated = `%20${arrayHoraInicial[0]}%3A${
        arrayHoraInicial[1]
      }%3A00`;
      const horaFinalFormated = `%20${arrayHoraFinal[0]}%3A${
        arrayHoraFinal[1]
      }%3A00`;
      const dataEhoraAlteracaoInicial = dataAlteracaoInicial +
        horaInicialFormated;
      const dataEhoraAlteracaoFinal = dataAlteracaoFinal + horaFinalFormated;
      console.log(
        `Horario formatado inicial == ${dataEhoraAlteracaoInicial} e data final = ${dataEhoraAlteracaoFinal}`,
      );
      const url =
        `https://api.bling.com.br/Api/v3/pedidos/vendas?pagina=1&limite=200&dataAlteracaoInicial=${dataEhoraAlteracaoInicial}&dataAlteracaoFinal=${dataEhoraAlteracaoFinal}`;
      return this.fetchWithRetry(url, { method: "GET" });
    } catch (error) {
      console.log("Error APIV3GetPedidosAlteradosHoje:", error);
    }
  }

  apiV3GetPedidoById( id:number) {  
    const url = `https://www.bling.com.br/Api/v3/pedidos/vendas/${id}`;

    return this.fetchWithRetry(url, { method: "GET" });
  }
}

export { ApiBlingRequest };
