// api/send-whatsapp.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { appt } = req.body;
  if (!appt || !appt.patientName || !appt.phone || !appt.appointmentNo) {
    return res.status(400).json({ error: 'Missing appointment details' });
  }

  // Load credentials from environment variables securely
  const provider = process.env.WHATSAPP_PROVIDER || "Simulation"; // 'Simulation', 'UltraMsg', 'CallMeBot', 'Meta', 'Twilio'
  const apiKey = process.env.WHATSAPP_API_KEY || "";
  const phoneId = process.env.WHATSAPP_PHONE_ID || "";
  const sender = process.env.WHATSAPP_SENDER || "";
  const clinicPhone = process.env.CLINIC_PHONE || "8072097048";

  const cleanPhone = clinicPhone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  if (!formattedPhone) {
    console.error("Clinic WhatsApp Alert: No valid clinic phone number found.");
    return res.status(500).json({ error: "No valid clinic phone number found" });
  }

  const messageText = `Dear Doctor/Staff, a new eye checkup appointment has been booked.

Patient: ${appt.patientName}
Phone: ${appt.phone}
Date: ${appt.date}
Time: ${appt.time}
Appt No: ${appt.appointmentNo}`;

  try {
    if (provider === "Simulation") {
      console.log(`[Clinic WhatsApp Alert Simulation] To: +${formattedPhone}, Message: ${messageText}`);
      return res.status(200).json({ success: true, mode: 'Simulation' });
    }

    if (provider === "UltraMsg") {
      const url = `https://api.ultramsg.com/${phoneId}/messages/chat`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          token: apiKey,
          to: `+${formattedPhone}`,
          body: messageText
        })
      });
      const data = await response.json();
      return res.status(200).json({ success: true, data });
    } 
    
    if (provider === "CallMeBot") {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}&apikey=${apiKey}`;
      const response = await fetch(url);
      const text = await response.text();
      return res.status(200).json({ success: true, text });
    } 
    
    if (provider === "Meta") {
      const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: formattedPhone,
          type: "text",
          text: { body: messageText }
        })
      });
      const data = await response.json();
      return res.status(200).json({ success: true, data });
    } 
    
    if (provider === "Twilio") {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${phoneId}/Messages.json`;
      const credentials = btoa(`${phoneId}:${apiKey}`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          To: `whatsapp:+${formattedPhone}`,
          From: `whatsapp:${sender}`,
          Body: messageText
        })
      });
      const data = await response.json();
      return res.status(200).json({ success: true, data });
    }

    return res.status(400).json({ error: `Unsupported provider: ${provider}` });
  } catch (err) {
    console.error("Error sending WhatsApp notification on backend:", err);
    return res.status(500).json({ error: err.message || "Failed to send notification" });
  }
}
