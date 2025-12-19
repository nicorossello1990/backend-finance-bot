import {BinanceClient} from "./binanceClient";
import {binanceConfig} from "../config";
const binanceClient = new BinanceClient(binanceConfig);

export {binanceClient}