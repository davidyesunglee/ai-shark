# Business Plan Assessor

## Overview

A professional web application that evaluates business plans against bank debt financing criteria using AI-powered analysis. Users upload business plan documents (PDF, DOCX, or TXT), and the system provides comprehensive assessments including overall scores, criterion-by-criterion breakdowns, strengths, weaknesses, and recommendations.

The application serves as a utility tool for financial professionals to quickly evaluate business plan viability for bank lending decisions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for consistent theming
- **Design System**: Professional banking aesthetic with Inter font family, clean layouts, and data visualization components (ScoreRing, ScoreBar)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **File Handling**: Multer for multipart file uploads (max 10MB)
- **Document Parsing**: pdf-parse for PDFs, mammoth for DOCX files

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Key Tables**: `users` (authentication), `assessments` (business plan evaluations)
- **Migration Tool**: Drizzle Kit with `db:push` command

### AI Integration
- **Provider**: OpenAI API for business plan analysis
- **Purpose**: Generates structured assessment data including scores, analysis, and recommendations
- **Configuration**: Requires `OPENAI_API_KEY` environment variable

### Build System
- **Development**: Vite dev server with HMR, proxying API requests to Express
- **Production**: Vite builds static assets to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Path Aliases**: `@/` maps to client source, `@shared/` maps to shared code

## External Dependencies

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `OPENAI_API_KEY`: OpenAI API key for AI-powered analysis (required for full functionality)
- `RESEND_API_KEY`: Resend API key for weekly registration email reports

### Third-Party Services
- **OpenAI API**: Powers the business plan analysis and scoring
- **PostgreSQL**: Primary data storage (can be provisioned via Replit)
- **Resend**: Email service for sending weekly registration reports to vemangum@gmail.com
- **Stripe**: Payment processing (uses STRIPE_LIVE_PUBLISHABLE_KEY and STRIPE_LIVE_SECRET_KEY secrets instead of Replit connector)

## Authentication System
- **Email/Password Authentication**: Users sign up with email and password (no Replit account required)
- **Password Security**: bcryptjs with 12 rounds of hashing
- **Session Management**: express-session with PostgreSQL store (sessions table)
- **Email Verification**: Optional email verification with 24-hour token expiry
- **Routes**: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/user`, `/api/auth/verify-email`
- **Required Environment Variable**: `SESSION_SECRET` (required, no fallback for security)

## User Registration System
- All users must complete registration before uploading business plans
- Registration collects: username, email, phone, address, company info
- Registration data stored in `user_registrations` table (linked via userId to users table)
- Weekly email reports sent every Sunday at midnight via Resend API
- Email includes HTML table and CSV attachment with registration data

## Payment System (Stripe Integration)

### Pricing Tiers
- **Free Tier**: Registration only, no evaluations or score access
- **Monthly Subscription**: $6.99/month + tax, 2 evaluations per month
- **One-Time Payment**: $13.99 + tax, 1 evaluation

### Database Tables
- `billing_profiles`: Tracks user tier, Stripe customer ID, credits remaining
- `transaction_records`: Logs all payments with amount, tax, status
- `credit_ledger`: Audit trail of credit additions/deductions

### Stripe Integration
- Uses `stripe-replit-sync` for automated webhook handling and data sync
- **Products fetched directly from Stripe API** (not database cache) to ensure correct price IDs
- Webhook endpoint: `/api/stripe/webhook`
- Checkout sessions created via `/api/checkout/create-session`
- Admin resync endpoint: `POST /api/admin/stripe-resync` (requires x-admin-key header)

### Payment Enforcement
- Upload endpoint checks billing profile before allowing evaluation
- Free tier users blocked from uploading business plans
- Credits deducted after successful upload
- Subscription credits reset monthly via invoice webhook

### Weekly Transaction Reports
- Transaction data emailed to vemangum@gmail.com every Sunday at midnight
- Includes HTML summary and CSV attachment
- Tracks user, amount, tax, tier, and payment status

### Weekly Revenue Reports
- Revenue data emailed to aisharkphd@gmail.com every Sunday at 10pm
- Groups transactions by payment type (subscriptions vs one-time)
- Shows totals for each tier with gross revenue, tax, and net revenue
- Includes detailed transaction list with customer info
- CSV summary attachment included

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `openai`: OpenAI API client
- `pdf-parse`: PDF document text extraction
- `mammoth`: DOCX document text extraction
- `express`: HTTP server framework
- `multer`: File upload handling
- `react-dropzone`: Frontend file upload UI