/**
 * Optional contact-form email notification.
 *
 * Active ONLY when RESEND_API_KEY, CONTACT_NOTIFY_EMAIL and
 * CONTACT_FROM_EMAIL are all set. Otherwise this no-ops silently —
 * messages are still saved to the database and readable in
 * Admin → Messages. Email notification is an optional step (see DEPLOY.md).
 */
export async function notifyNewMessage(msg: {
  name: string;
  email: string;
  org?: string | null;
  body: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: msg.email,
        subject: `New portfolio message from ${msg.name}`,
        text:
          `Name: ${msg.name}\nEmail: ${msg.email}\n` +
          (msg.org ? `Organization: ${msg.org}\n` : "") +
          `\n${msg.body}\n`,
      }),
    });
  } catch (err) {
    // Notification failure must never fail the contact submission itself.
    console.error("Contact notification failed:", err);
  }
}
