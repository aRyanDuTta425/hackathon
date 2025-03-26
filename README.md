# Digital Rights & Content Licensing Compliance Tool

An AI-powered tool for checking content licensing compliance and managing digital rights.

## Features

- AI-powered content licensing check
- Comprehensive analysis of content rights
- Legal Q&A chatbot
- Risk assessment scoring
- User-friendly dashboard
- Secure authentication

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Cloudflare Workers + Prisma + PostgreSQL
- Authentication: JWT
- State Management: React Query
- Form Validation: Zod
- UI Components: shadcn/ui

## Prerequisites

- Node.js 18+
- pnpm
- Cloudflare account
- PostgreSQL database

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/digital-rights-tool.git
   cd digital-rights-tool
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. Set up the database:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Project Structure

```
digital-rights-tool/
├── apps/
│   ├── web/          # Frontend React application
│   └── api/          # Backend Cloudflare Worker
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── api-client/   # API client with React Query hooks
└── package.json
```

## Development

- `pnpm dev`: Start development servers
- `pnpm build`: Build all packages and applications
- `pnpm lint`: Run linting
- `pnpm format`: Format code with Prettier

## Deployment

1. Deploy the Cloudflare Worker:
   ```bash
   cd apps/api
   pnpm wrangler deploy
   ```

2. Deploy the frontend:
   ```bash
   cd apps/web
   pnpm build
   # Deploy to your preferred hosting service
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 