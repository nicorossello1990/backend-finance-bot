# Backend Finance Bot

Backend en TypeScript para compras y ventas de criptomonedas utilizando la API de Binance.

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta de Binance con API Key y API Secret

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/nicorossello1990/backend-finance-bot.git
cd backend-finance-bot
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

4. Edita el archivo `.env` y agrega tus credenciales de Binance:
```
BINANCE_API_KEY=tu_api_key_aqui
BINANCE_API_SECRET=tu_api_secret_aqui
```

Para obtener tus credenciales de API, visita: https://www.binance.com/en/my/settings/api-management

## 🔨 Compilación

Para compilar el proyecto TypeScript a JavaScript:

```bash
npm run build
```

Esto generará los archivos compilados en la carpeta `dist/`.

## ▶️ Ejecución

### Modo Desarrollo (con ts-node):
```bash
npm run dev
```

### Modo Producción (código compilado):
```bash
npm run build
npm start
```

## 📦 Estructura del Proyecto

```
backend-finance-bot/
├── src/
│   ├── binanceClient.ts    # Cliente para interactuar con la API de Binance
│   └── index.ts             # Punto de entrada de la aplicación
├── dist/                    # Código compilado (generado después de build)
├── .env.example             # Plantilla de variables de entorno
├── .gitignore               # Archivos ignorados por git
├── package.json             # Dependencias y scripts del proyecto
├── tsconfig.json            # Configuración de TypeScript
└── README.md                # Documentación del proyecto
```

## 🔧 Funcionalidades

El cliente de Binance (`BinanceClient`) proporciona los siguientes métodos:

- `testConnection()`: Verifica la conexión con la API de Binance
- `getPrices()`: Obtiene los precios de todos los pares de trading
- `getPrice(symbol)`: Obtiene el precio de un par específico (ej: 'BTCUSDT')
- `getAccountInfo()`: Obtiene información de la cuenta (requiere API key con permisos)
- `getOrderBook(symbol, limit)`: Obtiene el libro de órdenes para un símbolo

## 📝 Ejemplo de Uso

```typescript
import { BinanceClient } from './binanceClient';

const client = new BinanceClient();

// Probar conexión
await client.testConnection();

// Obtener precio de Bitcoin
const btcPrice = await client.getPrice('BTCUSDT');
console.log(`Bitcoin: $${btcPrice}`);

// Obtener libro de órdenes
const orderBook = await client.getOrderBook('BTCUSDT', 10);
console.log(orderBook);
```

## 🔒 Seguridad

- **Nunca** compartas tus API keys públicamente
- El archivo `.env` está incluido en `.gitignore` para evitar subir credenciales
- Configura los permisos mínimos necesarios en tu API key de Binance
- Para trading real, considera usar restricciones de IP en tu API key

## 📚 Tecnologías Utilizadas

- **TypeScript**: Lenguaje de programación tipado
- **Node.js**: Entorno de ejecución de JavaScript
- **binance-api-node**: Cliente oficial de la API de Binance
- **dotenv**: Gestión de variables de entorno

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

## 📄 Licencia

ISC
