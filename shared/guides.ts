export interface GuideSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  category: string;
  readTime: string;
  updated: string;
  intro: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
}

export const guides: Guide[] = [
  {
    slug: "how-to-improve-dscr",
    title: "How to Improve Your DSCR (Debt Service Coverage Ratio) | AI Shark",
    h1: "How to Improve Your DSCR for a Business Loan",
    metaDescription:
      "Your debt service coverage ratio (DSCR) is the single most important number banks look at. Learn what a good DSCR is and seven practical ways to raise it before you apply.",
    category: "Cash Flow",
    readTime: "6 min read",
    updated: "June 2026",
    intro:
      "If a bank turns down a loan for one number, it is usually the debt service coverage ratio (DSCR). It tells the lender whether your business actually generates enough cash to make its loan payments. Here is exactly how it works and how to improve it before you apply.",
    sections: [
      {
        heading: "What is DSCR and why banks care so much",
        paragraphs: [
          "DSCR compares the cash your business produces to the debt payments it owes. The formula is simple: Net Operating Income divided by Total Debt Service (all principal and interest due in a year).",
          "A DSCR of 1.0x means you make exactly enough to cover your payments with nothing left over. Most banks want at least 1.25x, meaning you generate 25% more cash than you need. That cushion is what protects the lender if sales dip, so it protects your approval odds too.",
        ],
      },
      {
        heading: "What counts as a good DSCR",
        bullets: [
          "1.5x or higher — Excellent. Strong cushion, best loan terms.",
          "1.25x to 1.49x — Good. This is the typical bank minimum.",
          "1.0x to 1.24x — Marginal. Expect extra collateral or a higher rate.",
          "Below 1.0x — The loan is not serviceable as presented.",
        ],
      },
      {
        heading: "Seven ways to improve your DSCR before you apply",
        bullets: [
          "Increase net operating income — even small margin gains raise the top of the ratio.",
          "Cut or defer discretionary expenses so more cash flows to the bottom line.",
          "Refinance or extend existing debt to lower your annual debt service.",
          "Pay down a high-interest balance to shrink the interest portion of your payments.",
          "Request a longer loan term — a smaller monthly payment lifts DSCR immediately.",
          "Add a co-borrower or guarantor whose income strengthens the coverage.",
          "Time your application after a strong quarter so trailing cash flow looks its best.",
        ],
      },
      {
        heading: "Show DSCR the way a lender wants to see it",
        paragraphs: [
          "Do not just state a number. Include 12 to 24 months of projected monthly cash flow and show that DSCR stays above 1.25x even in a conservative scenario where revenue comes in 10 to 20% lower than expected.",
          "Lenders stress-test your projections. If you have already done it for them and the ratio holds, you remove their biggest objection before they raise it.",
        ],
      },
    ],
    faqs: [
      {
        q: "What DSCR do most banks require?",
        a: "Most commercial lenders want a minimum DSCR of 1.25x, though some SBA and specialty programs accept 1.15x with additional collateral or a guarantee.",
      },
      {
        q: "Is DSCR more important than profit?",
        a: "For loan approval, usually yes. A business can be profitable on paper but still fail to make payments due to timing of cash. DSCR measures actual ability to service debt.",
      },
      {
        q: "How quickly can I improve my DSCR?",
        a: "Refinancing to a longer term or paying down high-interest debt can lift DSCR almost immediately. Improving operating income takes longer but is the most durable fix.",
      },
    ],
  },
  {
    slug: "why-banks-reject-business-loans",
    title: "Why Banks Reject Business Loans — 8 Common Reasons | AI Shark",
    h1: "Why Banks Reject Business Loans (and How to Avoid It)",
    metaDescription:
      "Most business loan rejections come down to a short list of fixable problems. Learn the eight most common reasons banks say no — and how to fix each one before you apply.",
    category: "Getting Approved",
    readTime: "7 min read",
    updated: "June 2026",
    intro:
      "Loan rejections rarely come out of nowhere. Lenders decline applications for a predictable set of reasons, and almost all of them can be fixed before you apply. Here are the eight most common ones.",
    sections: [
      {
        heading: "The eight reasons banks say no",
        bullets: [
          "Weak cash flow — the debt service coverage ratio is below the bank's minimum (usually 1.25x).",
          "Low credit score — a personal FICO below about 680 raises immediate concern.",
          "Too little collateral — the loan-to-value on pledged assets is higher than the bank allows.",
          "High existing debt — a debt-to-equity ratio above 2:1 signals the business is over-leveraged.",
          "Thin or unrealistic projections — numbers with no supporting assumptions read as guesswork.",
          "Not enough owner equity — banks want to see the owner has real money at stake, typically 20% or more.",
          "Short operating history — startups without a track record are harder to underwrite.",
          "Industry risk — some sectors face higher scrutiny regardless of how strong the business is.",
        ],
      },
      {
        heading: "How to fix the fixable ones",
        paragraphs: [
          "Most of these are within your control. Improve cash flow and DSCR by trimming expenses or extending existing debt. Raise your credit score by paying down balances below 30% utilization. Document collateral with professional appraisals. Increase your equity contribution to show commitment.",
          "For the harder ones — short history or industry risk — the answer is transparency. Acknowledge the risk in your plan and show a concrete mitigation strategy. Lenders respect founders who name problems and solve them.",
        ],
      },
      {
        heading: "Catch the problems before the bank does",
        paragraphs: [
          "Nearly every rejection reason maps to a specific criterion lenders score. If you can see your own plan through that same lens first, you can fix the weak spots before an underwriter ever sees them.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I reapply after a rejection?",
        a: "Yes. Ask the lender for the specific reason, fix it, and reapply — often to a different lender. A documented improvement (higher DSCR, more collateral, better credit) materially changes the outcome.",
      },
      {
        q: "Does one rejection hurt my credit?",
        a: "A single hard inquiry has a small, temporary effect. Many applications in a short window matter more, so fix the underlying issue before shopping widely.",
      },
      {
        q: "What is the fastest thing to fix?",
        a: "Usually credit utilization and documentation. Paying down revolving balances and adding appraisals or letters of intent can be done in weeks, not months.",
      },
    ],
  },
  {
    slug: "credit-score-for-business-loan",
    title: "What Credit Score Do You Need for a Business Loan? | AI Shark",
    h1: "What Credit Score Do You Need for a Business Loan?",
    metaDescription:
      "Banks look at both personal and business credit. Learn the credit score ranges lenders expect for business loans and how to strengthen your profile before applying.",
    category: "Creditworthiness",
    readTime: "5 min read",
    updated: "June 2026",
    intro:
      "There is no single magic number, but there are clear ranges lenders use. Banks evaluate both your personal credit and your business credit, and where you fall determines your rate, your terms, and often whether you are approved at all.",
    sections: [
      {
        heading: "The scores lenders actually look at",
        bullets: [
          "Personal FICO — most small business loans still rely heavily on the owner's personal score. Aim for 680 or higher.",
          "Business credit (Dun & Bradstreet PAYDEX, Experian, Equifax) — a track record of paying suppliers and creditors on time.",
          "Payment history — late payments, defaults, and collections weigh heavily.",
          "Public records — bankruptcies, liens, and judgments are major red flags.",
        ],
      },
      {
        heading: "What the ranges mean",
        bullets: [
          "720+ — Strong. Best rates and highest approval odds.",
          "680 to 719 — Good. Most conventional bank loans are accessible.",
          "620 to 679 — Fair. Approval is possible but expect higher rates or extra collateral.",
          "Below 620 — Difficult. Consider SBA programs, secured loans, or credit repair first.",
        ],
      },
      {
        heading: "How to strengthen your credit before applying",
        bullets: [
          "Pull your reports and dispute any errors — mistakes are common and fixable.",
          "Pay down revolving balances to below 30% of your limits.",
          "Avoid opening new accounts in the months before you apply.",
          "Establish business credit by putting supplier accounts and a business card in the company's name and paying on time.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do banks check personal or business credit?",
        a: "For most small business loans, both. The owner's personal FICO carries significant weight, especially for younger businesses without an established business credit history.",
      },
      {
        q: "Can I get a business loan with a 600 credit score?",
        a: "It is harder but not impossible. SBA loans, secured loans, and some online lenders work with lower scores, usually at higher rates or with more collateral.",
      },
      {
        q: "How long does it take to raise a credit score?",
        a: "Paying down balances can show results in one to two billing cycles. Rebuilding after a default or bankruptcy takes longer, often a year or more of consistent on-time payments.",
      },
    ],
  },
  {
    slug: "business-plan-for-bank-loan",
    title: "How to Write a Business Plan That Gets Bank Financing | AI Shark",
    h1: "How to Write a Business Plan That Gets Bank Financing",
    metaDescription:
      "A business plan for a bank is different from a pitch to investors. Learn what lenders look for and how to structure a plan that answers their questions before they ask.",
    category: "Business Planning",
    readTime: "8 min read",
    updated: "June 2026",
    intro:
      "Investors bet on upside. Banks protect against downside. A business plan written to raise venture money often fails at the bank because it emphasizes the wrong things. Here is how to write a plan a lender wants to approve.",
    sections: [
      {
        heading: "What a lender needs to see",
        paragraphs: [
          "A bank is answering one question: will this business reliably repay the loan? Every section of your plan should build toward a confident yes. That means leading with cash flow, debt capacity, and risk management — not just growth and vision.",
        ],
        bullets: [
          "A clear statement of how much you need and exactly how it will be used.",
          "Cash flow projections that keep DSCR above 1.25x, including a conservative scenario.",
          "Collateral and owner equity that show real skin in the game.",
          "A management team with relevant, documented experience.",
          "An honest look at risks with concrete mitigation plans.",
        ],
      },
      {
        heading: "A structure lenders respond to",
        bullets: [
          "Executive summary — the loan amount, use of funds, and repayment source in one page.",
          "Company and management overview — who runs it and why they can execute.",
          "Market and competition — sized with credible third-party data, not anecdotes.",
          "Financials — three to five year projections plus monthly cash flow for years one and two.",
          "Risk and contingency — the threats you see and how you will handle them.",
        ],
      },
      {
        heading: "Common mistakes that sink an application",
        bullets: [
          "Hockey-stick revenue with no assumptions behind it.",
          "No monthly cash flow, so the bank cannot verify DSCR.",
          "Ignoring obvious weaknesses instead of addressing them.",
          "Vague use of funds — lenders want line items, not a lump sum.",
          "Overstating market size without citing a source.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long should a business plan for a bank be?",
        a: "Long enough to answer the lender's questions and no longer — typically 15 to 30 pages plus a financial appendix. Clarity beats length.",
      },
      {
        q: "Do I need audited financials?",
        a: "Not usually for smaller loans, but you need clean, well-organized statements and defensible assumptions. Larger loans may require reviewed or audited financials.",
      },
      {
        q: "How much owner equity do banks expect?",
        a: "Commonly 20% or more of total project cost. Owner investment signals commitment and reduces the lender's risk.",
      },
    ],
  },
  {
    slug: "collateral-for-business-loan",
    title: "How Much Collateral Do You Need for a Business Loan? | AI Shark",
    h1: "How Much Collateral Do You Need for a Business Loan?",
    metaDescription:
      "Collateral reduces a lender's risk and can make or break your approval. Learn how banks value collateral, what loan-to-value ratios to expect, and how to present your assets.",
    category: "Collateral",
    readTime: "6 min read",
    updated: "June 2026",
    intro:
      "Collateral is what the bank can sell to recover its money if the loan is not repaid. The more liquid and stable your collateral, the more a lender will offer and the better your terms. Here is how it works.",
    sections: [
      {
        heading: "How banks value collateral",
        paragraphs: [
          "Lenders do not lend against the full value of an asset. They apply a loan-to-value (LTV) ratio that accounts for how quickly and reliably the asset could be sold. Real estate might support 70 to 80% LTV, while inventory or equipment supports much less.",
        ],
        bullets: [
          "Real estate — typically 70 to 80% of appraised value.",
          "Equipment — often 50 to 70%, depending on age and resale market.",
          "Accounts receivable — commonly 70 to 80% of eligible invoices.",
          "Inventory — usually 50% or less because it is harder to liquidate.",
        ],
      },
      {
        heading: "How much you actually need",
        paragraphs: [
          "There is no fixed percentage, but many banks want collateral coverage at or near the loan amount, adjusted by LTV. SBA loans generally require collateral for loans above $25,000, though a shortfall alone will not cause a decline if cash flow is strong.",
        ],
      },
      {
        heading: "How to present collateral to a lender",
        bullets: [
          "Get professional appraisals for major assets before you apply.",
          "List every asset with its fair market value and any existing liens.",
          "Disclose encumbrances honestly — a hidden lien discovered later kills trust.",
          "Offer a mix of assets to strengthen coverage if any single item is illiquid.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I get a business loan with no collateral?",
        a: "Sometimes. Unsecured and cash-flow-based loans exist, but they typically require strong credit and DSCR and carry higher rates. Most bank term loans expect some collateral.",
      },
      {
        q: "Does a personal guarantee count as collateral?",
        a: "A personal guarantee is not collateral itself, but it gives the lender a claim on your personal assets. Many small business loans require one in addition to business collateral.",
      },
      {
        q: "What if my collateral is worth less than the loan?",
        a: "A collateral shortfall can be offset by strong cash flow, a larger equity contribution, or a guarantee. Lenders weigh the whole picture, not collateral alone.",
      },
    ],
  },
  {
    slug: "debt-to-equity-ratio-business-loan",
    title: "Debt-to-Equity Ratio for Business Loans, Explained | AI Shark",
    h1: "Debt-to-Equity Ratio for Business Loans, Explained",
    metaDescription:
      "The debt-to-equity ratio tells lenders how leveraged your business is. Learn what ratio banks prefer, why owner equity matters, and how to strengthen your capital structure.",
    category: "Capital Structure",
    readTime: "5 min read",
    updated: "June 2026",
    intro:
      "The debt-to-equity (D/E) ratio shows how much of your business is funded by borrowing versus your own money. Lenders use it to judge how much risk they are taking on. A high ratio means more risk for them — and tougher approval for you.",
    sections: [
      {
        heading: "How the ratio works",
        paragraphs: [
          "D/E is total liabilities divided by total shareholders' equity. A ratio of 2:1 means you owe two dollars for every dollar of equity in the business. The higher the ratio, the more your fixed debt payments depend on revenue holding up.",
        ],
      },
      {
        heading: "What banks want to see",
        bullets: [
          "Below 1.0x — Conservative. Low leverage, strong position.",
          "1.0x to 2.0x — Moderate. Generally acceptable for most industries.",
          "Above 2.0x — Elevated. Expect extra scrutiny or a request for more equity.",
          "Owner equity of 20 to 30% of total capital is a strong trust signal.",
        ],
      },
      {
        heading: "How to improve your capital structure",
        bullets: [
          "Contribute more owner equity to lower the ratio directly.",
          "Retain earnings instead of taking distributions before you apply.",
          "Pay down or refinance short-term debt into longer, more manageable terms.",
          "Bring in a partner or investor if additional equity is needed.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is a good debt-to-equity ratio for a small business?",
        a: "Most banks prefer below 2:1, though acceptable levels vary by industry. Capital-intensive businesses may carry more debt; service businesses are usually expected to carry less.",
      },
      {
        q: "Why does owner equity matter so much?",
        a: "It shows the owner has real money at risk. Lenders are more comfortable extending credit when the owner shares the downside, not just the upside.",
      },
      {
        q: "Does the interest coverage ratio matter too?",
        a: "Yes. Banks also look at EBIT divided by interest expense, typically wanting 3x or more, to confirm you can comfortably cover interest payments.",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export const guideSlugs = guides.map((g) => g.slug);
