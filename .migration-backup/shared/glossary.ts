export interface GlossaryTerm {
  term: string;
  definition: string;
}

// Bank lending terms glossary. Kept in shared/ so the server sitemap and any
// future per-term pages can import from a single source of truth.
export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Amortization",
    definition:
      "The process of paying off a loan through scheduled payments that cover both principal and interest. A fully amortizing loan reaches a zero balance at the end of its term.",
  },
  {
    term: "Annual Percentage Rate (APR)",
    definition:
      "The true yearly cost of borrowing, including the interest rate plus fees, expressed as a percentage. APR lets you compare loans with different fee structures apples-to-apples.",
  },
  {
    term: "Balloon Payment",
    definition:
      "A large lump-sum payment due at the end of a loan whose regular payments did not fully pay down the balance. Common in commercial real estate loans with 5- or 10-year terms amortized over 20–25 years.",
  },
  {
    term: "Blanket Lien",
    definition:
      "A security interest covering all of a business's assets rather than one specific item. Most bank and SBA loans include a blanket lien via a UCC-1 filing.",
  },
  {
    term: "Borrowing Base",
    definition:
      "The maximum amount a lender will advance on a line of credit, calculated as a percentage of eligible collateral such as accounts receivable and inventory.",
  },
  {
    term: "Cash Flow Statement",
    definition:
      "A financial statement showing cash moving in and out of the business across operating, investing, and financing activities. Lenders read it to see whether operations actually generate cash.",
  },
  {
    term: "CDC (Certified Development Company)",
    definition:
      "A nonprofit partner that works with banks to provide SBA 504 loans, typically funding 40% of a real estate or equipment project at a fixed rate.",
  },
  {
    term: "Collateral",
    definition:
      "Assets pledged to secure a loan — equipment, real estate, inventory, receivables — that the lender can seize and sell if the borrower defaults.",
  },
  {
    term: "Covenant",
    definition:
      "A condition in the loan agreement the borrower must maintain, such as a minimum DSCR or maximum leverage ratio. Breaking a covenant can put the loan in technical default even if payments are current.",
  },
  {
    term: "Credit Memo (Credit Memorandum)",
    definition:
      "The internal document a loan officer writes to summarize your business, financials, and risks for the bank's credit committee. Your business plan is the raw material for this document.",
  },
  {
    term: "Debt Service",
    definition:
      "The total principal and interest payments due on all debt over a period, usually measured annually. The denominator in the DSCR calculation.",
  },
  {
    term: "Debt Service Coverage Ratio (DSCR)",
    definition:
      "Net operating income divided by annual debt service. The single most important ratio in commercial lending — most banks want at least 1.25x, meaning 25% more cash than needed to cover payments.",
  },
  {
    term: "Debt-to-Equity Ratio",
    definition:
      "Total liabilities divided by owner's equity. It measures leverage: how much of the business is financed by debt versus the owners' own money. Most banks get uncomfortable above 3:1 or 4:1.",
  },
  {
    term: "Default",
    definition:
      "Failure to meet the terms of a loan — most obviously missing payments, but also breaking covenants or misrepresenting information. Default triggers the lender's right to demand full repayment and pursue collateral.",
  },
  {
    term: "EBITDA",
    definition:
      "Earnings Before Interest, Taxes, Depreciation, and Amortization — a proxy for the cash the business's operations generate. Lenders frequently use EBITDA (with adjustments) as the starting point for cash flow analysis.",
  },
  {
    term: "Equity Injection",
    definition:
      "The cash the owner personally puts into a project or purchase. SBA loans typically require a 10% or greater injection; banks read it as proof you share the risk.",
  },
  {
    term: "Five Cs of Credit",
    definition:
      "The classic lender framework: Character, Capacity, Capital, Collateral, and Conditions. Nearly every underwriting decision maps back to these five factors.",
  },
  {
    term: "Global Cash Flow",
    definition:
      "An analysis that combines the business's cash flow with the owner's personal income and personal debt obligations. Common for small business loans where owner and business finances are intertwined.",
  },
  {
    term: "Guarantor",
    definition:
      "A person or entity that promises to repay the loan if the borrower cannot. For small business loans, every owner of 20% or more is usually required to be a guarantor.",
  },
  {
    term: "Interest-Only Period",
    definition:
      "A stretch at the start of a loan when payments cover only interest, not principal. It lowers early payments — useful during construction or ramp-up — but the full balance remains.",
  },
  {
    term: "Line of Credit",
    definition:
      "A revolving credit limit the business can draw on, repay, and reuse. Interest accrues only on the drawn balance. Built for working capital and cash flow timing gaps, not long-term purchases.",
  },
  {
    term: "Liquidity",
    definition:
      "How quickly assets can be converted to cash. Lenders check liquidity ratios (like the current ratio) to see whether you can absorb a bad month without missing payments.",
  },
  {
    term: "Loan-to-Value Ratio (LTV)",
    definition:
      "The loan amount divided by the appraised value of the collateral. An 80% LTV on a $500,000 building means a $400,000 loan. Lower LTV means more lender protection and better terms.",
  },
  {
    term: "Net Operating Income (NOI)",
    definition:
      "Revenue minus operating expenses, before debt payments and taxes. The numerator in the DSCR calculation and the core measure of whether operations can support debt.",
  },
  {
    term: "Personal Guarantee",
    definition:
      "A commitment making the owner personally liable for the business's loan. If the business cannot pay, the lender can pursue personal assets. Standard on virtually all small business loans.",
  },
  {
    term: "Prepayment Penalty",
    definition:
      "A fee charged for paying off a loan early, compensating the lender for lost interest. Common on commercial mortgages and some SBA 7(a) loans with terms of 15+ years.",
  },
  {
    term: "Prime Rate",
    definition:
      "The benchmark interest rate banks charge their most creditworthy customers, which moves with the Federal Reserve. Small business loans are often priced as 'Prime plus' a margin.",
  },
  {
    term: "Pro Forma Financials",
    definition:
      "Projected financial statements showing expected future performance. Lenders stress-test pro formas — credible, conservative assumptions matter more than impressive numbers.",
  },
  {
    term: "SBA 7(a) Loan",
    definition:
      "The SBA's flagship program: a bank loan partially guaranteed by the government, usable for working capital, equipment, real estate, or business acquisition, up to $5 million.",
  },
  {
    term: "SBA 504 Loan",
    definition:
      "An SBA program for real estate and major equipment, combining a bank loan (typically 50%), a CDC loan (40%), and owner injection (10%), with long fixed-rate terms on the CDC portion.",
  },
  {
    term: "SBSS Score",
    definition:
      "The Small Business Scoring Service score (0–300) used by the SBA and many banks to prescreen loans, blending personal credit, business credit, and financials. SBA 7(a) small loans generally need 155+.",
  },
  {
    term: "Term Loan",
    definition:
      "A lump sum repaid in fixed installments over a set period. Built for one-time investments — equipment, expansion, acquisition — where the asset's useful life matches the loan term.",
  },
  {
    term: "Term Sheet",
    definition:
      "A non-binding summary of proposed loan terms — amount, rate, term, collateral, covenants — issued before final underwriting. Getting a term sheet means the lender is seriously interested.",
  },
  {
    term: "UCC-1 Filing",
    definition:
      "A public notice a lender files to claim a security interest in business assets. It establishes priority: the first lender to file gets first claim on the collateral.",
  },
  {
    term: "Underwriting",
    definition:
      "The lender's process of analyzing your credit, cash flow, collateral, and plan to decide whether to approve the loan and on what terms.",
  },
  {
    term: "Working Capital",
    definition:
      "Current assets minus current liabilities — the cash cushion available to run day-to-day operations. Lenders check it to confirm the business can operate while servicing new debt.",
  },
];
