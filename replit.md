# AI Shark — Business Plan Assessor

## Overview

A professional web application (aishark.org) that evaluates business plans against bank debt financing criteria using Gemini AI-powered analysis. Users upload business plan documents (PDF, DOCX, or TXT), and the system provides comprehensive assessments including:
- Overall score (0-100) + Lender Readiness Grade (A through F)
- 10-dimension criteria breakdown (creditworthiness, cash flow, collateral, debt/equity, market viability, management, financial projections, revenue model, industry risk, competitive position)
- SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)
- Market Analysis (target market, market size, competitive position, growth potential)
- 6 Key Financial Ratios (DSCR, current ratio, gross margin, D/E, break-even, owner equity)
- Actionable strengths, weaknesses, and recommendations
- PDF export of full report (browser print-to-PDF)

## Competitive Position (Traffic-Based Ranking)
1. **LivePlan** — #1 by traffic, $15-30/mo, 500+ templates, QuickBooks integration
2. **Enloop** — #2, free tier, 16 financial ratios, real-time scoring
3. **IdeaProof** — #3, 50+ criteria, TAM/SAM/SOM, 120-second analysis
4. **PrometAI** — #4, SWOT analysis, investor-ready plans
5. **AI Shark** — Growing, unique bank debt financing focus, 10 AI criteria, SWOT, PDF export

## User Preferences

Preferred communication style: Simple, everyday language.

## ADA / WCAG 2.1 Accessibility Compliance
- **Skip navigation**: "Skip to main content" link on all pages (hidden until focused)
- **ARIA landmarks**: `role="banner"` on headers, `role="contentinfo"` on footers, `<nav aria-label>` for navigation
- **ARIA labels**: All icon-only buttons (logout, theme toggle, delete, dismiss, back) have descriptive `aria-label`
- **Decorative icons**: All decorative icons use `aria-hidden="true"` to hide from screen readers
- **Focus indicators**: Global `:focus-visible` outline style (2px solid ring color) for keyboard navigation
- **Form accessibility**: Labels linked via `htmlFor`, `aria-required`, `aria-describedby` for hints, `autoComplete` attributes
- **Loading states**: `role="status"` and `aria-live` regions with `sr-only` text for screen readers
- **Error alerts**: `role="alert"` on error messages and payment banners
- **Score visualization**: SVGs use `role="img"` and `aria-label` with text descriptions; progress bars use `role="progressbar"` with `aria-valuenow`/`aria-valuemax`
- **Star rating**: Uses `fieldset`/`legend` with `aria-pressed` on each star button
- **Color independence**: Scores include text labels ("Strong", "Moderate", "Needs improvement") alongside color coding
- **Semantic HTML**: Proper heading hierarchy, `<main>`, `<section>` with `aria-labelledby`, `<time>` elements, `<nav>` elements
- **Accessibility Toolbar**: Floating button (bottom-right) with text-to-speech (Web Speech API) and font size adjuster (Small 14px / Default 16px / Large 18px / Extra Large 20px), persisted via localStorage

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

### Weekly Expense Reports
- Expense data emailed to aisharkphd@gmail.com every Sunday at 10pm
- Calculates Stripe processing fees (2.9% + $0.30 per transaction)
- Groups expenses by payment type (subscription vs one-time)
- Shows total processing fees with transaction details
- CSV summary attachment included

### Weekly Site & Competitor Report
- Emailed to vemangum@gmail.com every Sunday at 8pm
- Admin endpoint: `POST /api/admin/trigger-site-report` (requires x-admin-key header)
- Includes: new users this week, assessment stats, revenue breakdown, customer feedback summary, new user list
- Competitor benchmark table (LivePlan, Enloop, IdeaProof, PrometAI vs AI Shark) by traffic rank
- Recommended actions for the following week based on gaps vs. competitors

## SEO & Discoverability
- **robots.txt**: Served at `/robots.txt` — allows public pages, blocks `/admin`, `/dashboard`, `/api`, `/payment/success`, `/verify-email`, `/register`. Blocks GPTBot/ClaudeBot/CCBot from training scrapers. Points to sitemap.
- **sitemap.xml**: Served at `/sitemap.xml` — dynamically generated, includes all 9 public pages with priority and changefreq.
- **Meta tags in `client/index.html`**:
  - SEO-optimized title and description targeting "business plan assessment", "bank loan business plan", "DSCR", "lender readiness grade"
  - Keyword meta tag, author, robots directives, canonical URL
  - Open Graph tags (Facebook, LinkedIn) — site name, type, URL, title, description, image
  - Twitter Card tags (summary_large_image)
  - Theme color, apple-touch-icon
- **JSON-LD Structured Data** (3 schemas in `client/index.html` for rich snippets):
  - `Organization` — company name, URL, logo, contact email
  - `SoftwareApplication` — application name, category, description, pricing offers ($13.99 one-time, $6.99/month subscription)
  - `FAQPage` — 5 FAQ entries (how it works, file types, pricing, lender grade explanation, disclaimer) — eligible for Google rich-result FAQ snippets

## Legal Pages
- **Privacy Policy**: Available at `/privacy` - covers data collection, usage, security
- **Terms of Service**: Available at `/terms` - covers pricing, refunds, liability, usage rules
- Both pages include the standard disclaimer about informational purposes only
- Required for Google AdSense approval and compliance

## Customer Feedback System
- **Contact Page**: Available at `/contact` - customers can submit feedback, bug reports, feature requests, support requests
- **Satisfaction Survey**: Appears after viewing assessment reports - 5-star rating with optional comments
- **Admin Monitoring**: Available at `/admin/feedback` - real-time dashboard with filtering, stats, and resolution tracking
- **Database Table**: `customer_feedback` stores all feedback entries
- **Fields**: email, name, feedback_type (general/bug/feature/support/satisfaction), subject, message, rating, assessment_id, resolved
- **Email Notifications**: New feedback triggers instant email notification to vemangum@gmail.com
- **API Endpoints**:
  - `POST /api/feedback` (public, no authentication required)
  - `GET /api/admin/feedback` (requires x-admin-key header)
  - `PATCH /api/admin/feedback/:id` (requires x-admin-key header) - update resolved status

## Advertising Revenue Tracking
- **Database Table**: `advertising_revenue` stores all ad revenue entries
- **Fields**: source (e.g., "Google AdSense"), amount (cents), impressions, clicks, report_date
- **Admin Endpoint**: `POST /api/admin/advertising-revenue` (requires x-admin-key header)
- **Weekly Revenue Report**: Includes advertising revenue alongside subscription/one-time payments
- **Ad Placement Component**: `client/src/components/AdPlacement.tsx` - ready for AdSense integration
- **Environment Variables for AdSense**:
  - `VITE_ADSENSE_ENABLED`: Set to "true" to enable ad placements
  - `VITE_ADSENSE_CLIENT_ID`: Your AdSense publisher ID (ca-pub-XXXXXXX)
  - `VITE_ADSENSE_SLOT_HEADER`: Ad slot ID for header banner
  - `VITE_ADSENSE_SLOT_SIDEBAR`: Ad slot ID for sidebar
  - `VITE_ADSENSE_SLOT_FOOTER`: Ad slot ID for footer
  - `VITE_ADSENSE_SLOT_IN_CONTENT`: Ad slot ID for in-content ads

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `openai`: OpenAI API client
- `pdf-parse`: PDF document text extraction
- `mammoth`: DOCX document text extraction
- `express`: HTTP server framework
- `multer`: File upload handling
- `react-dropzone`: Frontend file upload UI