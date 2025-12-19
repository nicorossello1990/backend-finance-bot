import {binanceClient} from "./clients";
import {Account, AssetBalance} from "binance-api-node";

const PAIR: string = 'ADAUSDT';     // Par a operar
const ASSET: string = 'ADA';        // La moneda que compramos
const INVERSION_USDT: number = 15;  // Monto a invertir (USDT)

/**
 * Función principal para demostrar el uso del cliente de Binance
 */
async function main() {
  console.log('🚀 Iniciando Backend Finance Bot...\n');

  // Probar la conexión
  console.log('📡 Probando conexión con Binance...');
  const isConnected = await binanceClient.testConnection();
  
  if (!isConnected) {
    console.log('\n⚠️  No se pudo conectar con Binance.');
    console.log('Asegúrate de configurar las variables de entorno BINANCE_API_KEY y BINANCE_API_SECRET en el archivo .env');
    return;
  }

  console.log('\n📊 Obteniendo precios de algunos pares de criptomonedas...');
  try {
    // Obtener precio de Bitcoin
    const btcPrice = await binanceClient.getPrice('BTCUSDT');
    console.log(`Bitcoin (BTC/USDT): $${btcPrice}`);

    // Obtener precio de Ethereum
    const ethPrice = await binanceClient.getPrice('ETHUSDT');
    console.log(`Ethereum (ETH/USDT): $${ethPrice}`);

    // Obtener precio de Binance Coin
    const bnbPrice = await binanceClient.getPrice('BNBUSDT');
    console.log(`Binance Coin (BNB/USDT): $${bnbPrice}`);

    console.log('\n✅ Demostración completada exitosamente!');

    console.log(`\n1️⃣  Ejecutando COMPRA de mercado...`);

    const orderId = await binanceClient.buy(PAIR, INVERSION_USDT)

    console.log(`✅ Compra enviada. ID: ${orderId}`);

    // a) Consultar saldo real
    const infoCuenta: Account = await binanceClient.getAccountInfo();
    const balance: AssetBalance | undefined = infoCuenta.balances.find((b: AssetBalance) => b.asset === ASSET);

    if (!balance) {
      throw new Error(`No se encontró balance para el activo ${ASSET}`);
    }

    const quantity: number = parseFloat(balance.free);
    console.log(`💰 Saldo disponible: ${quantity} ${ASSET}`);

    if (quantity === 0) {
      console.error(`❌ Error: No hay saldo de ${ASSET} para vender.`);
      return;
    }

    // b) Ajuste de decimales (Truco de seguridad)
    // Binance suele rechazar órdenes con demasiados decimales (Lot Size Filter).
    // ADA suele aceptar 1 o 2 decimales. Redondeamos hacia abajo a 2 decimales.
    const cantidadAVender: string = (Math.floor(quantity * 100) / 100).toFixed(2);

    const numberQuantity = parseFloat(cantidadAVender)
    if (numberQuantity <= 0) {
      console.error("❌ La cantidad es muy pequeña para vender después de redondear.");
      return;
    }

    console.log(`2️⃣  Ejecutando VENTA de ${cantidadAVender} ${ASSET}...`);

    const orderIdSell = await binanceClient.sell(PAIR, numberQuantity)

    console.log(`✅ Venta Exitosa! ID: ${orderIdSell}`);
    console.log(`🏁 Bot finalizado correctamente.`);

  } catch (error) {
    console.error('\n❌ Error durante la ejecución:', error);
  }
}

main().catch(console.error);
