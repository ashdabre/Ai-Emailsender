import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [recipients, setRecipients] = useState("");
  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const generateEmail = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://ai-emailsender.onrender.com/generate-email", {
        prompt,
      });

      let raw = res.data.email || "";

      // Step 1: Remove unwanted "Subject:" and "Here's a professional email..." lines
      raw = raw
        .replace(/^Subject:.*$/im, "")
        .replace(/^Here('?s| is).*$/im, "")
        .trim();

      setEmailContent(raw);
    } catch (err) {
      alert("❌ Failed to generate email.");
    }
    setLoading(false);
  };

  const sendEmail = async () => {
    try {
      await axios.post("https://ai-emailsender.onrender.com/send-email", {
        recipients,
        subject,
        body: emailContent,
      });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      alert("❌ Failed to send email.");
    }
  };

  return (
    <div className="app-container">
      <h1>📨 AI Email Generator</h1>

      <div className="form-section">
        <label>Recipients (comma-separated):</label>
        <input
          type="text"
          value={recipients}
          placeholder="e.g., someone@example.com"
          onChange={(e) => setRecipients(e.target.value)}
        />

        <label>Subject:</label>
        <input
          type="text"
          value={subject}
          placeholder="Email subject line"
          onChange={(e) => setSubject(e.target.value)}
        />

        <label>Email Prompt / Body:</label>
        <textarea
          rows="10"
          value={prompt}
          placeholder="Enter the full email body exactly as you want it..."
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button onClick={generateEmail} disabled={loading}>
          {loading ? "Generating..." : "Generate Email"}
        </button>
      </div>

      {emailContent && (
        <div className="form-section">
          <label>Generated Email (Editable):</label>
          <textarea
            rows="14"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
          <button onClick={sendEmail}>Send Email</button>
        </div>
      )}

      {sent && <div className="popup">✅ Email sent successfully!</div>}
    </div>
  );
}

export default App;
