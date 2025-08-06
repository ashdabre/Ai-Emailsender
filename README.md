# AI Email Generator

A minimal yet powerful AI-powered email generator and sender. This project:

- Generates professional email content using **LLaMA 3 (via Groq API)**
- Sends emails using **Gmail (via Nodemailer)**
- Displays live logs both in the **terminal** and on **localhost:5000**

---

##  Live Preview

 [Live Frontend](https://ai-emailsender.netlify.app/)
 [Live backend](https://ai-emailsender-1.onrender.com/)


 Local Dev URL: http://localhost:5000

---

##  Features

###  AI-Generated Emails
- Prompts processed through **Groq API with LLaMA 3**
- Generates human-like, professional email content

###  Email Sending
- Emails sent using **Gmail + Nodemailer**
- Secure handling of credentials via `.env`


---

---

##  Environment Variables

Create a `.env` file inside the `backend` folder with the following:

```env
GMAIL_USER=yourgmail@gmail.com
GMAIL_PASS=your-app-password
GROQ_API_KEY=your-groq-api-key
⚠ Make sure .env is listed in .gitignore
```

⚙️ Local Setup
```bash

git clone https://github.com/ashdabre/Ai-Emailsender.git
cd Ai-Emailsender
npm install          # install backend dependencies
npm start            # run backend on http://localhost:5000
To run the frontend:


cd frontend
npm install
npm run dev          # runs frontend on http://localhost:5173
```

