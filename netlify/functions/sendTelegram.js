// 🛡️ Simple in-memory rate limit
const rateLimitMap = new Map();

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
  const body = JSON.parse(event.body);
const { name, email, phone, business, payments } = body;

// 🛑 Honeypot check (silently ignore bots)
if (body.company) {
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
}

    // 🛡️ RATE LIMIT START
const ip =
  event.headers["x-forwarded-for"] ||
  event.headers["client-ip"] ||
  "unknown";

const now = Date.now();
const windowMs = 10 * 60 * 1000; // 10 minutes
const maxRequests = 5;

if (!rateLimitMap.has(ip)) {
  rateLimitMap.set(ip, []);
}

const timestamps = rateLimitMap
  .get(ip)
  .filter(ts => now - ts < windowMs);

if (timestamps.length >= maxRequests) {
  return {
    statusCode: 429,
    body: JSON.stringify({ error: "Too many requests" })
  };
}

timestamps.push(now);
rateLimitMap.set(ip, timestamps);
// 🛡️ RATE LIMIT END

    const message = `
🔔 *New Lead – PaymentSwitch*

👤 *Name:* ${name}
📧 *Email:* ${email}
📞 *Phone:* ${phone}
🏢 *Business Type:* ${business}
💳 *Payments:* ${payments}

🌐 Website: paymentswitch.co.uk
🕒 Time: ${new Date().toLocaleString("en-GB")}
`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: message,
          parse_mode: "Markdown"
        })
      }
    );

    if (!telegramResponse.ok) {
      const errText = await telegramResponse.text();
      throw new Error(errText);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error("Telegram error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Telegram failed" })
    };
  }
}

