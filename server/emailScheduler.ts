import { storage } from "./storage";
import { Resend } from "resend";

const RECIPIENT_EMAIL = "vemangum@gmail.com";
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
