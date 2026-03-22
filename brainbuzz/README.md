# 🧠 BrainBuzz

An interactive quiz platform built with the MERN stack. Features user authentication, score tracking, leaderboards, and an admin panel to create & manage quizzes.

---

## 🚀 Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite, React Router v6   |
| Backend  | Node.js, Express.js               |
| Database | MongoDB, Mongoose                 |
| Auth     | JWT (JSON Web Tokens), bcryptjs   |
| Styling  | CSS Modules, Google Fonts         |

---

## ✨ Features

- 🔐 User registration & login with JWT authentication
- ⚡ 15-second countdown timer per question
- 📊 Animated score counter & live leaderboard
- 🌙 Dark / Light theme toggle
- 🏆 Result page with confetti for high scores
- 🛡️ Admin panel to create, edit & delete quizzes
- 📱 6 built-in quiz categories (Tech, Science, Math, General & more)

---

## 📁 Folder Structure

```
brainbuzz/
│
├── server/                        # Node + Express backend
│   ├── index.js                   # Entry point
│   ├── .env                       # Environment variables
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Score.js               # Score schema
│   ├── middleware/
│   │   └── auth.js                # JWT middleware
│   ├── routes/
│   │   ├── auth.js                # Register & Login
│   │   ├── quiz.js                # Quiz bank routes
│   │   └── scores.js              # Score & leaderboard routes
│   └── scripts/
│       └── makeAdmin.js           # Promote user to admin
│
└── client/                        # React + Vite frontend
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx                # Routes & guards
        ├── index.css              # Global styles & CSS variables
        ├── context/
        │   └── AuthContext.jsx    # Global auth & theme state
        ├── components/
        │   └── Navbar.jsx
        └── pages/
            ├── Auth.jsx           # Login & Register
            ├── Dashboard.jsx      # Stats, quizzes, leaderboard
            ├── Quiz.jsx           # Active quiz with timer
            ├── Result.jsx         # Score breakdown
            ├── CreateQuiz.jsx     # Admin quiz builder
            └── ManageQuizzes.jsx  # Admin edit & delete
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local) or [MongoDB Atlas](https://cloud.mongodb.com) (free cloud)

---

### 1. Clone the repo

```bash
git clone https://github.com/devarsh-soni-git/Brainbuzz.git
cd Brainbuzz
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/brainbuzz
JWT_SECRET=your_secret_key_here
```

> 💡 For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

Start the server:

```bash
npm run dev
```

✅ Server runs on `http://localhost:5000`

---

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

✅ App runs on `http://localhost:5173`

---

## 🛡️ Admin Setup

After registering an account, run this script to promote yourself to admin:

```bash
cd server
node scripts/makeAdmin.js your@email.com
```

Once done, log back in — you'll see the **⚙ My Quizzes** button in the navbar.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | `/api/auth/register` | Register new user  |
| POST   | `/api/auth/login`    | Login & get token  |

### Quiz
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/quiz`           | Get all quiz categories  |
| GET    | `/api/quiz/:category` | Get full quiz questions  |

### Scores
| Method | Endpoint                   | Description             |
|--------|----------------------------|-------------------------|
| POST   | `/api/scores`              | Save quiz result        |
| GET    | `/api/scores/leaderboard`  | Get top 10 players      |
| GET    | `/api/scores/me`           | Get current user history|

---

## 📸 Pages Overview

| Page            | Route              | Access       |
|-----------------|--------------------|--------------|
| Auth            | `/auth`            | Public       |
| Dashboard       | `/`                | Logged in    |
| Quiz            | `/quiz/:category`  | Logged in    |
| Result          | `/result`          | Logged in    |
| Create Quiz     | `/create-quiz`     | Admin only   |
| Manage Quizzes  | `/manage-quizzes`  | Admin only   |

---

## 🔒 Environment Variables

| Variable    | Description                        |
|-------------|------------------------------------|
| `PORT`      | Port for the Express server        |
| `MONGO_URI` | MongoDB connection string          |
| `JWT_SECRET`| Secret key for signing JWT tokens  |

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

---

## 📄 License

MIT — free to use and modify.

---

<p align="center">Built with ❤️ using the MERN Stack</p>
