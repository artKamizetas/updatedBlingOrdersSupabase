

import { ProdutoService } from "../service/produto_service.ts";
import { VendedorService } from "../service/vendedor_service.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import { PedidoBlingApiPedidoById } from "../types/bling/pedido.ts";
import { ResquestPedidoSupabase } from "../types/supabase/pedido.ts";


function getFormattedTodayDate(): string {
  const today = new Date();

  // Ajusta o fuso horário manualmente se necessário (ex: -3 horas para Brasil)
  const timezoneOffsetInMs = 3 * 60 * 60 * 1000; // -3h
  const localTime = new Date(today.getTime() - timezoneOffsetInMs);

  const year = localTime.getFullYear();
  const month = String(localTime.getMonth() + 1).padStart(2, "0");
  const day = String(localTime.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimer() {
  // Hora atual
  const agora = new Date();
  const horaAtual = agora.getHours(); // Horas no formato 24h
  const minutosAtuais = agora.getMinutes(); // Minutos

 
  const duasHorasAntes = new Date(agora.getTime() - 2 * 60 * 60 * 1000);
  const horasAntes = duasHorasAntes.getHours();
  const minutosHorasAntes = duasHorasAntes.getMinutes();

  // Formata as horas e minutos com dois dígitos
  const horaAtualFormatada = `${horaAtual.toString().padStart(2, "0")}:${
    minutosAtuais.toString().padStart(2, "0")
  }`;
  const horasAntesFormatada = `${horasAntes.toString().padStart(2, "0")}:${
    minutosHorasAntes.toString().padStart(2, "0")
  }`;

  return {
    horaAtualFormatada,
    horasAntesFormatada,
  };
}

function addSecondsToDate(seconds: number): Date {
  const now = new Date();
  const newDate = new Date(now.getTime() + seconds * 1000);
  return newDate;
}
export { addSecondsToDate, formatTimer, getFormattedTodayDate };
