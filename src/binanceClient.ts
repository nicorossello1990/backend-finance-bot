import Binance from 'binance-api-node';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Cliente de Binance para interactuar con la API
 */
export class BinanceClient {
  private client: ReturnType<typeof Binance>;

  constructor() {
    // Inicializar el cliente con las credenciales de API
    this.client = Binance({
      apiKey: process.env.BINANCE_API_KEY || '',
      apiSecret: process.env.BINANCE_API_SECRET || '',
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
      const prices = await this.client.prices();
      const priceObj = prices.find(p => p.symbol === symbol);
      return priceObj ? priceObj.price : '0';
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
}
