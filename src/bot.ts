import dotenv from 'dotenv';
import Binance, { AuthenticatedClient, Order, Account, AssetBalance } from 'binance-api-node';

// Cargar variables de entorno
dotenv.config();

// --- CONFIGURACIÓN ---
const PAIR: string = 'ADAUSDT';     // Par a operar
const ASSET: string = 'ADA';        // La moneda que compramos
const INVERSION_USDT: number = 15;  // Monto a invertir (USDT)
const TIEMPO_ESPERA_MIN: number = 30; // Minutos a esperar

// Validar que existan las keys
if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_API_SECRET) {
    throw new Error('❌ Faltan las variables BINANCE_API_KEY o BINANCE_API_SECRET en el archivo .env');
}

// 1. Inicializar Cliente
const client: AuthenticatedClient = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  // ⚠️ IMPORTANTE: Descomentá la siguiente línea si usás la TESTNET (Sandbox)
  // httpBase: 'https://testnet.binance.vision',
});

// Función de utilidad para esperar (Sleep)
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

async function ejecutarBot(): Promise<void> {
  try {
    console.log(`🤖 Iniciando Bot TS. Objetivo: Comprar ${INVERSION_USDT} USDT de ${ASSET}, esperar ${TIEMPO_ESPERA_MIN}m y vender.`);

    // --- PASO 1: COMPRA (Market Order) ---
    console.log(`\n1️⃣  Ejecutando COMPRA de mercado...`);

    const ordenCompra: Order = await client.order({
      symbol: PAIR,
      side: 'BUY',
      type: 'MARKET',
      quoteOrderQty: INVERSION_USDT.toString(), // Cantidad en USDT
    });

    console.log(`✅ Compra enviada. ID: ${ordenCompra.orderId}`);

    // Nota: Para saber la cantidad exacta comprada, lo ideal es revisar el balance o los 'fills'
    // pero para simplificar, confiamos en el balance actualizado luego.

    // --- PASO 2: ESPERA ---
    console.log(`\n⏳ Esperando ${TIEMPO_ESPERA_MIN} minutos...`);
    await sleep(TIEMPO_ESPERA_MIN * 60 * 1000);
    console.log(`\n⏰ Tiempo cumplido. Procediendo a vender.`);

    // --- PASO 3: VENTA (Market Order) ---
    
    // a) Consultar saldo real
    const infoCuenta: Account = await client.accountInfo();
    const balance: AssetBalance | undefined = infoCuenta.balances.find((b: AssetBalance) => b.asset === ASSET);

    if (!balance) {
        throw new Error(`No se encontró balance para el activo ${ASSET}`);
    }

    const cantidadDisponible: number = parseFloat(balance.free);
    console.log(`💰 Saldo disponible: ${cantidadDisponible} ${ASSET}`);

    if (cantidadDisponible === 0) {
        console.error(`❌ Error: No hay saldo de ${ASSET} para vender.`);
        return;
    }

    // b) Ajuste de decimales (Truco de seguridad)
    // Binance suele rechazar órdenes con demasiados decimales (Lot Size Filter).
    // ADA suele aceptar 1 o 2 decimales. Redondeamos hacia abajo a 2 decimales.
    const cantidadAVender: string = (Math.floor(cantidadDisponible * 100) / 100).toFixed(2);
    
    // Verificamos que no sea 0 después del redondeo
    if (parseFloat(cantidadAVender) <= 0) {
        console.error("❌ La cantidad es muy pequeña para vender después de redondear.");
        return;
    }

    console.log(`2️⃣  Ejecutando VENTA de ${cantidadAVender} ${ASSET}...`);

    const ordenVenta: Order = await client.order({
      symbol: PAIR,
      side: 'SELL',
      type: 'MARKET',
      quantity: cantidadAVender,
    });

    console.log(`✅ Venta Exitosa! ID: ${ordenVenta.orderId}`);
    console.log(`🏁 Bot finalizado correctamente.`);

  } catch (error: any) {
    console.error(`\n🚨 Ocurrió un error: ${error.message}`);
    if (error.body) {
        console.error("Detalle del error:", JSON.parse(error.body));
    }
  }
}

ejecutarBot();
