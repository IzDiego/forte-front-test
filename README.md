# Transaction Manager Frontend

A modern Vue.js application for managing transactions, generating reports, and visualizing financial data.

## Features

- Dashboard with key metrics and interactive charts
- Transaction management (create, edit, delete)
- Report generation with customizable filters
- Dark mode support
- Responsive design
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
VITE_API_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
│   ├── dashboard/   # Dashboard components
│   ├── layout/      # Layout components
│   ├── reports/     # Report components
│   └── transactions/# Transaction components
├── router/          # Vue Router configuration
├── stores/          # Pinia stores
├── types/           # TypeScript type definitions
├── views/           # Page components
└── services/        # API services
```

## Technologies Used

- Vue 3
- TypeScript
- Vue Router
- Pinia
- Tailwind CSS
- Chart.js
- Axios

## Development

- `npm run dev` - Start development server