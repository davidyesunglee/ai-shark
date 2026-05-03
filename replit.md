# AI Shark — Business Plan Assessor

## Overview
AI Shark is a professional web application (aishark.org) designed to evaluate business plans against bank debt financing criteria. It uses Gemini AI to provide comprehensive assessments, including an overall score, a 10-dimension criteria breakdown, SWOT analysis, market analysis, key financial ratios, and actionable recommendations. The project aims to provide a unique focus on bank debt financing, offering PDF export of full reports.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend uses React with TypeScript and Vite. It employs Wouter for routing, TanStack React Query for state management, and `shadcn/ui` (built on Radix UI) for UI components. Styling is handled by Tailwind CSS with a professional banking aesthetic, including the Inter font family and custom data visualization components like ScoreRing and ScoreBar. Accessibility features include ADA / WCAG 2.1 compliance with skip navigation, ARIA landmarks, focus indicators, semantic HTML, and an accessibility toolbar with text-to-speech and font size adjustment.

### Backend Architecture
The backend is built with Node.js and Express, written in TypeScript with ES modules. It provides RESTful APIs, uses Multer for handling multipart file uploads (max 10MB), and integrates `pdf-parse` for PDF and `mammoth` for DOCX document parsing.

### Data Storage
PostgreSQL is used as the primary database, managed with Drizzle ORM. Key tables include `users` and `assessments`. Drizzle Kit is used for database migrations.

### AI Integration
The system integrates with the OpenAI API for core business plan analysis, generating structured assessment data, scores, and recommendations.

### Authentication System
The application features an email/password authentication system using `bcryptjs` for password hashing and `express-session` with a PostgreSQL store for session management. Optional email verification is also implemented.

### Payment System (Stripe Integration)
Stripe is integrated for payment processing, supporting free, monthly subscription, and one-time payment tiers. It uses `stripe-replit-sync` for webhook handling and directly fetches product information from the Stripe API. Payment enforcement is applied, with credit deduction post-upload and monthly resets for subscriptions.

### Reporting and Tracking
The system includes functionality for tracking site visits and CTA clicks, storing data in a `site_events` table with SHA-256 hashed IPs. Weekly reports for user registrations, transactions, revenue, expenses, site visits, clicks, and a competitive analysis are generated and emailed.

### SEO & Discoverability
Comprehensive SEO features include `robots.txt`, a dynamic `sitemap.xml`, meta tags for all public pages, Open Graph and Twitter Card tags, and rich snippets via JSON-LD structured data for `Organization`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, `HowTo`, `WebSite` with `SearchAction`, and `Service` schemas.

### Customer Feedback System
A customer feedback system allows users to submit feedback, bug reports, feature requests, and support queries via a contact page and satisfaction surveys. Feedback is stored in a `customer_feedback` table, with admin monitoring and email notifications for new entries.

## External Dependencies

- **PostgreSQL**: Primary database for data storage.
- **OpenAI API**: Used for AI-powered business plan analysis and scoring.
- **Resend**: Email service for sending weekly registration reports and various financial reports.
- **Stripe**: Payment processing gateway for subscriptions and one-time purchases.