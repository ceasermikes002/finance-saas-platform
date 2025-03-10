import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { handle } from 'hono/vercel'
import accounts from './accounts'
import categories from './categories'
import transactions from './transactions'
import summary from './summary'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

// Enable CORS before defining routes
app.use(
  '*',
  cors({
    origin: ['https://finance-saas-platform-seven.vercel.app', 'http://localhost:3000'], // Allowed origins
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    credentials: true, // Allow authentication headers and cookies
    maxAge: 600, // Cache preflight response for 10 minutes
  })
)

// Define API routes
const routes = app
  .route('/accounts', accounts)
  .route('/categories', categories)
  .route('/transactions', transactions)
  .route('/summary', summary)

export const GET = handle(routes)
export const POST = handle(routes)
export const PATCH = handle(routes)
export const DELETE = handle(routes)

// Export routes type
export type AppType = typeof routes
