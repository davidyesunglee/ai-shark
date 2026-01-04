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

### Third-Party Services
- **OpenAI API**: Powers the business plan analysis and scoring
- **PostgreSQL**: Primary data storage (can be provisioned via Replit)

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `openai`: OpenAI API client
- `pdf-parse`: PDF document text extraction
- `mammoth`: DOCX document text extraction
- `express`: HTTP server framework
- `multer`: File upload handling
- `react-dropzone`: Frontend file upload UI