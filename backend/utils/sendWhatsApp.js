const axios = require("axios");

const sendWhatsAppMessage = async (order) => {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;

    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: adminNumber,
        type: "template",
        template: {
          name: "new_order_alert",
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: order.fullName || "—" },
                { type: "text", text: order.phone || "—" },
                { type: "text", text: order.city || "—" },
                {
                  type: "text",
                  text: String(order.totalPrice || 0),
                },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ WhatsApp template message sent:", response.data);
    return true;
  } catch (err) {
    console.error(
      "❌ WhatsApp send failed:",
      err.response?.data || err.message,
    );
    return false;
  }
};

module.exports = sendWhatsAppMessage;
