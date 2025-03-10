import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors' // Import CORS middleware
import accounts from './accounts'
import categories from './categories'
import transactions from './transactions'
import summary from './summary'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

// Enable CORS
app.use(
  '*',
  cors({
    origin: '*', // Change to specific domains in production
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
)

// API Routes
app.route('/accounts', accounts)
app.route('/categories', categories)
app.route('/transactions', transactions)
app.route('/summary', summary)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof app
