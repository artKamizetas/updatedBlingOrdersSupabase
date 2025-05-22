import { z } from "https://deno.land/x/zod@v3.24.1/mod.ts";

// Função para carregar e validar variáveis de ambiente com Zod
const envSchema = z.object({
  MY_SUPABASE_EMAIL: z.string(),
  MY_SUPABASE_PASSWORD: z.string(),
  MY_SUPABASE_URL: z.string().url(),
  MY_SUPABASE_KEY: z.string(),
  CLIENTID_BLING: z.string(),
  SECRET_KEY_BLING: z.string(),
});

let validatedEnv;

// Validar as variáveis de ambiente com Zod
try {
  validatedEnv = envSchema.parse({
    MY_SUPABASE_EMAIL: Deno.env.get("MY_SUPABASE_EMAIL"),
    MY_SUPABASE_PASSWORD: Deno.env.get("MY_SUPABASE_PASSWORD"),
    MY_SUPABASE_URL: Deno.env.get("MY_SUPABASE_URL"),
    MY_SUPABASE_KEY: Deno.env.get("MY_SUPABASE_KEY"),
    CLIENTID_BLING: Deno.env.get("CLIENTID_BLING"),
    SECRET_KEY_BLING: Deno.env.get("SECRET_KEY_BLING"),

  });
} catch (error) {
  console.error("❌ Falha na validação das variáveis de ambiente:");
  console.error(error.errors); 
  Deno.exit(1); 
}

// Exportar as variáveis de ambiente validadas
const {
  MY_SUPABASE_EMAIL: supabaseEmail,
  MY_SUPABASE_PASSWORD: supabasePassword,
  MY_SUPABASE_URL: supabaseUrl,
  MY_SUPABASE_KEY: supabaseKey,
  CLIENTID_BLING: clientIdBling,
  SECRET_KEY_BLING: secretKeyBling,
} = validatedEnv;

export {
  supabaseEmail,
  supabasePassword,
  supabaseUrl,
  supabaseKey,
  clientIdBling,
  secretKeyBling,

};
