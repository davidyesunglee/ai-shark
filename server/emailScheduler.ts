import { storage } from "./storage";
import { Resend } from "resend";
import type { TransactionRecord } from "@shared/schema";

const RECIPIENT_EMAIL = "vemangum@gmail.com";
const REVENUE_REPORT_EMAIL = "aisharkphd@gmail.com";
const FROM_EMAIL = "AI Shark <onboarding@resend.dev>";

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
    `"${r.username}","${r.email}","${r.phoneNumber}","${r.streetAddress}","${r.city}","${r.state}","${r.zipCode}","${r.country}","${r.companyName || ''}","${r.jobTitle || ''}","${r.industry || ''}","${r.companySize || ''}","${r.howDidYouHear || ''}","${r.registeredAt}"`
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
        <td>${r.phoneNumber}</td>
        <td>${r.city}</td>
        <td>${r.state}</td>
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

  setTimeout(() => {
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

  setTimeout(() => {
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

function formatRevenueReportAsCSV(subscriptions: RevenueGroup, oneTime: RevenueGroup): string {
  const header = "Type,Transaction Count,Total Revenue,Total Tax,Net Revenue";
  
  const subNet = (subscriptions.totalAmount - subscriptions.totalTax) / 100;
  const oneTimeNet = (oneTime.totalAmount - oneTime.totalTax) / 100;
  const grandTotal = subNet + oneTimeNet;
  
  const rows = [
    `"Monthly Subscriptions","${subscriptions.count}","$${(subscriptions.totalAmount / 100).toFixed(2)}","$${(subscriptions.totalTax / 100).toFixed(2)}","$${subNet.toFixed(2)}"`,
    `"One-Time Payments","${oneTime.count}","$${(oneTime.totalAmount / 100).toFixed(2)}","$${(oneTime.totalTax / 100).toFixed(2)}","$${oneTimeNet.toFixed(2)}"`,
    `"TOTAL","${subscriptions.count + oneTime.count}","$${((subscriptions.totalAmount + oneTime.totalAmount) / 100).toFixed(2)}","$${((subscriptions.totalTax + oneTime.totalTax) / 100).toFixed(2)}","$${grandTotal.toFixed(2)}"`
  ];
  
  return header + "\n" + rows.join("\n");
}

function formatRevenueReportAsHTML(subscriptions: RevenueGroup, oneTime: RevenueGroup, registrations: Map<string, any>): string {
  const subNet = (subscriptions.totalAmount - subscriptions.totalTax) / 100;
  const oneTimeNet = (oneTime.totalAmount - oneTime.totalTax) / 100;
  const grandTotal = subNet + oneTimeNet;
  const totalTransactions = subscriptions.count + oneTime.count;

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
        <tr style="background-color: #dcfce7; font-weight: bold;">
          <td>TOTAL</td>
          <td style="text-align: center;">${totalTransactions}</td>
          <td style="text-align: right;">$${((subscriptions.totalAmount + oneTime.totalAmount) / 100).toFixed(2)}</td>
          <td style="text-align: right;">$${((subscriptions.totalTax + oneTime.totalTax) / 100).toFixed(2)}</td>
          <td style="text-align: right;">$${grandTotal.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  `;

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

    const csvContent = formatRevenueReportAsCSV(subscriptions, oneTime);
    const htmlContent = formatRevenueReportAsHTML(subscriptions, oneTime, registrations);
    const csvBuffer = Buffer.from(csvContent, 'utf-8');

    console.log(`[Revenue Report] Sending weekly report to ${REVENUE_REPORT_EMAIL}`);
    console.log(`[Revenue Report] Subscriptions: ${subscriptions.count}, One-time: ${oneTime.count}`);

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

  setTimeout(() => {
    sendRevenueReport();
    
    // Then repeat every 7 days
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

  setTimeout(() => {
    sendExpenseReport();
    
    // Then repeat every 7 days
    setInterval(() => {
      sendExpenseReport();
    }, 7 * 24 * 60 * 60 * 1000);
  }, msUntilNext);
}

export async function triggerExpenseReportManually() {
  console.log("[Expense Report] Manual trigger requested");
  await sendExpenseReport();
}
