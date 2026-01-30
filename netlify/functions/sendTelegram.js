export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const { name, email, phone, business, payments } = JSON.parse(event.body);

    const message = `
📩 New Enquiry – Payment Switch UK

👤 Name: ${name}
📧 Email: ${email}
📞 Phone: ${phone}
🏢 Business: ${business}
💳 Accepting payments: ${payments}
`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: message
        })
      }
    );

    if (!telegramResponse.ok) {
      throw new Error("Telegram API error");
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
