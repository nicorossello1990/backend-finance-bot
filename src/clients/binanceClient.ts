import Binance, {OrderSide, OrderType} from 'binance-api-node';

type BinanceClientConfig = {
  apiKey: string
  apiSecret: string
  isDevMode: boolean
}
export class BinanceClient {
  private client: ReturnType<typeof Binance>;

  constructor(config: BinanceClientConfig) {
    this.client = Binance({
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      ...(config.isDevMode && {httpBase: 'https://testnet.binance.vision'})
    });
  }

  /**
   * Verificar la conexión con Binance obteniendo el tiempo del servidor
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.client.time();
      console.log('✅ Conexión exitosa con Binance');
      return true;
    } catch (error) {
      console.error('❌ Error al conectar con Binance:', error);
      return false;
    }
  }

  /**
   * Obtener información del balance de la cuenta
   */
  async getAccountInfo() {
    try {
      const accountInfo = await this.client.accountInfo();
      return accountInfo;
    } catch (error) {
      console.error('Error al obtener información de la cuenta:', error);
      throw error;
    }
  }

  /**
   * Obtener el precio de un par específico
   */
  async getPrice(symbol: string): Promise<string> {
    try {
      const result = await this.client.tickerPrice({ symbol });
      return result.price;
    } catch (error) {
      console.error(`Error al obtener precio de ${symbol}:`, error);
      throw error;
    }
  }

  async buy(symbol: string, quoteOrderQty: number): Promise<number> {
    const order =  await this.client.order({
      symbol,
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      quoteOrderQty: quoteOrderQty.toString(),
    });
    return order.orderId
  }

  async sell(symbol: string, quantity: number): Promise<number> {
    const order = await this.client.order({
      symbol,
      side: OrderSide.SELL,
      type: OrderType.MARKET,
      quantity: quantity.toString(),
    });
    return order.orderId
  }
}
