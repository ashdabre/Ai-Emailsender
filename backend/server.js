const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

let lastPrompt = "No prompt yet.";
let lastEmail = "No email generated yet.";
let lastSentTo = "N/A";
let lastSubject = "N/A";

// === Root Route ===
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>📬 Email Generator Log</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
          h1 { color: #333; }
          pre { background: #fff; padding: 20px; border-radius: 10px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>🧠 Last AI Prompt</h1>
        <pre>${lastPrompt}</pre>

        <h1>📩 Last Generated Email</h1>
        <pre>${lastEmail}</pre>

        <h1>📤 Last Sent Email Details</h1>
        <pre>
To: ${lastSentTo}
Subject: ${lastSubject}
        </pre>
      </body>
    </html>
  `);
});

// === Nodemailer Setup ===
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// === AI Email Generator ===
app.post("/generate-email", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.length < 5) {
    return res.status(400).json({ error: "Prompt too short" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that writes professional emails based on user prompts. DO NOT use any HTML tags. Use plain text with newline characters for spacing. Keep the email clean and professional.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const email = response.data.choices[0].message.content;

    // Store for browser view
    lastPrompt = prompt;
    lastEmail = email;

    // ✅ LOG
    console.log("\n--- AI Email Generated ---");
    console.log("🧠 Prompt:", prompt);
    console.log("📩 Email Content:\n", email);

    res.json({ email });
  } catch (err) {
    console.error("❌ AI generation failed", err.response?.data || err.message);
    res.status(500).json({ error: "AI generation failed" });
  }
});

// === Email Sender ===
app.post("/send-email", async (req, res) => {
  const { recipients, subject, body } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients,
    subject,
    text: body, // ✅ plain text with newlines
  };

  try {
    await transporter.sendMail(mailOptions);

    // Save for browser view
    lastSentTo = recipients;
    lastSubject = subject;

    // ✅ LOG
    console.log("\n--- Email Sent ---");
    console.log("📧 To:", recipients);
    console.log("📝 Subject:", subject);
    console.log("💌 Body:\n", body);

    res.status(200).json({
      message: "✅ Email sent successfully!",
      to: recipients,
      subject,
    });
  } catch (err) {
    console.error("❌ Email send failed:", err);
    res.status(500).json({ error: "Email send failed" });
  }
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`🚀 Server running at: https://ai-emailsender-1.onrender.com/`);
  
});
