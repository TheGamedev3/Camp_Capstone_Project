# 🧪 Project Overview – Phase 1: User Entry/Exit System

This version of the project implements **basic user entry and exit capabilities**.  
Users can:

- 🔐 Log in and log out  
- 📄 View a paginated list of other users  

---

## 🧱 Tech Stack

This is a modern **MERN-based stack**, adapted for clarity and productivity:

| Layer     | Technology                  | Purpose                                     |
|-----------|-----------------------------|---------------------------------------------|
| **M**     | `MongoDB` + `Mongoose`      | Schema-backed NoSQL database                |
| **E**     | `Next.js API Routes`        | Backend routes (replaces traditional Express) |
| **R**     | `React + TypeScript (TSX)`  | Type-safe frontend UI framework             |
| **N**     | `Node.js`                   | Backend runtime for server logic            |

> ✅ **Note:** This project uses **Next.js** to seamlessly bundle both Express-like API routing and React pages in a unified codebase.

---

## 🔍 Extra Tooling

- **TypeScript** – Provides type safety and better editor support.
- **Playwright** – Handles **end-to-end (E2E)** testing with realistic browser simulations.

---

## 📦 Scripts & Usage

### ▶️ Start the Development Server

```bash
npm run dev
```

### 🧪 Run All Unit Tests

```bash
$env:TEST_PATH=""; npm run unitTests
```

### 🧪 Run a Specific Test File

```bash
$env:TEST_PATH="tests/user/explorer.test.ts"; npm run unitTests
```

---

## 🕒 Project Date

This snapshot was built on **August 2, 2025**.  
Some tools, methods, or libraries may be outdated in future versions.

---

## 💡 Suggestions for Improvement

- 📁 Move common types to a shared `types/` folder (at root or `src/`)
- 🧹 Sanitize sensitive fields (e.g., remove `.password` even if hashed) before sending to client
- 🧪 Add more edge-case test coverage (e.g. invalid login, pagination overflow)
- 📄 Consider a README diagram showing the login flow or file structure
- 📦 Add `.env.example` to clarify required environment variables
