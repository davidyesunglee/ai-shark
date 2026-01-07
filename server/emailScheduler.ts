import { storage } from "./storage";

const RECIPIENT_EMAIL = "vemangum@gmail.com";

function getNextSundayMidnight(): Date {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(0, 0, 0, 0);
  return nextSunday;
}

function formatRegistrationsAsCSV(registrations: any[]): string {
  if (registrations.length === 0) {
    return "No new registrations this week.";
  }

  const header = "Username,Email,Phone,Street Address,City,State,Zip,Country,Company,Job Title,Industry,Company Size,How Heard,Registered At";
  const rows = registrations.map(r => 
    `"${r.username}","${r.email}","${r.phoneNumber}","${r.streetAddress}","${r.city}","${r.state}","${r.zipCode}","${r.country}","${r.companyName || ''}","${r.jobTitle || ''}","${r.industry || ''}","${r.companySize || ''}","${r.howDidYouHear || ''}","${r.registeredAt}"`
  );
  
  return header + "\n" + rows.join("\n");
}

async function sendWeeklyEmail() {
  try {
    const unsentRegistrations = await storage.getUnsentRegistrations();
    
    if (unsentRegistrations.length === 0) {
      console.log("[Email Scheduler] No new registrations to send this week.");
      return;
    }

    const csvContent = formatRegistrationsAsCSV(unsentRegistrations);
    const emailBody = `
AI Shark Weekly Registration Report
====================================
Date: ${new Date().toLocaleDateString()}
New Registrations: ${unsentRegistrations.length}

Registration Data (CSV format):
${csvContent}

---
This is an automated weekly report from AI Shark.
    `.trim();

    console.log(`[Email Scheduler] Weekly report ready for ${RECIPIENT_EMAIL}`);
    console.log(`[Email Scheduler] Report contains ${unsentRegistrations.length} new registrations`);
    console.log(`[Email Scheduler] Email content preview:\n${emailBody.substring(0, 500)}...`);
    
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
