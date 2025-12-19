import Binance, {OrderSide} from 'binance-api-node';
import {OrderType} from "binance-api-node/types/base";

type BinanceClientConfig = {
  apiKey: string
  apiSecret: string
}
export class BinanceClient {
  private client: ReturnType<typeof Binance>;

  constructor(config: BinanceClientConfig) {
    this.client = Binance({
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
    });
  }

  /**
   * Obtener el cliente de Binance
   */
  getClient() {
    return this.client;
  }

  /**
   * Verificar la conexión con Binance obteniendo el tiempo del servidor
   */
  async testConnection(): Promise<boolean> {
    try {
      const time = await this.client.time();
      console.log('✅ Conexión exitosa con Binance');
      console.log('Hora del servidor:', new Date(time.serverTime).toISOString());
      return true;
    } catch (error) {
      console.error('❌ Error al conectar con Binance:', error);
      return false;
    }
  }

  /**
   * Obtener información de precios de todos los símbolos
   */
  async getPrices() {
    try {
      const prices = await this.client.prices();
      return prices;
    } catch (error) {
      console.error('Error al obtener precios:', error);
      throw error;
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

  /**
   * Obtener información del libro de órdenes para un símbolo
   */
  async getOrderBook(symbol: string, limit: number = 10) {
    try {
      const orderBook = await this.client.book({ symbol, limit });
      return orderBook;
    } catch (error) {
      console.error(`Error al obtener libro de órdenes de ${symbol}:`, error);
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
