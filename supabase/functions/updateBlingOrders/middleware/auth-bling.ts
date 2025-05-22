import { clientIdBling, secretKeyBling } from "../env/index.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import { SupabaseServiceApi } from "../service/api/supabase_service_api.ts";
import { addSecondsToDate } from "../utils/index.ts";

interface responseBlingToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

class GetBlingAuthenticate {
  private db: SupabaseServiceApi;

  constructor(supabase: SupabaseClient) {
    this.db = new SupabaseServiceApi(supabase);
  }

  async getAccessTokenByCodeOAuth(
    code: string,
  ): Promise<{ access_token: string; refresh_token: string } | null> {
    console.log("code  == ", code);

    try {
      const credentials = `${clientIdBling}:${secretKeyBling}`;
      const credentialsCode = btoa(credentials);

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
      });

      const reqs = await fetch("https://www.bling.com.br/Api/v3/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentialsCode}`,
        },
        body: body.toString(),
      });

      if (!reqs.ok) {
        const errorDetails = await reqs.json();
        console.error(
          "Erro na resposta da API authorization by code:",
          errorDetails,
        );
        return null;
      }

      const response: responseBlingToken = await reqs.json();
      const { access_token, refresh_token } = response;

      console.log("Novos tokens vindos atraves do code OAuth = ", response);

      const access_token_expires_at = addSecondsToDate(
        response.expires_in,
      );

      await this.db.update(
        "auth_tokens_bling",
        { access_token, refresh_token, updated_at: new Date().toISOString(), access_token_expires_at: access_token_expires_at.toISOString() },
        {
          code: code,
        },
      );

      return { access_token, refresh_token };
    } catch (error) {
      console.error(
        "Error while getting the access token by code OAuth:",
        error,
      );
      return null;
    }
  }

  async getAccessTokenByRefreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string } | null> {
    try {
      const credentials = `${clientIdBling}:${secretKeyBling}`;
      const credentialsCode = btoa(credentials);

      const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });

      const reqs = await fetch("https://www.bling.com.br/Api/v3/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${credentialsCode}`,
        },
        body: body.toString(),
      });

      if (!reqs.ok) {
        const errorDetails = await reqs.json();
        console.error(
          "Erro na resposta da API authorization by refhesh_token:",
          errorDetails,
        );
        return null;
      }

      const response: responseBlingToken = await reqs.json();
      const { access_token, refresh_token } = response;
      const access_token_expires_at = addSecondsToDate(
        response.expires_in,
      );

      await this.db.update(
        "auth_tokens_bling",
        {
          access_token,
          refresh_token,
          updated_at: new Date().toISOString(),
          access_token_expires_at: access_token_expires_at.toISOString(),
        },
        { refresh_token: refreshToken },
      );

      return { access_token, refresh_token };
    } catch (error) {
      console.error(
        "Erro ao obter novo access token via refresh token:",
        error,
      );
      return null;
    }
  }
}

export { GetBlingAuthenticate };
