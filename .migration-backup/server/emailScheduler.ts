import { storage } from "./storage";
import { Resend } from "resend";
import type { TransactionRecord, TeaserLead } from "@shared/schema";

const RECIPIENT_EMAIL = "vemangum@gmail.com";
const REVENUE_REPORT_EMAIL = "vemangum@gmail.com";
const FROM_EMAIL = "AI Shark <info@aishark.org>";

const MAX_TIMEOUT_MS = 2147483647;

function safeSetTimeout(fn: () => void, ms: number): void {
  if (ms > MAX_TIMEOUT_MS) {
    setTimeout(() => safeSetTimeout(fn, ms - MAX_TIMEOUT_MS), MAX_TIMEOUT_MS);
  } else {
    setTimeout(fn, Math.max(0, ms));
  }
}

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email Scheduler] RESEND_API_KEY not configured");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

function getNextSundayMidnight(): Date {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(0, 0, 0, 0);
  return nextSunday;
}

function getNextSunday10PM(): Date {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(22, 0, 0, 0); // 10pm
  
  // If it's Sunday and before 10pm, schedule for today
  if (now.getDay() === 0 && now.getHours() < 22) {
    nextSunday.setDate(now.getDate());
  }
  
  return nextSunday;
}

function formatRegistrationsAsCSV(registrations: any[]): string {
  const header = "Username,Email,Phone,Street Address,City,State,Zip,Country,Company,Job Title,Industry,Company Size,How Heard,Registered At";
  
  if (registrations.length === 0) {
    return header;
  }

  const rows = registrations.map(r => 
    `"${r.username}","${r.email}","${r.phoneNumber || ''}","${r.streetAddress || ''}","${r.city || ''}","${r.state || ''}","${r.zipCode || ''}","${r.country || ''}","${r.companyName || ''}","${r.jobTitle || ''}","${r.industry || ''}","${r.companySize || ''}","${r.howDidYouHear || ''}","${r.registeredAt}"`
  );
  
  return header + "\n" + rows.join("\n");
}

function formatRegistrationsAsHTML(registrations: any[]): string {
  if (registrations.length === 0) {
    return "<p>No new registrations this week.</p>";
  }

  let html = `
    <h2>AI Shark Weekly Registration Report</h2>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p><strong>New Registrations:</strong> ${registrations.length}</p>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead style="background-color: #f0f0f0;">
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Phone</th>
          <th>City</th>
          <th>State</th>
          <th>Company</th>
          <th>Industry</th>
          <th>Registered</th>
        </tr>
      </thead>
      <tbody>
  `;

  registrations.forEach(r => {
    html += `
      <tr>
        <td>${r.username}</td>
        <td>${r.email}</td>
        <td>${r.phoneNumber || '-'}</td>
        <td>${r.city || '-'}</td>
        <td>${r.state || '-'}</td>
        <td>${r.companyName || '-'}</td>
        <td>${r.industry || '-'}</td>
        <td>${new Date(r.registeredAt).toLocaleDateString()}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <p style="margin-top: 20px; color: #666;">
      This is an automated weekly report from AI Shark.<br>
      Full CSV data is attached to this email.
    </p>
  `;

  return html;
}

async function sendWeeklyEmail() {
  try {
    const resend = getResend();
    if (!resend) {
      console.log("[Email Scheduler] Skipping email - Resend not configured");
      return;
    }

    const unsentRegistrations = await storage.getUnsentRegistrations();
    
    if (unsentRegistrations.length === 0) {
      console.log("[Email Scheduler] No new registrations to send this week.");
      return;
    }

    const csvContent = formatRegistrationsAsCSV(unsentRegistrations);
    const htmlContent = formatRegistrationsAsHTML(unsentRegistrations);
    const csvBuffer = Buffer.from(csvContent, 'utf-8');

    console.log(`[Email Scheduler] Sending weekly report to ${RECIPIENT_EMAIL}`);
    console.log(`[Email Scheduler] Report contains ${unsentRegistrations.length} new registrations`);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [RECIPIENT_EMAIL],
      subject: `AI Shark Weekly Registration Report - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
      attachments: [
        {
          filename: `registrations_${new Date().toISOString().split('T')[0]}.csv`,
          content: csvBuffer,
        },
      ],
    });

    if (error) {
      console.error("[Email Scheduler] Failed to send email:", error);
      return;
    }

    console.log(`[Email Scheduler] Email sent successfully! ID: ${data?.id}`);
    
    const ids = unsentRegistrations.map(r => r.id);
    await storage.markRegistrationsAsEmailed(ids);
    
    console.log(`[Email Scheduler] Marked ${ids.length} registrations as emailed`);
    
  } catch (error) {
    console.error("[Email Scheduler] Error sending weekly email:", error);
  }
}

export function startWeeklyEmailScheduler() {
  const nextSunday = getNextSundayMidnight();
  const msUntilNextSunday = nextSunday.getTime() - Date.now();
  
  console.log(`[Email Scheduler] Started. Next email scheduled for: ${nextSunday.toISOString()}`);
  console.log(`[Email Scheduler] Time until next email: ${Math.round(msUntilNextSunday / 1000 / 60 / 60)} hours`);

  safeSetTimeout(() => {
    sendWeeklyEmail();
    
    setInterval(() => {
      sendWeeklyEmail();
    }, 7 * 24 * 60 * 60 * 1000);
  }, msUntilNextSunday);
}

export async function triggerEmailManually() {
  console.log("[Email Scheduler] Manual trigger requested");
  await sendWeeklyEmail();
}

function formatTransactionsAsCSV(transactions: any[], registrations: Map<string, any>): string {
  const header = "Transaction ID,User,Email,Amount,Currency,Tax,Tier,Status,Paid At";
  
  if (transactions.length === 0) {
    return header;
  }

  const rows = transactions.map(t => {
    const reg = registrations.get(t.userRegistrationId);
    const amount = (t.amount / 100).toFixed(2);
    const tax = t.taxAmount ? (t.taxAmount / 100).toFixed(2) : "0.00";
    return `"${t.id}","${reg?.username || 'Unknown'}","${reg?.email || 'Unknown'}","${amount}","${t.currency}","${tax}","${t.tier}","${t.paymentStatus}","${t.paidAt}"`;
  });
  
  return header + "\n" + rows.join("\n");
}

function formatTransactionsAsHTML(transactions: any[], registrations: Map<string, any>): string {
  if (transactions.length === 0) {
    return "<p>No new transactions this week.</p>";
  }

  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalTax = transactions.reduce((sum, t) => sum + (t.taxAmount || 0), 0);

  let html = `
    <h2>AI Shark Weekly Transaction Report</h2>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p><strong>Total Transactions:</strong> ${transactions.length}</p>
    <p><strong>Total Revenue:</strong> $${(totalAmount / 100).toFixed(2)} (Tax: $${(totalTax / 100).toFixed(2)})</p>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead style="background-color: #f0f0f0;">
        <tr>
          <th>User</th>
          <th>Email</th>
          <th>Amount</th>
          <th>Tax</th>
          <th>Tier</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
  `;

  transactions.forEach(t => {
    const reg = registrations.get(t.userRegistrationId);
    html += `
      <tr>
        <td>${reg?.username || 'Unknown'}</td>
        <td>${reg?.email || 'Unknown'}</td>
        <td>$${(t.amount / 100).toFixed(2)} ${t.currency.toUpperCase()}</td>
        <td>$${(t.taxAmount ? t.taxAmount / 100 : 0).toFixed(2)}</td>
        <td>${t.tier}</td>
        <td>${t.paymentStatus}</td>
        <td>${t.paidAt ? new Date(t.paidAt).toLocaleDateString() : '-'}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <p style="margin-top: 20px; color: #666;">
      This is an automated weekly transaction report from AI Shark.<br>
      Full CSV data is attached to this email.
    </p>
  `;

  return html;
}

async function sendTransactionEmail() {
  try {
    const resend = getResend();
    if (!resend) {
      console.log("[Transaction Email] Skipping - Resend not configured");
      return;
    }

    const unsentTransactions = await storage.getUnsentTransactions();
    
    if (unsentTransactions.length === 0) {
      console.log("[Transaction Email] No new transactions to send this week.");
      return;
    }

    const registrationIds = Array.from(new Set(unsentTransactions.map(t => t.userRegistrationId)));
    const registrations = new Map<string, any>();
    
    for (const id of registrationIds) {
      const reg = await storage.getRegistrationById(id);
      if (reg) registrations.set(id, reg);
    }

    const csvContent = formatTransactionsAsCSV(unsentTransactions, registrations);
    const htmlContent = formatTransactionsAsHTML(unsentTransactions, registrations);
    const csvBuffer = Buffer.from(csvContent, 'utf-8');

    console.log(`[Transaction Email] Sending weekly report to ${RECIPIENT_EMAIL}`);
    console.log(`[Transaction Email] Report contains ${unsentTransactions.length} transactions`);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [RECIPIENT_EMAIL],
      subject: `AI Shark Weekly Transaction Report - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
      attachments: [
        {
          filename: `transactions_${new Date().toISOString().split('T')[0]}.csv`,
          content: csvBuffer,
        },
      ],
    });

    if (error) {
      console.error("[Transaction Email] Failed to send email:", error);
      return;
    }

    console.log(`[Transaction Email] Email sent successfully! ID: ${data?.id}`);
    
    const ids = unsentTransactions.map(t => t.id);
    await storage.markTransactionsAsEmailed(ids);
    
    console.log(`[Transaction Email] Marked ${ids.length} transactions as emailed`);
    
  } catch (error) {
    console.error("[Transaction Email] Error sending weekly email:", error);
  }
}

export function startTransactionEmailScheduler() {
  const nextSunday = getNextSundayMidnight();
  const msUntilNextSunday = nextSunday.getTime() - Date.now();
  
  console.log(`[Transaction Email] Started. Next email scheduled for: ${nextSunday.toISOString()}`);

  safeSetTimeout(() => {
    sendTransactionEmail();
    
    setInterval(() => {
      sendTransactionEmail();
    }, 7 * 24 * 60 * 60 * 1000);
  }, msUntilNextSunday);
}

// Revenue Report - grouped by payment type
interface RevenueGroup {
  tier: string;
  count: number;
  totalAmount: number;
  totalTax: number;
  transactions: any[];
}

interface AdRevenueData {
  totalAmount: number;
  totalImpressions: number;
  totalClicks: number;
  entries: any[];
}

function formatRevenueReportAsCSV(subscriptions: RevenueGroup, oneTime: RevenueGroup, adRevenue?: AdRevenueData): string {
  const header = "Type,Transaction Count,Total Revenue,Total Tax,Net Revenue";
  
  const subNet = (subscriptions.totalAmount - subscriptions.totalTax) / 100;
  const oneTimeNet = (oneTime.totalAmount - oneTime.totalTax) / 100;
  const adNet = adRevenue ? adRevenue.totalAmount / 100 : 0;
  const grandTotal = subNet + oneTimeNet + adNet;
  
  const rows = [
    `"Monthly Subscriptions","${subscriptions.count}","$${(subscriptions.totalAmount / 100).toFixed(2)}","$${(subscriptions.totalTax / 100).toFixed(2)}","$${subNet.toFixed(2)}"`,
    `"One-Time Payments","${oneTime.count}","$${(oneTime.totalAmount / 100).toFixed(2)}","$${(oneTime.totalTax / 100).toFixed(2)}","$${oneTimeNet.toFixed(2)}"`,
    `"Advertising Revenue","${adRevenue?.entries.length || 0}","$${adNet.toFixed(2)}","$0.00","$${adNet.toFixed(2)}"`,
    `"TOTAL","${subscriptions.count + oneTime.count + (adRevenue?.entries.length || 0)}","$${((subscriptions.totalAmount + oneTime.totalAmount) / 100 + adNet).toFixed(2)}","$${((subscriptions.totalTax + oneTime.totalTax) / 100).toFixed(2)}","$${grandTotal.toFixed(2)}"`
  ];
  
  return header + "\n" + rows.join("\n");
}

function formatRevenueReportAsHTML(subscriptions: RevenueGroup, oneTime: RevenueGroup, registrations: Map<string, any>, adRevenue?: AdRevenueData): string {
  const subNet = (subscriptions.totalAmount - subscriptions.totalTax) / 100;
  const oneTimeNet = (oneTime.totalAmount - oneTime.totalTax) / 100;
  const adNet = adRevenue ? adRevenue.totalAmount / 100 : 0;
  const grandTotal = subNet + oneTimeNet + adNet;
  const totalTransactions = subscriptions.count + oneTime.count + (adRevenue?.entries.length || 0);

  let html = `
    <h2>AI Shark Weekly Revenue Report</h2>
    <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p><strong>Total Transactions:</strong> ${totalTransactions}</p>
    <p><strong>Total Net Revenue:</strong> $${grandTotal.toFixed(2)}</p>
    
    <h3 style="margin-top: 30px; color: #2563eb;">Revenue by Payment Type</h3>
    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 30px;">
      <thead style="background-color: #1e40af; color: white;">
        <tr>
          <th>Payment Type</th>
          <th>Transactions</th>
          <th>Gross Revenue</th>
          <th>Tax Collected</th>
          <th>Net Revenue</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #dbeafe;">
          <td><strong>Monthly Subscriptions</strong></td>
          <td style="text-align: center;">${subscriptions.count}</td>
          <td style="text-align: right;">$${(subscriptions.totalAmount / 100).toFixed(2)}</td>
          <td style="text-align: right;">$${(subscriptions.totalTax / 100).toFixed(2)}</td>
          <td style="text-align: right;"><strong>$${subNet.toFixed(2)}</strong></td>
        </tr>
        <tr style="background-color: #fef3c7;">
          <td><strong>One-Time Payments</strong></td>
          <td style="text-align: center;">${oneTime.count}</td>
          <td style="text-align: right;">$${(oneTime.totalAmount / 100).toFixed(2)}</td>
          <td style="text-align: right;">$${(oneTime.totalTax / 100).toFixed(2)}</td>
          <td style="text-align: right;"><strong>$${oneTimeNet.toFixed(2)}</strong></td>
        </tr>
        <tr style="background-color: #e0f2fe;">
          <td><strong>Advertising Revenue</strong></td>
          <td style="text-align: center;">${adRevenue?.entries.length || 0}</td>
          <td style="text-align: right;">$${adNet.toFixed(2)}</td>
          <td style="text-align: right;">$0.00</td>
          <td style="text-align: right;"><strong>$${adNet.toFixed(2)}</strong></td>
        </tr>
        <tr style="background-color: #dcfce7; font-weight: bold;">
          <td>TOTAL</td>
          <td style="text-align: center;">${totalTransactions}</td>
          <td style="text-align: right;">$${((subscriptions.totalAmount + oneTime.totalAmount) / 100 + adNet).toFixed(2)}</td>
          <td style="text-align: right;">$${((subscriptions.totalTax + oneTime.totalTax) / 100).toFixed(2)}</td>
          <td style="text-align: right;">$${grandTotal.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  `;
  
  // Add advertising details if any
  if (adRevenue && adRevenue.entries.length > 0) {
    html += `
      <h3 style="color: #0891b2;">Advertising Revenue Details</h3>
      <p><strong>Total Impressions:</strong> ${adRevenue.totalImpressions.toLocaleString()}</p>
      <p><strong>Total Clicks:</strong> ${adRevenue.totalClicks.toLocaleString()}</p>
      <p><strong>Click-Through Rate:</strong> ${adRevenue.totalImpressions > 0 ? ((adRevenue.totalClicks / adRevenue.totalImpressions) * 100).toFixed(2) : 0}%</p>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead style="background-color: #e0f2fe;">
          <tr>
            <th>Source</th>
            <th>Amount</th>
            <th>Impressions</th>
            <th>Clicks</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
    `;
    adRevenue.entries.forEach((entry: any) => {
      html += `
        <tr>
          <td>${entry.source}</td>
          <td>$${(entry.amount / 100).toFixed(2)}</td>
          <td>${(entry.impressions || 0).toLocaleString()}</td>
          <td>${(entry.clicks || 0).toLocaleString()}</td>
          <td>${new Date(entry.reportDate).toLocaleDateString()}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
  }

  // Add subscription details if any
  if (subscriptions.transactions.length > 0) {
    html += `
      <h3 style="color: #2563eb;">Monthly Subscription Details</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead style="background-color: #dbeafe;">
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Tax</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
    `;
    subscriptions.transactions.forEach(t => {
      const reg = registrations.get(t.userRegistrationId);
      html += `
        <tr>
          <td>${reg?.username || 'Unknown'}</td>
          <td>${reg?.email || 'Unknown'}</td>
          <td>$${(t.amount / 100).toFixed(2)}</td>
          <td>$${(t.taxAmount ? t.taxAmount / 100 : 0).toFixed(2)}</td>
          <td>${t.paymentStatus}</td>
          <td>${t.paidAt ? new Date(t.paidAt).toLocaleDateString() : '-'}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
  }

  // Add one-time payment details if any
  if (oneTime.transactions.length > 0) {
    html += `
      <h3 style="color: #d97706;">One-Time Payment Details</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead style="background-color: #fef3c7;">
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Tax</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
    `;
    oneTime.transactions.forEach(t => {
      const reg = registrations.get(t.userRegistrationId);
      html += `
        <tr>
          <td>${reg?.username || 'Unknown'}</td>
          <td>${reg?.email || 'Unknown'}</td>
          <td>$${(t.amount / 100).toFixed(2)}</td>
          <td>$${(t.taxAmount ? t.taxAmount / 100 : 0).toFixed(2)}</td>
          <td>${t.paymentStatus}</td>
          <td>${t.paidAt ? new Date(t.paidAt).toLocaleDateString() : '-'}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
  }

  if (totalTransactions === 0) {
    html += `<p style="color: #666; font-style: italic;">No transactions recorded this week.</p>`;
  }

  html += `
    <p style="margin-top: 30px; color: #666; font-size: 12px;">
      This is an automated weekly revenue report from AI Shark.<br>
      Summary CSV data is attached to this email.
    </p>
  `;

  return html;
}

async function sendRevenueReport() {
  try {
    const resend = getResend();
    if (!resend) {
      console.log("[Revenue Report] Skipping - Resend not configured");
      return;
    }

    // Get all successful transactions from the past week
    const allTransactions = await storage.getSuccessfulTransactionsLastWeek();
    
    // Group by tier
    const subscriptions: RevenueGroup = {
      tier: "subscription",
      count: 0,
      totalAmount: 0,
      totalTax: 0,
      transactions: []
    };
    
    const oneTime: RevenueGroup = {
      tier: "one_time",
      count: 0,
      totalAmount: 0,
      totalTax: 0,
      transactions: []
    };

    allTransactions.forEach(t => {
      if (t.tier === "subscription") {
        subscriptions.count++;
        subscriptions.totalAmount += t.amount || 0;
        subscriptions.totalTax += t.taxAmount || 0;
        subscriptions.transactions.push(t);
      } else if (t.tier === "one_time") {
        oneTime.count++;
        oneTime.totalAmount += t.amount || 0;
        oneTime.totalTax += t.taxAmount || 0;
        oneTime.transactions.push(t);
      }
    });

    // Get registration info for user details
    const registrationIds = Array.from(new Set(allTransactions.map(t => t.userRegistrationId)));
    const registrations = new Map<string, any>();
    
    for (const id of registrationIds) {
      const reg = await storage.getRegistrationById(id);
      if (reg) registrations.set(id, reg);
    }

    // Get advertising revenue data
    const adRevenueEntries = await storage.getAdvertisingRevenueLastWeek();
    const adRevenue: AdRevenueData = {
      totalAmount: adRevenueEntries.reduce((sum, e) => sum + e.amount, 0),
      totalImpressions: adRevenueEntries.reduce((sum, e) => sum + (e.impressions || 0), 0),
      totalClicks: adRevenueEntries.reduce((sum, e) => sum + (e.clicks || 0), 0),
      entries: adRevenueEntries
    };

    const csvContent = formatRevenueReportAsCSV(subscriptions, oneTime, adRevenue);
    const htmlContent = formatRevenueReportAsHTML(subscriptions, oneTime, registrations, adRevenue);
    const csvBuffer = Buffer.from(csvContent, 'utf-8');

    console.log(`[Revenue Report] Sending weekly report to ${REVENUE_REPORT_EMAIL}`);
    console.log(`[Revenue Report] Subscriptions: ${subscriptions.count}, One-time: ${oneTime.count}, Ad Revenue: $${(adRevenue.totalAmount / 100).toFixed(2)}`);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [REVENUE_REPORT_EMAIL],
      subject: `AI Shark Weekly Revenue Report - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
      attachments: [
        {
          filename: `revenue_report_${new Date().toISOString().split('T')[0]}.csv`,
          content: csvBuffer,
        },
      ],
    });

    if (error) {
      console.error("[Revenue Report] Failed to send email:", error);
      return;
    }

    console.log(`[Revenue Report] Email sent successfully! ID: ${data?.id}`);
    
  } catch (error) {
    console.error("[Revenue Report] Error sending weekly email:", error);
  }
}

export function startRevenueReportScheduler() {
  const nextSunday10PM = getNextSunday10PM();
  const msUntilNext = nextSunday10PM.getTime() - Date.now();
  
  console.log(`[Revenue Report] Started. Next report scheduled for: ${nextSunday10PM.toISOString()}`);
  console.log(`[Revenue Report] Time until next report: ${Math.round(msUntilNext / 1000 / 60 / 60)} hours`);

  safeSetTimeout(() => {
    sendRevenueReport();
    
    setInterval(() => {
      sendRevenueReport();
    }, 7 * 24 * 60 * 60 * 1000);
  }, msUntilNext);
}

export async function triggerRevenueReportManually() {
  console.log("[Revenue Report] Manual trigger requested");
  await sendRevenueReport();
}

// Expense Report - Stripe processing fees grouped by type
interface ExpenseGroup {
  type: string;
  count: number;
  totalFees: number;
  transactions: any[];
}

// Stripe fee calculation: 2.9% + $0.30 per transaction
function calculateStripeFee(amountCents: number): number {
  const percentageFee = amountCents * 0.029;
  const fixedFee = 30; // 30 cents
  return Math.round(percentageFee + fixedFee);
}

function formatExpenseReportAsCSV(subscriptionExpenses: ExpenseGroup, oneTimeExpenses: ExpenseGroup): string {
  const header = "Expense Type,Transaction Count,Total Processing Fees";
  
  const totalFees = (subscriptionExpenses.totalFees + oneTimeExpenses.totalFees) / 100;
  
  const rows = [
    `"Subscription Processing Fees","${subscriptionExpenses.count}","$${(subscriptionExpenses.totalFees / 100).toFixed(2)}"`,
    `"One-Time Processing Fees","${oneTimeExpenses.count}","$${(oneTimeExpenses.totalFees / 100).toFixed(2)}"`,
    `"TOTAL EXPENSES","${subscriptionExpenses.count + oneTimeExpenses.count}","$${totalFees.toFixed(2)}"`
  ];
  
  return header + "\n" + rows.join("\n");
}

function formatExpenseReportAsHTML(subscriptionExpenses: ExpenseGroup, oneTimeExpenses: ExpenseGroup, registrations: Map<string, any>): string {
  const totalFees = (subscriptionExpenses.totalFees + oneTimeExpenses.totalFees) / 100;
  const totalTransactions = subscriptionExpenses.count + oneTimeExpenses.count;

  let html = `
    <h2>AI Shark Weekly Expense Report</h2>
    <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p><strong>Total Transactions:</strong> ${totalTransactions}</p>
    <p><strong>Total Processing Fees:</strong> $${totalFees.toFixed(2)}</p>
    
    <h3 style="margin-top: 30px; color: #dc2626;">Expenses by Payment Type</h3>
    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 30px;">
      <thead style="background-color: #7f1d1d; color: white;">
        <tr>
          <th>Expense Type</th>
          <th>Transactions</th>
          <th>Processing Fees</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #fef2f2;">
          <td><strong>Subscription Processing Fees</strong></td>
          <td style="text-align: center;">${subscriptionExpenses.count}</td>
          <td style="text-align: right;"><strong>$${(subscriptionExpenses.totalFees / 100).toFixed(2)}</strong></td>
        </tr>
        <tr style="background-color: #fff7ed;">
          <td><strong>One-Time Processing Fees</strong></td>
          <td style="text-align: center;">${oneTimeExpenses.count}</td>
          <td style="text-align: right;"><strong>$${(oneTimeExpenses.totalFees / 100).toFixed(2)}</strong></td>
        </tr>
        <tr style="background-color: #fee2e2; font-weight: bold;">
          <td>TOTAL EXPENSES</td>
          <td style="text-align: center;">${totalTransactions}</td>
          <td style="text-align: right;">$${totalFees.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
    
    <p style="color: #666; font-size: 12px; margin-top: 10px;">
      <em>Note: Stripe fees calculated at 2.9% + $0.30 per transaction. Actual fees may vary slightly.</em>
    </p>
  `;

  // Add subscription fee details if any
  if (subscriptionExpenses.transactions.length > 0) {
    html += `
      <h3 style="color: #dc2626; margin-top: 30px;">Subscription Fee Details</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead style="background-color: #fef2f2;">
          <tr>
            <th>Customer</th>
            <th>Transaction Amount</th>
            <th>Processing Fee</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
    `;
    subscriptionExpenses.transactions.forEach((t: any) => {
      const reg = registrations.get(t.userRegistrationId);
      const fee = calculateStripeFee(t.amount);
      html += `
        <tr>
          <td>${reg?.username || 'Unknown'}</td>
          <td style="text-align: right;">$${(t.amount / 100).toFixed(2)}</td>
          <td style="text-align: right;">$${(fee / 100).toFixed(2)}</td>
          <td>${t.paidAt ? new Date(t.paidAt).toLocaleDateString() : '-'}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
  }

  // Add one-time fee details if any
  if (oneTimeExpenses.transactions.length > 0) {
    html += `
      <h3 style="color: #ea580c; margin-top: 30px;">One-Time Fee Details</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead style="background-color: #fff7ed;">
          <tr>
            <th>Customer</th>
            <th>Transaction Amount</th>
            <th>Processing Fee</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
    `;
    oneTimeExpenses.transactions.forEach((t: any) => {
      const reg = registrations.get(t.userRegistrationId);
      const fee = calculateStripeFee(t.amount);
      html += `
        <tr>
          <td>${reg?.username || 'Unknown'}</td>
          <td style="text-align: right;">$${(t.amount / 100).toFixed(2)}</td>
          <td style="text-align: right;">$${(fee / 100).toFixed(2)}</td>
          <td>${t.paidAt ? new Date(t.paidAt).toLocaleDateString() : '-'}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
  }

  if (totalTransactions === 0) {
    html += `<p style="color: #666; font-style: italic;">No transactions (and therefore no processing fees) this week.</p>`;
  }

  html += `
    <p style="margin-top: 30px; color: #666; font-size: 12px;">
      This is an automated weekly expense report from AI Shark.<br>
      Summary CSV data is attached to this email.
    </p>
  `;

  return html;
}

async function sendExpenseReport() {
  try {
    const resend = getResend();
    if (!resend) {
      console.log("[Expense Report] Skipping - Resend not configured");
      return;
    }

    // Get all successful transactions from the past week
    const allTransactions = await storage.getSuccessfulTransactionsLastWeek();
    
    // Group by tier and calculate fees
    const subscriptionExpenses: ExpenseGroup = {
      type: "subscription",
      count: 0,
      totalFees: 0,
      transactions: []
    };
    
    const oneTimeExpenses: ExpenseGroup = {
      type: "one_time",
      count: 0,
      totalFees: 0,
      transactions: []
    };

    allTransactions.forEach(t => {
      const fee = calculateStripeFee(t.amount || 0);
      if (t.tier === "subscription") {
        subscriptionExpenses.count++;
        subscriptionExpenses.totalFees += fee;
        subscriptionExpenses.transactions.push(t);
      } else if (t.tier === "one_time") {
        oneTimeExpenses.count++;
        oneTimeExpenses.totalFees += fee;
        oneTimeExpenses.transactions.push(t);
      }
    });

    // Get registration info for user details
    const registrationIds = Array.from(new Set(allTransactions.map(t => t.userRegistrationId)));
    const registrations = new Map<string, any>();
    
    for (const id of registrationIds) {
      const reg = await storage.getRegistrationById(id);
      if (reg) registrations.set(id, reg);
    }

    const csvContent = formatExpenseReportAsCSV(subscriptionExpenses, oneTimeExpenses);
    const htmlContent = formatExpenseReportAsHTML(subscriptionExpenses, oneTimeExpenses, registrations);
    const csvBuffer = Buffer.from(csvContent, 'utf-8');

    console.log(`[Expense Report] Sending weekly report to ${REVENUE_REPORT_EMAIL}`);
    console.log(`[Expense Report] Subscription fees: ${subscriptionExpenses.count}, One-time fees: ${oneTimeExpenses.count}`);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [REVENUE_REPORT_EMAIL],
      subject: `AI Shark Weekly Expense Report - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
      attachments: [
        {
          filename: `expense_report_${new Date().toISOString().split('T')[0]}.csv`,
          content: csvBuffer,
        },
      ],
    });

    if (error) {
      console.error("[Expense Report] Failed to send email:", error);
      return;
    }

    console.log(`[Expense Report] Email sent successfully! ID: ${data?.id}`);
    
  } catch (error) {
    console.error("[Expense Report] Error sending weekly email:", error);
  }
}

export function startExpenseReportScheduler() {
  const nextSunday10PM = getNextSunday10PM();
  const msUntilNext = nextSunday10PM.getTime() - Date.now();
  
  console.log(`[Expense Report] Started. Next report scheduled for: ${nextSunday10PM.toISOString()}`);
  console.log(`[Expense Report] Time until next report: ${Math.round(msUntilNext / 1000 / 60 / 60)} hours`);

  safeSetTimeout(() => {
    sendExpenseReport();
    
    setInterval(() => {
      sendExpenseReport();
    }, 7 * 24 * 60 * 60 * 1000);
  }, msUntilNext);
}

export async function triggerExpenseReportManually() {
  console.log("[Expense Report] Manual trigger requested");
  await sendExpenseReport();
}

// ─── Weekly Site & Competitor Report ──────────────────────────────────────────

function getNextSunday8PM(): Date {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(20, 0, 0, 0);
  if (now.getDay() === 0 && now.getHours() < 20) {
    nextSunday.setDate(now.getDate());
  }
  return nextSunday;
}

async function sendWeeklySiteReport() {
  const resend = getResend();
  if (!resend) return;

  try {
    const [registrations, weeklyAssessments, allAssessments, weeklyTransactions, allFeedback] = await Promise.all([
      storage.getAllRegistrations(),
      storage.getAssessmentsLastWeek(),
      storage.getAllAssessments(),
      storage.getSuccessfulTransactionsLastWeek(),
      storage.getAllFeedback(),
    ]);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newUsersThisWeek = registrations.filter(r => new Date(r.registeredAt) >= oneWeekAgo);
    const completedAssessmentsThisWeek = weeklyAssessments.filter(a => a.status === "complete");
    const failedAssessmentsThisWeek = weeklyAssessments.filter(a => a.status === "failed");
    const weeklyRevenueCents = weeklyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const weeklyTaxCents = weeklyTransactions.reduce((sum, t) => sum + (t.taxAmount || 0), 0);
    const unresolvedFeedback = allFeedback.filter(f => !f.resolved);
    const avgScore = completedAssessmentsThisWeek.length > 0
      ? Math.round(completedAssessmentsThisWeek.reduce((sum, a) => sum + (a.overallScore || 0), 0) / completedAssessmentsThisWeek.length)
      : null;

    const now = new Date();
    const weekStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #f8f9fa; margin: 0; padding: 24px; }
  .container { max-width: 720px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #0f3460 0%, #16213e 100%); color: #fff; padding: 28px 32px; }
  .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
  .header p { margin: 4px 0 0; opacity: 0.8; font-size: 14px; }
  .body { padding: 28px 32px; }
  .section { margin-bottom: 28px; }
  .section h2 { font-size: 16px; color: #0f3460; border-left: 4px solid #e94560; padding-left: 10px; margin: 0 0 14px; }
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .stat-card { background: #f0f4ff; border-radius: 8px; padding: 14px 16px; text-align: center; }
  .stat-card .num { font-size: 28px; font-weight: 800; color: #0f3460; }
  .stat-card .label { font-size: 11px; color: #666; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #0f3460; color: #fff; padding: 8px 12px; text-align: left; }
  td { padding: 7px 12px; border-bottom: 1px solid #eee; }
  tr:last-child td { border-bottom: none; }
  .competitor-table td:first-child { font-weight: 600; }
  .badge { display: inline-block; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 600; }
  .badge-green { background: #dcfce7; color: #15803d; }
  .badge-yellow { background: #fef9c3; color: #854d0e; }
  .badge-red { background: #fee2e2; color: #b91c1c; }
  .badge-blue { background: #dbeafe; color: #1d4ed8; }
  .footer { background: #f0f4ff; padding: 16px 32px; font-size: 11px; color: #888; }
  ul { padding-left: 18px; margin: 8px 0; }
  li { margin-bottom: 5px; color: #555; font-size: 13px; }
  .highlight { background: #fff7ed; border-left: 3px solid #f97316; padding: 10px 14px; border-radius: 0 6px 6px 0; margin-bottom: 10px; font-size: 13px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>AI Shark Weekly Site Report</h1>
    <p>Week ending ${weekStr} &nbsp;|&nbsp; aishark.org</p>
  </div>
  <div class="body">

    <div class="section">
      <h2>This Week at a Glance</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="num">${newUsersThisWeek.length}</div>
          <div class="label">New Users</div>
        </div>
        <div class="stat-card">
          <div class="num">${completedAssessmentsThisWeek.length}</div>
          <div class="label">Assessments Done</div>
        </div>
        <div class="stat-card">
          <div class="num">$${(weeklyRevenueCents / 100).toFixed(2)}</div>
          <div class="label">Revenue (gross)</div>
        </div>
        <div class="stat-card">
          <div class="num">${registrations.length}</div>
          <div class="label">Total Users</div>
        </div>
        <div class="stat-card">
          <div class="num">${allAssessments.filter(a => a.status === "complete").length}</div>
          <div class="label">Total Assessments</div>
        </div>
        <div class="stat-card">
          <div class="num">${avgScore !== null ? avgScore : "N/A"}</div>
          <div class="label">Avg Score This Week</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Assessment Activity</h2>
      <table>
        <thead><tr><th>Metric</th><th>This Week</th><th>All Time</th></tr></thead>
        <tbody>
          <tr><td>Assessments Submitted</td><td>${weeklyAssessments.length}</td><td>${allAssessments.length}</td></tr>
          <tr><td>Assessments Completed</td><td>${completedAssessmentsThisWeek.length}</td><td>${allAssessments.filter(a => a.status === "complete").length}</td></tr>
          <tr><td>Assessments Failed/Pending</td><td>${failedAssessmentsThisWeek.length}</td><td>${allAssessments.filter(a => a.status !== "complete").length}</td></tr>
          ${avgScore !== null ? `<tr><td>Average Score</td><td>${avgScore}/100</td><td>—</td></tr>` : ""}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Revenue This Week</h2>
      <table>
        <thead><tr><th>Tier</th><th>Count</th><th>Gross</th><th>Tax</th><th>Net</th></tr></thead>
        <tbody>
          ${(() => {
            const subs = weeklyTransactions.filter(t => t.tier === "subscription");
            const oneTime = weeklyTransactions.filter(t => t.tier === "one_time");
            const subGross = subs.reduce((s, t) => s + t.amount, 0);
            const subTax = subs.reduce((s, t) => s + (t.taxAmount || 0), 0);
            const otGross = oneTime.reduce((s, t) => s + t.amount, 0);
            const otTax = oneTime.reduce((s, t) => s + (t.taxAmount || 0), 0);
            return `
              <tr><td>Monthly ($6.99/mo)</td><td>${subs.length}</td><td>$${(subGross/100).toFixed(2)}</td><td>$${(subTax/100).toFixed(2)}</td><td>$${((subGross-subTax)/100).toFixed(2)}</td></tr>
              <tr><td>One-time ($13.99)</td><td>${oneTime.length}</td><td>$${(otGross/100).toFixed(2)}</td><td>$${(otTax/100).toFixed(2)}</td><td>$${((otGross-otTax)/100).toFixed(2)}</td></tr>
              <tr style="font-weight:700;background:#f0f4ff;"><td>Total</td><td>${weeklyTransactions.length}</td><td>$${(weeklyRevenueCents/100).toFixed(2)}</td><td>$${(weeklyTaxCents/100).toFixed(2)}</td><td>$${((weeklyRevenueCents-weeklyTaxCents)/100).toFixed(2)}</td></tr>
            `;
          })()}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Customer Feedback</h2>
      <table>
        <thead><tr><th>Metric</th><th>Count</th></tr></thead>
        <tbody>
          <tr><td>Total Feedback Items</td><td>${allFeedback.length}</td></tr>
          <tr><td>Unresolved Items</td><td>${unresolvedFeedback.length}</td></tr>
          <tr><td>Bug Reports</td><td>${allFeedback.filter(f => f.feedbackType === "bug" && !f.resolved).length} unresolved</td></tr>
          <tr><td>Feature Requests</td><td>${allFeedback.filter(f => f.feedbackType === "feature" && !f.resolved).length} unresolved</td></tr>
        </tbody>
      </table>
      ${unresolvedFeedback.length > 0 ? `
      <p style="margin-top:10px;font-size:12px;color:#888;">
        Review unresolved feedback at: <strong>aishark.org/admin/feedback</strong>
      </p>` : ""}
    </div>

    <div class="section">
      <h2>New Users This Week</h2>
      ${newUsersThisWeek.length === 0 ? "<p style='color:#888;font-size:13px;'>No new registrations this week.</p>" : `
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Industry</th><th>Joined</th></tr></thead>
        <tbody>
          ${newUsersThisWeek.map(u => `
            <tr>
              <td>${u.username}</td>
              <td>${u.email}</td>
              <td>${u.companyName || '—'}</td>
              <td>${u.industry || '—'}</td>
              <td>${new Date(u.registeredAt).toLocaleDateString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>`}
    </div>

    <div class="section">
      <h2>Competitive Benchmark — Top Competitors (Traffic-Based)</h2>
      <table class="competitor-table">
        <thead><tr><th>Competitor</th><th>Traffic Rank</th><th>Key Features</th><th>Pricing</th><th>AI Shark Gap</th></tr></thead>
        <tbody>
          <tr>
            <td>LivePlan</td>
            <td><span class="badge badge-red">#1 (Comscore)</span></td>
            <td>500+ templates, QuickBooks sync, 5-yr forecasts, milestone tracking</td>
            <td>$15-30/mo</td>
            <td>Templates, QB integration</td>
          </tr>
          <tr>
            <td>Enloop</td>
            <td><span class="badge badge-yellow">#2</span></td>
            <td>Free tier, auto-text gen, 16 financial ratios, real-time scoring</td>
            <td>Free – $39.95/mo</td>
            <td>Free tier offering</td>
          </tr>
          <tr>
            <td>IdeaProof</td>
            <td><span class="badge badge-yellow">#3</span></td>
            <td>50+ criteria, TAM/SAM/SOM, 120-sec analysis, brand strategy</td>
            <td>Premium tiers</td>
            <td>Brand strategy tools</td>
          </tr>
          <tr>
            <td>PrometAI</td>
            <td><span class="badge badge-blue">#4</span></td>
            <td>SWOT, investor-ready plans, financial forecasting</td>
            <td>Free trial + premium</td>
            <td>Investor pitch mode</td>
          </tr>
          <tr>
            <td><strong>AI Shark</strong></td>
            <td><span class="badge badge-green">Growing</span></td>
            <td>10-criteria AI scoring, SWOT, market analysis, 6 financial ratios, PDF export, bank debt focus</td>
            <td>$6.99/mo or $13.99</td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Recommended Actions for Next Week</h2>
      <ul>
        <li>Review and resolve any unresolved customer feedback (<strong>${unresolvedFeedback.length} items pending</strong>)</li>
        <li>Consider adding a <strong>free trial tier</strong> (1 evaluation) to compete with Enloop's free offering and reduce signup friction</li>
        <li>Explore <strong>business plan templates</strong> to compete with LivePlan's 500+ template library</li>
        <li>Add <strong>financial projection builder</strong> (3-5 year P&amp;L, cash flow) to match LivePlan and Enloop features</li>
        <li>Monitor Google AdSense approval status and set up ad placements to generate ad revenue alongside subscriptions</li>
        <li>Consider <strong>investor pitch mode</strong> — a separate scoring context for VC/angel investor presentations (like PrometAI)</li>
      </ul>
    </div>

    <div class="section">
      <h2>Platform Health</h2>
      <div class="highlight">
        Check live site health at: <a href="https://aishark.org/api/health">aishark.org/api/health</a>
      </div>
      <ul>
        <li>Authentication: Email/password with bcrypt (12 rounds)</li>
        <li>AI Engine: Gemini 2.5 Flash via Replit AI Integrations</li>
        <li>Payment: Stripe live account (subscription + one-time)</li>
        <li>Email: Resend API from info@aishark.org</li>
        <li>Database: PostgreSQL via Replit + Drizzle ORM</li>
        <li>ADA/WCAG 2.1: Compliant across all pages</li>
      </ul>
    </div>

  </div>
  <div class="footer">
    AI Shark Weekly Site Report | Generated automatically every Sunday at 8pm | <a href="mailto:info@aishark.org">info@aishark.org</a>
  </div>
</div>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [REVENUE_REPORT_EMAIL],
      subject: `AI Shark Weekly Site Report — ${weekStr}`,
      html,
    });

    if (error) {
      console.error("[Site Report] Failed to send email:", error);
      return;
    }

    console.log(`[Site Report] Weekly site report sent successfully! ID: ${data?.id}`);
  } catch (error) {
    console.error("[Site Report] Error sending weekly site report:", error);
  }
}

export function startWeeklySiteReportScheduler() {
  const nextTime = getNextSunday8PM();
  const msUntilNext = nextTime.getTime() - Date.now();

  console.log(`[Site Report] Started. Next report: ${nextTime.toISOString()}`);
  console.log(`[Site Report] Time until next report: ${Math.round(msUntilNext / 1000 / 60 / 60)} hours`);

  safeSetTimeout(() => {
    sendWeeklySiteReport();
    setInterval(() => {
      sendWeeklySiteReport();
    }, 7 * 24 * 60 * 60 * 1000);
  }, msUntilNext);
}

export async function triggerSiteReportManually() {
  console.log("[Site Report] Manual trigger requested");
  await sendWeeklySiteReport();
}

// ──────────────────────────────────────────────────────────────────────
// Weekly Site Visits & Clicks Report
// Sends every Monday 9am with the previous 7 days of page views and CTA clicks.
// ──────────────────────────────────────────────────────────────────────

function getNextMonday9AM(): Date {
  const now = new Date();
  const next = new Date(now);
  const day = now.getDay(); // 0=Sun..6=Sat
  const daysUntilMonday = ((1 - day + 7) % 7) || 7;
  next.setDate(now.getDate() + daysUntilMonday);
  next.setHours(9, 0, 0, 0);
  // If it's Monday before 9am, schedule for today
  if (day === 1 && now.getHours() < 9) {
    next.setDate(now.getDate());
  }
  return next;
}

async function sendWeeklyVisitsReport() {
  try {
    const resend = getResend();
    if (!resend) {
      console.log("[Visits Report] Skipping - Resend not configured");
      return;
    }

    const events = await storage.getSiteEventsLastWeek();
    const visits = events.filter(e => e.eventType === "visit");
    const clicks = events.filter(e => e.eventType === "click");

    // Aggregate visits by path
    const visitsByPath = new Map<string, { total: number; unique: Set<string> }>();
    for (const v of visits) {
      const key = v.path || "/";
      if (!visitsByPath.has(key)) {
        visitsByPath.set(key, { total: 0, unique: new Set<string>() });
      }
      const entry = visitsByPath.get(key)!;
      entry.total++;
      if (v.ipHash) entry.unique.add(v.ipHash);
    }

    // Aggregate clicks by label
    const clicksByLabel = new Map<string, number>();
    for (const c of clicks) {
      const key = c.label || "(unlabeled)";
      clicksByLabel.set(key, (clicksByLabel.get(key) || 0) + 1);
    }

    // Aggregate visits by day
    const visitsByDay = new Map<string, number>();
    for (const v of visits) {
      const d = new Date(v.occurredAt).toISOString().split("T")[0];
      visitsByDay.set(d, (visitsByDay.get(d) || 0) + 1);
    }

    // Aggregate top referrers
    const referrerCounts = new Map<string, number>();
    for (const v of visits) {
      if (!v.referrer) continue;
      try {
        const host = new URL(v.referrer).hostname.replace(/^www\./, "");
        if (host === "aishark.org") continue;
        referrerCounts.set(host, (referrerCounts.get(host) || 0) + 1);
      } catch {}
    }

    const totalVisits = visits.length;
    const uniqueVisitors = new Set(visits.map(v => v.ipHash).filter(Boolean)).size;
    const totalClicks = clicks.length;
    const weekStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const sortedPaths = Array.from(visitsByPath.entries())
      .sort((a, b) => b[1].total - a[1].total);
    const sortedClicks = Array.from(clicksByLabel.entries())
      .sort((a, b) => b[1] - a[1]);
    const sortedReferrers = Array.from(referrerCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const sortedDays = Array.from(visitsByDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]));

    // CSV summary
    const csvLines: string[] = [];
    csvLines.push("SECTION,Path/Label,Total,Unique");
    csvLines.push(`SUMMARY,Total Visits,${totalVisits},`);
    csvLines.push(`SUMMARY,Unique Visitors,${uniqueVisitors},`);
    csvLines.push(`SUMMARY,Total Clicks,${totalClicks},`);
    csvLines.push("");
    csvLines.push("PAGE VISITS,Path,Visits,Unique Visitors");
    for (const [path, e] of sortedPaths) {
      csvLines.push(`PAGE VISITS,"${path}",${e.total},${e.unique.size}`);
    }
    csvLines.push("");
    csvLines.push("CLICKS,Label,Count,");
    for (const [label, count] of sortedClicks) {
      csvLines.push(`CLICKS,"${label}",${count},`);
    }
    csvLines.push("");
    csvLines.push("REFERRERS,Domain,Visits,");
    for (const [host, count] of sortedReferrers) {
      csvLines.push(`REFERRERS,"${host}",${count},`);
    }
    const csv = csvLines.join("\n");

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
  body{font-family:Inter,Arial,sans-serif;color:#1f2937;background:#f9fafb;margin:0;padding:24px;}
  .wrap{max-width:760px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);}
  h1{color:#0a4d8c;margin:0 0 4px;font-size:24px;}
  h2{color:#0a4d8c;margin:28px 0 12px;font-size:18px;border-bottom:2px solid #e5e7eb;padding-bottom:6px;}
  .meta{color:#6b7280;font-size:13px;margin-bottom:16px;}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0;}
  .stat{background:#f0f7ff;border:1px solid #cfe3ff;border-radius:8px;padding:14px;text-align:center;}
  .stat .num{font-size:28px;font-weight:700;color:#0a4d8c;}
  .stat .lab{font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.4px;margin-top:4px;}
  table{border-collapse:collapse;width:100%;font-size:14px;}
  th,td{border:1px solid #e5e7eb;padding:8px 10px;text-align:left;}
  th{background:#f3f4f6;font-weight:600;}
  td.num,th.num{text-align:right;font-variant-numeric:tabular-nums;}
  .empty{color:#9ca3af;font-style:italic;font-size:13px;}
  .footer{color:#9ca3af;font-size:12px;text-align:center;margin-top:24px;}
</style></head><body><div class="wrap">
  <h1>AI Shark — Weekly Site Visits &amp; Clicks Report</h1>
  <div class="meta">Week ending ${weekStr} · aishark.org</div>

  <div class="stats">
    <div class="stat"><div class="num">${totalVisits.toLocaleString()}</div><div class="lab">Page Visits</div></div>
    <div class="stat"><div class="num">${uniqueVisitors.toLocaleString()}</div><div class="lab">Unique Visitors</div></div>
    <div class="stat"><div class="num">${totalClicks.toLocaleString()}</div><div class="lab">CTA Clicks</div></div>
  </div>

  <h2>Visits by Day</h2>
  ${sortedDays.length === 0 ? `<p class="empty">No visits recorded this week.</p>` : `
  <table>
    <thead><tr><th>Date</th><th class="num">Visits</th></tr></thead>
    <tbody>
      ${sortedDays.map(([d, n]) => `<tr><td>${d}</td><td class="num">${n.toLocaleString()}</td></tr>`).join("")}
    </tbody>
  </table>`}

  <h2>Top Pages</h2>
  ${sortedPaths.length === 0 ? `<p class="empty">No page views recorded.</p>` : `
  <table>
    <thead><tr><th>Path</th><th class="num">Visits</th><th class="num">Unique Visitors</th></tr></thead>
    <tbody>
      ${sortedPaths.map(([p, e]) => `<tr><td>${p}</td><td class="num">${e.total.toLocaleString()}</td><td class="num">${e.unique.size.toLocaleString()}</td></tr>`).join("")}
    </tbody>
  </table>`}

  <h2>Top CTA Clicks</h2>
  ${sortedClicks.length === 0 ? `<p class="empty">No CTA clicks tracked yet. Use the trackClick() helper on key buttons (Sign Up, Pricing, Upload) to populate this list.</p>` : `
  <table>
    <thead><tr><th>Label</th><th class="num">Clicks</th></tr></thead>
    <tbody>
      ${sortedClicks.map(([l, n]) => `<tr><td>${l}</td><td class="num">${n.toLocaleString()}</td></tr>`).join("")}
    </tbody>
  </table>`}

  <h2>Top External Referrers</h2>
  ${sortedReferrers.length === 0 ? `<p class="empty">No external referrers recorded this week.</p>` : `
  <table>
    <thead><tr><th>Domain</th><th class="num">Visits</th></tr></thead>
    <tbody>
      ${sortedReferrers.map(([h, n]) => `<tr><td>${h}</td><td class="num">${n.toLocaleString()}</td></tr>`).join("")}
    </tbody>
  </table>`}

  <div class="footer">
    Automated weekly report from AI Shark · sent every Monday at 9am · CSV summary attached
  </div>
</div></body></html>`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [RECIPIENT_EMAIL],
      subject: `AI Shark Weekly Visits & Clicks Report — ${weekStr}`,
      html,
      attachments: [
        {
          filename: `visits_clicks_${new Date().toISOString().split("T")[0]}.csv`,
          content: Buffer.from(csv, "utf-8"),
        },
      ],
    });

    if (error) {
      console.error("[Visits Report] Failed to send email:", error);
      return;
    }
    console.log(`[Visits Report] Sent successfully! ID: ${data?.id} · ${totalVisits} visits, ${uniqueVisitors} unique, ${totalClicks} clicks`);
  } catch (error) {
    console.error("[Visits Report] Error:", error);
  }
}

export function startWeeklyVisitsReportScheduler() {
  const next = getNextMonday9AM();
  const ms = next.getTime() - Date.now();
  console.log(`[Visits Report] Started. Next report scheduled for: ${next.toISOString()}`);
  console.log(`[Visits Report] Time until next report: ${Math.round(ms / 1000 / 60 / 60)} hours`);
  safeSetTimeout(() => {
    sendWeeklyVisitsReport();
    setInterval(() => sendWeeklyVisitsReport(), 7 * 24 * 60 * 60 * 1000);
  }, ms);
}

export async function triggerVisitsReportManually() {
  console.log("[Visits Report] Manual trigger requested");
  await sendWeeklyVisitsReport();
}

// ── Teaser lead drip (3-day remarketing sequence) ───────────────────
// Day 1: score recap. Day 2: why banks reject at that score. Day 3: 15% off.
// Runs hourly; each lead advances at most one stage per run, gated on age.
// Leads whose email already has a registered account are skipped (they're
// already in the funnel) but still marked so we don't re-check forever.

const DRIP_DISCOUNT_CODE = "SHARK15";
const SITE_URL = "https://aishark.org";

function dripFooter(lead: TeaserLead): string {
  return `<p style="color:#888;font-size:12px;margin-top:32px">
    You're receiving this because you requested a free business plan score at aishark.org.
    <a href="${SITE_URL}/api/unsubscribe?token=${lead.unsubscribeToken}">Unsubscribe</a></p>`;
}

function dripEmail(stage: number, lead: TeaserLead): { subject: string; html: string } {
  const score = lead.score ?? null;
  const grade = lead.grade ?? null;
  const scoreLine = score !== null
    ? `<p style="font-size:18px">Your plan scored <strong>${score}/100</strong>${grade ? ` (Lender Readiness Grade: <strong>${grade}</strong>)` : ""}.</p>`
    : "";
  if (stage === 1) {
    return {
      subject: score !== null ? `Your business plan score: ${score}/100` : "Your free business plan score",
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2>Here's your free score again</h2>${scoreLine}
        <p>Your free preview showed <em>what's</em> holding your plan back. The full report shows exactly <em>how to fix it</em>: all 10 bank lending criteria scored, specific recommendations, 6 financial ratios, SWOT, and a downloadable PDF.</p>
        <p><a href="${SITE_URL}/pricing" style="background:#0846AA;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Get my full report — $13.99</a></p>
        ${dripFooter(lead)}</div>`,
    };
  }
  if (stage === 2) {
    return {
      subject: score !== null ? `Why banks reject plans that score ${score}/100` : "Why banks reject most business plans",
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2>Most plans don't pass on the first try</h2>${scoreLine}
        <p>Loan officers screen against the same criteria every time — debt service coverage, cash flow, collateral, management experience. A plan that scores below the bar on even one of them usually gets a "no" without an explanation.</p>
        <p>The good news: these are fixable before you ever walk into the bank. The full AI Shark report tells you exactly which criteria are failing and what to change.</p>
        <p><a href="${SITE_URL}/pricing" style="background:#0846AA;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">See what's failing — $13.99</a></p>
        ${dripFooter(lead)}</div>`,
    };
  }
  return {
    subject: "15% off your full AI Shark analysis — today",
    html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2>Take 15% off the full analysis</h2>${scoreLine}
      <p>Use code <strong style="font-size:18px">${DRIP_DISCOUNT_CODE}</strong> at checkout for 15% off — that's the full 10-criteria report, specific fixes, financial ratios, SWOT, and PDF for less than the cost of lunch.</p>
      <p><a href="${SITE_URL}/pricing" style="background:#0846AA;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Use my 15% discount</a></p>
      ${dripFooter(lead)}</div>`,
  };
}

async function processTeaserDrip() {
  const resend = getResend();
  if (!resend) return;
  try {
    // Descending order so a lead advances at most ONE stage per hourly run —
    // ascending would walk an overdue lead through all three emails at once.
    for (const stage of [3, 2, 1]) {
      const cutoff = new Date(Date.now() - stage * 24 * 60 * 60 * 1000);
      const due = await storage.getTeaserLeadsDueForStage(stage, cutoff);
      for (const lead of due) {
        try {
          // Skip (but advance) leads that registered an account — they get
          // the in-product funnel instead of remarketing email.
          const registered = await storage.emailHasRegistration(lead.email);
          if (!registered) {
            const { subject, html } = dripEmail(stage, lead);
            await resend.emails.send({ from: FROM_EMAIL, to: lead.email, subject, html });
            console.log(`[Teaser Drip] Sent stage ${stage} to lead ${lead.id}`);
          }
          await storage.markTeaserLeadStage(lead.id, stage);
        } catch (e: any) {
          console.error(`[Teaser Drip] Failed lead ${lead.id} stage ${stage}:`, e?.message);
        }
      }
    }
  } catch (e: any) {
    console.error("[Teaser Drip] run failed:", e?.message);
  }
}

export function startTeaserDripScheduler() {
  console.log("[Teaser Drip] Started — checking hourly");
  setInterval(() => processTeaserDrip(), 60 * 60 * 1000);
  // First pass shortly after boot so restarts don't delay overdue sends.
  setTimeout(() => processTeaserDrip(), 60 * 1000);
}
