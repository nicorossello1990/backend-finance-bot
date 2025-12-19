import { BinanceClient } from './binanceClient';

/**
 * Función principal para demostrar el uso del cliente de Binance
 */
async function main() {
  console.log('🚀 Iniciando Backend Finance Bot...\n');

  // Crear instancia del cliente de Binance
  const binanceClient = new BinanceClient();

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

    console.log('\n📖 Obteniendo libro de órdenes de BTC/USDT...');
    const orderBook = await binanceClient.getOrderBook('BTCUSDT', 5);
    console.log('Mejores 5 ofertas de compra (bids):');
    orderBook.bids.slice(0, 5).forEach((bid, index) => {
      console.log(`  ${index + 1}. Precio: $${bid[0]}, Cantidad: ${bid[1]}`);
    });
    console.log('Mejores 5 ofertas de venta (asks):');
    orderBook.asks.slice(0, 5).forEach((ask, index) => {
      console.log(`  ${index + 1}. Precio: $${ask[0]}, Cantidad: ${ask[1]}`);
    });

    console.log('\n✅ Demostración completada exitosamente!');
  } catch (error) {
    console.error('\n❌ Error durante la ejecución:', error);
  }
}

// Ejecutar la función principal
main().catch(console.error);
