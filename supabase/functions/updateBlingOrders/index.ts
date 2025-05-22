import { Handler } from "./handler.ts";


// index.ts
Deno.serve(async (): Promise<Response> => {
  console.log("=== Início do updateBlingOrders ===");

  try {
    const handler = new Handler();
    await handler.initialize();
    const result = await handler.execute();
    return new Response(JSON.stringify(result));
  } catch (error) {
    console.error("Erro no handler:", error);
    return new Response("Erro interno", { status: 500 });
  }
});
