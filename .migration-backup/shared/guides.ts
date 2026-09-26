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
  {
    slug: "sba-loan-requirements",
    title: "SBA Loan Requirements: What You Need to Qualify | AI Shark",
    h1: "SBA Loan Requirements: What You Actually Need to Qualify",
    metaDescription:
      "A plain-language checklist of SBA loan requirements — credit score, time in business, down payment, cash flow, and the documents lenders ask for before they say yes.",
    category: "Getting Approved",
    readTime: "7 min read",
    updated: "July 2026",
    intro:
      "SBA loans offer some of the best terms a small business can get, but the approval bar is specific. The good news is that the requirements are predictable. Here is exactly what lenders check and how to know if you are ready before you apply.",
    sections: [
      {
        heading: "The core eligibility requirements",
        bullets: [
          "For-profit business operating in the United States.",
          "You have invested your own time or money into the business (owner equity at stake).",
          "You have exhausted other reasonable financing options first.",
          "The business qualifies as a small business under SBA size standards for its industry.",
          "No unresolved defaults or delinquencies on existing government debt.",
        ],
      },
      {
        heading: "The numbers lenders look at",
        bullets: [
          "Personal credit score — most SBA lenders want roughly 680 or higher.",
          "Time in business — two or more years is ideal; startups can qualify but face more scrutiny.",
          "Down payment — expect to contribute around 10% of the project cost from your own funds.",
          "Debt service coverage ratio (DSCR) — generally 1.15x to 1.25x or better.",
          "A clear, documented plan for how the loan will be repaid.",
        ],
      },
      {
        heading: "Documents you will need to prepare",
        bullets: [
          "Business and personal tax returns (usually three years).",
          "Year-to-date financial statements — profit and loss plus balance sheet.",
          "A business plan with realistic financial projections.",
          "A personal financial statement for each owner of 20% or more.",
          "Business licenses, entity documents, and any lease agreements.",
        ],
      },
      {
        heading: "How to know if you are ready",
        paragraphs: [
          "Before you spend weeks assembling a package, check the numbers a lender will run: your DSCR, credit profile, collateral coverage, and debt-to-equity ratio. If any of these fall short, it is far cheaper to fix them now than to be declined and wait months to reapply.",
          "That is exactly the kind of pre-check AI Shark runs on your plan — scoring it against the same criteria a loan officer uses so you know where you stand before you apply.",
        ],
      },
    ],
    faqs: [
      {
        q: "What credit score do I need for an SBA loan?",
        a: "Most SBA lenders look for a personal credit score around 680 or higher, though some programs and lenders will consider lower scores with strong cash flow and collateral.",
      },
      {
        q: "How much down payment does an SBA loan require?",
        a: "A typical SBA loan asks the borrower to contribute about 10% of the total project cost, though this varies by loan type and the strength of the application.",
      },
      {
        q: "Can a startup get an SBA loan?",
        a: "Yes, but startups face more scrutiny. A strong business plan, solid personal credit, industry experience, and a meaningful equity contribution all improve a startup's odds.",
      },
    ],
  },
  {
    slug: "business-loan-down-payment",
    title: "Business Loan Down Payment: How Much Do You Need? | AI Shark",
    h1: "How Much Down Payment Do You Need for a Business Loan?",
    metaDescription:
      "How much money you need to put down for a business loan, why lenders require owner equity, and how to strengthen your application if your down payment is thin.",
    category: "Getting Approved",
    readTime: "5 min read",
    updated: "July 2026",
    intro:
      "One of the first questions a lender asks is how much of your own money you are putting in. This is your down payment, or owner equity, and it tells the bank you share the risk. Here is how much you typically need and why it matters so much.",
    sections: [
      {
        heading: "Typical down payment ranges",
        bullets: [
          "SBA loans — usually around 10% of the total project cost.",
          "Conventional term loans — often 15% to 25%, depending on risk and collateral.",
          "Commercial real estate — commonly 20% to 30%.",
          "Equipment financing — sometimes as low as 0% to 20%, since the equipment itself is collateral.",
        ],
      },
      {
        heading: "Why lenders require owner equity",
        paragraphs: [
          "When you put your own money in, you have something to lose if the business struggles. Lenders call this having 'skin in the game,' and it dramatically lowers the risk they take on.",
          "A larger down payment also reduces the loan amount, which improves your debt service coverage ratio and your loan-to-value — two numbers that directly affect approval and your interest rate.",
        ],
      },
      {
        heading: "What to do if your down payment is thin",
        bullets: [
          "Show strong, stable cash flow to offset a smaller equity contribution.",
          "Offer additional collateral to lower the lender's loan-to-value risk.",
          "Bring in a partner or investor to strengthen the equity position.",
          "Consider an SBA program, which generally requires less money down.",
          "Wait a few months to build cash reserves if the timing allows.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do all business loans require a down payment?",
        a: "Not all. Some lines of credit and equipment loans require little or nothing down, but most term loans and real estate loans expect a meaningful owner contribution.",
      },
      {
        q: "Is a bigger down payment always better?",
        a: "A larger down payment usually means better terms and easier approval, but keep enough cash in reserve to run the business. Lenders want to see working capital, not an empty account.",
      },
      {
        q: "Can I use a loan as my down payment?",
        a: "Generally no. Lenders want to see that the equity comes from your own funds, not borrowed money, because borrowed equity does not reduce their risk.",
      },
    ],
  },
  {
    slug: "financial-projections-for-business-loan",
    title: "How to Write Financial Projections for a Business Loan | AI Shark",
    h1: "How to Write Financial Projections Lenders Will Trust",
    metaDescription:
      "Learn how to build financial projections for a business loan that banks actually believe — what to include, how far out to forecast, and the mistakes that get plans rejected.",
    category: "Financial Projections",
    readTime: "7 min read",
    updated: "July 2026",
    intro:
      "Weak or unrealistic projections are one of the most common reasons banks decline a loan. A lender does not need a fantasy of hockey-stick growth — they need believable numbers backed by clear assumptions. Here is how to build projections that hold up.",
    sections: [
      {
        heading: "What your projections must include",
        bullets: [
          "A monthly cash flow forecast for the first 12 to 24 months.",
          "Projected profit and loss statements for three years.",
          "A projected balance sheet showing assets, liabilities, and equity.",
          "Clearly stated assumptions behind every major number.",
          "A break-even analysis showing when the business covers its costs.",
        ],
      },
      {
        heading: "Ground every number in an assumption",
        paragraphs: [
          "The fastest way to lose a lender's trust is a revenue line with no explanation. For every projection, state where the number comes from: your pricing, expected units sold, your sales pipeline, or comparable businesses.",
          "Lenders are far more comfortable with modest growth they understand than aggressive growth they cannot verify. Conservative and defensible beats optimistic and vague every time.",
        ],
      },
      {
        heading: "Stress-test your own forecast",
        paragraphs: [
          "Before a bank does it, run a downside scenario where revenue comes in 10 to 20% below plan. Show that you can still cover your loan payments — that your debt service coverage ratio stays above 1.25x even when things go worse than expected.",
          "When you present the stress test yourself, you answer the lender's biggest worry before they raise it.",
        ],
      },
      {
        heading: "Common projection mistakes to avoid",
        bullets: [
          "Growth rates with no basis in your actual sales history or market.",
          "Forgetting to include loan payments in the cash flow forecast.",
          "Understating expenses to make the bottom line look better.",
          "Round, suspiciously smooth numbers that look estimated rather than calculated.",
          "No connection between the projections and the rest of the business plan.",
        ],
      },
    ],
    faqs: [
      {
        q: "How many years of projections do banks want?",
        a: "Most lenders want three years of projected profit and loss and balance sheet figures, with the first one to two years broken down month by month.",
      },
      {
        q: "Should my projections show a profit right away?",
        a: "Not necessarily. Lenders understand many businesses take time to become profitable. What matters is that your cash flow can cover the loan payments throughout, even during the ramp-up.",
      },
      {
        q: "What makes projections believable to a lender?",
        a: "Clear assumptions behind every number, consistency with your business plan and market, and a conservative downside scenario that still services the debt.",
      },
    ],
  },
  {
    slug: "startup-business-loan-no-revenue",
    title: "How to Get a Startup Business Loan With Little or No Revenue | AI Shark",
    h1: "Getting a Startup Business Loan With Little or No Revenue",
    metaDescription:
      "Startups without revenue can still get funded. Learn what lenders look at when there is no track record and how to build an application strong enough to overcome it.",
    category: "Getting Approved",
    readTime: "6 min read",
    updated: "July 2026",
    intro:
      "Lending to a business with no revenue history is riskier for a bank, so the bar is higher — but it is not impossible. When there is no track record to lean on, lenders weigh other factors more heavily. Here is what actually moves the needle.",
    sections: [
      {
        heading: "What lenders look at when there is no revenue",
        bullets: [
          "Your personal credit score and financial history.",
          "The owner's industry experience and management track record.",
          "The size of your own equity contribution.",
          "Collateral you can pledge to secure the loan.",
          "A detailed, credible business plan with realistic projections.",
        ],
      },
      {
        heading: "Ways to strengthen a no-revenue application",
        paragraphs: [
          "Because you cannot show trailing cash flow, you have to compensate elsewhere. A strong personal credit score, a meaningful down payment, and pledged collateral all reduce the lender's risk and can offset the lack of revenue.",
          "Your business plan carries more weight than usual. It needs to prove you understand your market, your costs, and exactly how the loan turns into revenue and repayment.",
        ],
      },
      {
        heading: "Financing options better suited to startups",
        bullets: [
          "SBA loans, which are designed to support businesses banks might otherwise decline.",
          "Equipment financing, where the equipment itself serves as collateral.",
          "Business credit cards or a small line of credit to build a track record.",
          "Microloans from community and nonprofit lenders.",
          "Loans backed by a co-signer or guarantor with strong finances.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I get a business loan with no revenue?",
        a: "Yes, but you will need to make up for it with strong personal credit, industry experience, collateral, a solid down payment, and a credible business plan.",
      },
      {
        q: "How much do I need to put down as a startup?",
        a: "Startups are often asked for a larger equity contribution than established businesses. Putting in more of your own money signals commitment and lowers the lender's risk.",
      },
      {
        q: "Is an SBA loan good for a startup?",
        a: "SBA loans are one of the most startup-friendly options because the government guarantee lets lenders approve businesses they might otherwise consider too risky.",
      },
    ],
  },
  {
    slug: "business-line-of-credit-vs-term-loan",
    title: "Business Line of Credit vs Term Loan: Which Is Right? | AI Shark",
    h1: "Business Line of Credit vs Term Loan: Which Do You Need?",
    metaDescription:
      "Understand the difference between a business line of credit and a term loan, when to use each, and how lenders evaluate you for both — in plain language.",
    category: "Loan Types",
    readTime: "5 min read",
    updated: "July 2026",
    intro:
      "A line of credit and a term loan solve different problems. Choosing the right one makes your application stronger and your financing cheaper. Here is how they differ and when each one makes sense.",
    sections: [
      {
        heading: "How they work",
        paragraphs: [
          "A term loan gives you a lump sum up front that you repay in fixed installments over a set period. It is built for a specific, one-time purpose like buying equipment, real estate, or funding an expansion.",
          "A line of credit gives you a credit limit you can draw from as needed, repay, and draw from again. You only pay interest on what you use. It is built for ongoing or unpredictable needs like managing cash flow or covering short-term gaps.",
        ],
      },
      {
        heading: "When to use each",
        bullets: [
          "Term loan — a large, planned purchase with a clear payback timeline.",
          "Term loan — when you want predictable, fixed monthly payments.",
          "Line of credit — smoothing out seasonal or uneven cash flow.",
          "Line of credit — covering short-term expenses while you wait on receivables.",
          "Line of credit — keeping flexible access to funds for emergencies.",
        ],
      },
      {
        heading: "How lenders evaluate you for each",
        paragraphs: [
          "For both, lenders check the same core factors: cash flow, credit, collateral, and how much debt you already carry. A term loan puts more weight on your long-term repayment ability and collateral, since the balance is large and fixed.",
          "A line of credit puts more weight on your ongoing cash flow and how you manage working capital, because the lender is betting on your ability to draw and repay responsibly over time.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is a line of credit or a term loan easier to get?",
        a: "It depends on your finances. Lines of credit often suit businesses with steady cash flow, while term loans favor those with strong collateral and a clear repayment plan for a specific purpose.",
      },
      {
        q: "Can I have both at the same time?",
        a: "Yes. Many businesses use a term loan for a major purchase and keep a line of credit available for day-to-day cash flow needs.",
      },
      {
        q: "Which is cheaper?",
        a: "Term loans often carry lower interest rates for large, secured amounts, while a line of credit can be cheaper for short-term needs because you only pay interest on what you draw.",
      },
    ],
  },
  {
    slug: "good-dscr-for-sba-loan",
    title: "What Is a Good DSCR for an SBA Loan? | AI Shark",
    h1: "What Is a Good DSCR for an SBA Loan?",
    metaDescription:
      "SBA lenders generally want a DSCR of at least 1.15x, and most prefer 1.25x or higher. Learn the exact benchmarks for SBA 7(a) and 504 loans and how to hit them.",
    category: "SBA Loans",
    readTime: "5 min read",
    updated: "July 2026",
    intro:
      "The SBA itself sets a lower bar than most banks — but the bank still has to approve you first. Here are the real DSCR benchmarks SBA lenders use for 7(a) and 504 loans, and what to do if you fall short.",
    sections: [
      {
        heading: "The short answer: 1.15x minimum, 1.25x to be competitive",
        paragraphs: [
          "SBA Standard Operating Procedures require a debt service coverage ratio of at least 1.15x on 7(a) loans, measured on the business's historical or projected cash flow. That is the floor, not the target.",
          "In practice, most SBA lenders underwrite to their own credit policy, which usually mirrors conventional standards: 1.25x or better. A file at 1.15x can be approved, but expect more scrutiny, more collateral discussion, and slower processing.",
        ],
      },
      {
        heading: "Benchmarks by loan program",
        bullets: [
          "SBA 7(a) — 1.15x SBA minimum; most lenders want 1.25x+ on projections and 1.15x+ on trailing twelve months.",
          "SBA 504 — typically 1.15x–1.25x on the combined bank and CDC debt, with real estate cash flow doing the heavy lifting.",
          "SBA microloans — intermediaries vary widely; character and plan quality often matter as much as the ratio.",
          "Startups — lenders lean on projected DSCR; expect them to stress-test your revenue assumptions down 10–20%.",
        ],
      },
      {
        heading: "How SBA lenders actually calculate it",
        paragraphs: [
          "Lenders start with your net income, then add back interest, depreciation, amortization, and often the owner's excess compensation — a figure close to EBITDA. They subtract a reasonable owner salary if you underpay yourself, then divide by all annual debt payments including the new SBA loan.",
          "Add-backs are where applications are won and lost. One-time expenses, discontinued costs, and personal expenses run through the business can all legitimately raise your cash flow figure — but only if you document each one clearly.",
        ],
      },
      {
        heading: "If you're below 1.15x",
        bullets: [
          "Request a longer term — SBA 7(a) working-capital loans can run 10 years, real estate 25 years, which lowers annual debt service.",
          "Document add-backs aggressively but honestly: one-time legal fees, owner's health insurance, discontinued leases.",
          "Reduce the loan request or phase the project so the first tranche cash-flows.",
          "Show post-loan income: if the loan directly adds revenue (new equipment, new location), build a projection the lender can verify.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is DSCR for an SBA loan calculated on past or projected cash flow?",
        a: "Both. Established businesses are judged mostly on their trailing twelve months or last fiscal year, with projections as support. Startups and expansion loans lean on projections, which lenders stress-test before believing.",
      },
      {
        q: "Can I get an SBA loan with a DSCR below 1.15x?",
        a: "Rarely. The SBA's own guidelines set 1.15x as the general floor, and lenders must justify exceptions. A stronger path is restructuring the request — longer term, smaller amount, or documented add-backs — until the ratio clears 1.15x.",
      },
      {
        q: "Does personal income count toward SBA DSCR?",
        a: "Some lenders use a global DSCR that combines business cash flow with the guarantor's personal income and personal debts. Strong personal cash flow can offset a marginal business ratio, and weak personal finances can hurt an otherwise good file.",
      },
    ],
  },
  {
    slug: "sba-loan-denial-reasons",
    title: "Top 9 SBA Loan Denial Reasons (and How to Fix Each) | AI Shark",
    h1: "Why SBA Loans Get Denied: The 9 Most Common Reasons",
    metaDescription:
      "Most SBA loan denials come down to nine fixable issues — weak cash flow, credit problems, incomplete paperwork, and more. See the list and how to fix each before you reapply.",
    category: "SBA Loans",
    readTime: "6 min read",
    updated: "July 2026",
    intro:
      "An SBA denial is rarely final — it is a diagnosis. Lenders decline for a short list of predictable reasons, and nearly all of them can be fixed before you reapply. Here are the nine that account for most denials.",
    sections: [
      {
        heading: "The nine most common denial reasons",
        bullets: [
          "Insufficient cash flow — DSCR below the lender's threshold is the single most common reason.",
          "Low credit scores — personal FICO below ~650 or a low SBSS small-business score.",
          "Too little time in business — under two years puts you in the highest-risk bucket.",
          "Incomplete or inconsistent paperwork — numbers that don't match between tax returns, financials, and the application.",
          "Weak business plan — no clear use of funds, no repayment story, unrealistic projections.",
          "Existing debt load — too much leverage before the new loan is even added.",
          "Insufficient owner equity — little of your own money invested in the business.",
          "Prior government debt problems — defaulted federal loans or unresolved tax liens are near-automatic declines.",
          "Industry or eligibility issues — restricted industries, ineligible business structures, or unresolved character questions.",
        ],
      },
      {
        heading: "What a denial actually tells you",
        paragraphs: [
          "Lenders are required to give you the reason for an SBA denial in writing. Get it, because it tells you exactly what to fix. A cash-flow denial and a paperwork denial call for completely different responses.",
          "A denial from one SBA lender is not a denial from all of them. Credit boxes vary: a community bank may decline a file that a non-bank SBA lender or a CDFI will approve. But reapplying without fixing the stated reason usually just produces a second denial and another credit inquiry.",
        ],
      },
      {
        heading: "How to come back stronger",
        bullets: [
          "Cash flow: cut the request, extend the term, or wait for two stronger quarters before reapplying.",
          "Credit: pay down revolving balances, dispute errors, and resolve any past-due federal obligations first.",
          "Paperwork: reconcile every number across tax returns, P&L, and the application before resubmitting.",
          "Business plan: rewrite it around repayment — show the lender exactly how their money comes back.",
          "Equity: document additional owner injection; even 10% of the project changes the conversation.",
        ],
      },
      {
        heading: "Fix the file before the bank sees it",
        paragraphs: [
          "Every reason on this list is visible in your business plan and financials before a lender ever reads them. Scoring your plan against the same criteria banks use — cash flow coverage, credit readiness, equity, realistic projections — turns a likely denial into a fixable to-do list.",
        ],
      },
    ],
    faqs: [
      {
        q: "How soon can I reapply after an SBA loan denial?",
        a: "There is no mandatory waiting period from the SBA. Reapply when you have materially fixed the stated denial reason — often 90 days for paperwork or credit issues, and two or more quarters for cash-flow problems.",
      },
      {
        q: "Does an SBA denial hurt my credit?",
        a: "The denial itself is not reported, but the hard inquiry from the application can trim a few points. Multiple applications in a short window compound the effect, which is another reason to fix the file before reapplying.",
      },
      {
        q: "Can a different lender approve me after a denial?",
        a: "Yes. SBA lenders set their own credit standards above the SBA minimums, so a file declined at one institution may be approved at another — especially community banks, credit unions, and CDFIs with more flexible credit boxes.",
      },
    ],
  },
  {
    slug: "personal-guarantee-business-loan",
    title: "Personal Guarantees on Business Loans: What You're Really Signing | AI Shark",
    h1: "Personal Guarantees on Business Loans, Explained",
    metaDescription:
      "Almost every small business loan requires a personal guarantee. Learn what it means, when it's required, what's at risk, and how to limit your exposure.",
    category: "Loan Basics",
    readTime: "5 min read",
    updated: "July 2026",
    intro:
      "If you own 20% or more of a small business, expect to personally guarantee its loans — SBA rules require it and banks demand it. Here is what that signature actually commits you to and the few ways to limit it.",
    sections: [
      {
        heading: "What a personal guarantee means",
        paragraphs: [
          "A personal guarantee makes you personally liable for the business's debt. If the business cannot pay, the lender can pursue your personal assets — savings, investments, and in many cases your home — to collect.",
          "It exists because limited liability protects owners from business debts by default. The guarantee removes that shield for this one obligation, aligning your risk with the lender's.",
        ],
      },
      {
        heading: "When it's required",
        bullets: [
          "SBA loans — every owner of 20% or more must provide an unlimited personal guarantee. This is not negotiable.",
          "Bank term loans and lines of credit — nearly always for small and mid-sized businesses.",
          "Equipment financing — usually, though the equipment itself softens the terms.",
          "Larger companies with strong balance sheets can sometimes borrow guarantee-free — most small businesses cannot.",
        ],
      },
      {
        heading: "Limited vs. unlimited guarantees",
        paragraphs: [
          "An unlimited guarantee puts you on the hook for the full loan balance plus collection costs. A limited guarantee caps your exposure at a dollar amount or a percentage — common when multiple partners each guarantee their share.",
          "Spouses may be asked to sign if jointly-owned assets secure the guarantee. Understand exactly which assets are reachable before signing, and get legal advice for any guarantee tied to your home.",
        ],
      },
      {
        heading: "How to limit your exposure",
        bullets: [
          "Negotiate a cap or a burn-off clause that releases the guarantee after a period of on-time payments.",
          "Ask for the guarantee to exclude your primary residence where state law allows.",
          "With partners, push for several (proportional) liability instead of joint-and-several.",
          "Strengthen the loan file itself — better cash flow and collateral give you standing to negotiate terms.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I get a business loan without a personal guarantee?",
        a: "For most small businesses, no. Exceptions exist for well-capitalized companies, some equipment financing, and revenue-based products — but expect higher rates in exchange for the lender's added risk.",
      },
      {
        q: "Does a personal guarantee show up on my credit report?",
        a: "Not by itself. But if the business defaults and the lender pursues you, the collection, judgment, or settlement can hit your personal credit hard.",
      },
      {
        q: "What happens to my guarantee if I sell the business?",
        a: "It does not automatically go away. You must be formally released by the lender — typically when the loan is paid off or refinanced by the new owner. Get the release in writing at closing.",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export const guideSlugs = guides.map((g) => g.slug);
