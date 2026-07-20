# 🌾 KaAni AI

**KaAni AI** (Kasama sa Bukid at Dagat) is an AI-powered agricultural assistant designed to help Filipino farmers and fisherfolk make informed decisions through accessible, practical, and localized farming advice.

The assistant communicates in natural **Tagalog**, making agricultural knowledge easier to understand for local communities while leveraging Google's Gemini AI to provide intelligent recommendations.

---

## ✨ Features

- 🌱 Crop farming assistance
- 🐟 Fish farming (Aquaculture) guidance
- 🌾 Rice, vegetable, and fruit farming recommendations
- 🦠 Pest and disease management
- 💧 Irrigation and water management advice
- 🌦 Weather-based farming recommendations
- 📅 Planting and harvesting schedules
- 💰 Farm budgeting and productivity planning
- 🌍 Sustainable agriculture practices
- 🤖 AI-powered conversational assistant
- 🇵🇭 Natural Tagalog responses for Filipino farmers

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- Google Gemini API
- JavaScript (ES Modules)

### Frontend

- HTML
- CSS
- JavaScript

---

## 📁 Project Structure

```
Backend/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
│
├── public/
│
├── .env
├── package.json
└── README.md
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/kaani-ai.git

cd kaani-ai/Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
PORT=4000

FRONTEND_URL=http://localhost:3000

GEN_API_KEY=YOUR_GEMINI_API_KEY
```

---

## ▶ Running the project

Development mode

```bash
npm run dev
```

Production

```bash
npm start
```

Server runs on

```
http://localhost:4000
```

---

## 📡 API Endpoint

### Chat with KaAni AI

```
POST /api/chat-bot
```

Example request

```json
{
    "message": "Ano ang pinakamainam na pataba para sa palay?"
}
```

Example response

```json
{
    "response": "Batay sa yugto ng paglaki ng palay..."
}
```

---

## 🎯 Project Goals

KaAni AI aims to:

- Help Filipino farmers make better farming decisions.
- Improve agricultural productivity.
- Promote sustainable farming practices.
- Provide agricultural knowledge in simple Tagalog.
- Serve as an accessible AI farming companion.

---

## 💡 Vision

To become every Filipino farmer's trusted **"Kasama sa Bukid at Dagat"** by delivering practical, accurate, and easy-to-understand agricultural guidance through artificial intelligence.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developers

Developed as part of an agricultural innovation initiative to support Filipino farming communities through AI technology.