import { statusRoutes } from './status/index.js';
import { authRoutes } from './auth/index.js'
import { networkRoutes } from './network/index.js'

export const setupRoutes = () => {
    statusRoutes();
    authRoutes()
    networkRoutes();    
}