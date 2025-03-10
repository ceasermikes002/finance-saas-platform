# Next.js Finance Tracking Application

A modern, full-stack finance tracking application built with Next.js 14, DrizzleORM, Neon Database, and Hono.

## Features

- 💰 Account Management
  - Create, edit, and delete financial accounts
  - Track multiple accounts in one place
  - Filter transactions by account

- 📊 Transaction Tracking
  - Record income and expenses
  - Bulk import transactions via CSV
  - Categorize transactions
  - Filter transactions by date range

- 📈 Financial Summary
  - View income, expenses, and balance
  - Filter summary by date range and account
  - Real-time updates

- 🎯 Category Management
  - Create custom categories
  - Organize transactions by category
  - Track spending patterns

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Neon (Serverless Postgres)
- **ORM**: DrizzleORM
- **API Layer**: Hono
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: (Your auth solution if implemented)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/your-repo-name.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
# Create a .env.local file with:
DATABASE_URL=your_neon_database_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Setup

This project uses Neon Database (Serverless Postgres) with DrizzleORM. To set up your database:

1. Create a Neon account and database
2. Copy your database connection string
3. Update your `.env` file with the connection string
4. Run migrations:
```bash
npm run db:migrate
```

## Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Set up the required environment variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_APP_URL` etc
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE) © [Chimaobi]
