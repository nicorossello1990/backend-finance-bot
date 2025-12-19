import dotenv from 'dotenv';
dotenv.config();
export const binanceConfig = {
    apiKey: process.env.BINANCE_API_KEY!,
    apiSecret: process.env.BINANCE_API_SECRET!,
    isDevMode: process.env.BINANCE_IS_DEV_MODE === 'true' || false,
}