# Business Plan Assessment Application - Design Guidelines

## Design Approach

**Selected Framework:** Design System Approach combining Material Design principles with Linear's clean aesthetics and professional financial software patterns.

**Rationale:** This is a utility-focused, information-dense professional tool where clarity, trust, and efficiency are paramount. The design should convey credibility while making complex financial data easily digestible.

**Core Principles:**
- Professional banking credibility
- Data clarity through visual hierarchy
- Efficient task completion workflows
- Trust-building through polished, consistent UI

## Typography

**Font Stack:**
- Primary: Inter (Google Fonts) - Clean, professional, excellent readability
- Monospace: JetBrains Mono - For financial figures and data displays

**Hierarchy:**
- Page titles: text-3xl font-semibold (32px)
- Section headers: text-2xl font-semibold (24px)
- Subsections: text-xl font-medium (20px)
- Body text: text-base (16px)
- Labels/captions: text-sm text-gray-600 (14px)
- Financial data: text-lg font-mono font-medium (18px monospace)

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-6 or p-8
- Section spacing: mb-8 or mb-12
- Card gaps: gap-6
- Form fields: space-y-4

**Grid Structure:**
- Dashboard: 12-column grid (grid-cols-12) with responsive breakpoints
- Max container width: max-w-7xl mx-auto
- Content areas: px-6 lg:px-8

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with logo left, navigation center, user profile right
- Height: h-16
- Clean horizontal nav links with subtle hover states
- Upload button prominently placed (primary CTA)

### Dashboard Layout
**Three-column information architecture:**
1. Sidebar (240px): Quick filters, recent assessments list
2. Main content area (fluid): Assessment cards grid or detail view
3. Right panel (300px, collapsible): Summary statistics, quick actions

### Assessment Cards
**Card Design:**
- Elevated shadow: shadow-md hover:shadow-lg
- Rounded corners: rounded-lg
- Padding: p-6
- Top section: Business plan name + upload date
- Middle: Score visualization (large circular progress or horizontal bar)
- Bottom: Status badge + action buttons
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

### File Upload Interface
**Drag-and-drop Zone:**
- Large, inviting drop area: min-h-64
- Dashed border: border-2 border-dashed border-gray-300
- Center-aligned icon (upload cloud) and instructional text
- Supported formats clearly listed below
- Hover state: border-blue-500 bg-blue-50

### Scoring Display
**Score Visualization:**
- Overall score: Large circular progress ring (100-point scale)
- Category breakdown: Horizontal bar charts with labels and percentages
- Each criterion displayed as separate row with visual indicator
- Red (0-50), yellow (51-74), green (75-100) semantic scoring

### Assessment Report View
**Multi-section Layout:**
1. Header: Business plan name, overall score (large), date assessed
2. Executive summary card: Key highlights at-a-glance
3. Detailed criteria section: 6 expandable accordion panels
   - Creditworthiness
   - Cash Flow Analysis
   - Collateral Assessment
   - Debt-to-Equity Ratio
   - Market Viability
   - Management Team
4. Strengths/Weaknesses: Two-column layout with bullet points
5. Recommendations: Numbered list with actionable items

### Data Tables
**Financial Metrics Display:**
- Clean table design with alternating row backgrounds
- Sticky headers on scroll
- Right-aligned numerical data
- Bold totals/summaries
- Sortable columns with subtle indicators

### Form Elements
**Consistent Input Styling:**
- Height: h-10 for inputs, h-32 for textareas
- Border: border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
- Rounded: rounded-md
- Labels above inputs: text-sm font-medium mb-2
- Help text below: text-xs text-gray-500

### Buttons
**Primary Action:** Blue background, white text, medium font-weight
**Secondary Action:** White background, border, default text
**Sizes:** h-10 px-6 (default), h-8 px-4 (small)
**States:** Hover brightness adjustment, active scale-95

### Status Badges
**Pill-shaped Indicators:**
- Padding: px-3 py-1
- Border radius: rounded-full
- Font: text-xs font-medium
- States: "Analyzing" (blue), "Complete" (green), "Needs Review" (yellow), "Failed" (red)

### Charts (Recharts)
**Financial Visualization:**
- Line charts: Debt service coverage trends
- Bar charts: Category score comparisons
- Pie charts: Avoid (use donut charts instead for better readability)
- Consistent axis labels and legends
- Tooltips on hover with precise values

## Images

No hero images for this application. This is a professional dashboard tool focused on functionality over marketing appeal.

**Icon Usage:**
- Material Icons via CDN for UI elements
- Document icons for file types (PDF, DOCX, TXT)
- Chart/graph icons for analytics sections
- Upload cloud icon for drag-drop area
- Checkmarks/warnings for scoring indicators

## Key Interactions

- Smooth page transitions (no jarring animations)
- Subtle hover states on cards and buttons
- Loading spinners during AI analysis (indeterminate progress)
- Toast notifications for upload success/errors (top-right, auto-dismiss)
- Expandable/collapsible sections with smooth height transitions (duration-200)

## Professional Trust Elements

- Consistent spacing creates rhythm and polish
- Generous whitespace around critical data
- Clear visual hierarchy guides attention
- Numerical precision (2 decimal places for percentages, currency formatting)
- Professional business terminology throughout
- Confidence-building micro-copy ("Bank-grade assessment", "AI-powered analysis")