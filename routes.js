import { statusRoutes } from './status/index.js';
import { authRoutes } from './auth/index.js'
import { networkRoutes } from './network/index.js'
import { temperatureRoutes } from './temperature/index.js'
import { automationRoutes } from './automations/web.js';

export const setupRoutes = () => {
    statusRoutes();
    authRoutes();
    networkRoutes();
    temperatureRoutes();
    automationRoutes();
}