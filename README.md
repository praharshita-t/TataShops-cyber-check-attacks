# TataShops — Application Security & DAST Laboratory

**TataShops** is an educational e-commerce web application built for dynamic application security testing (DAST), penetration testing, and vulnerability assessment with **OWASP Zed Attack Proxy (ZAP)** and manual audit techniques.

---

## 🛠️ Technology Stack

* **Frontend:** React 19, Vite, React Router DOM, Custom CSS Design System
* **Backend:** Node.js, Express.js (REST API)
* **Database:** SQLite (using `better-sqlite3`)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt password hashing

---

## 🎯 Configured OWASP Top 10 Security Weaknesses

1. **A01:2021 — Broken Access Control (IDOR):**
   * Target: `GET /api/orders/:id`
   * Missing ownership check allows authenticated users to view order receipts belonging to other users.

2. **A03:2021 — Injection (SQL Injection):**
   * Target: `GET /api/products/search?q=`
   * Unparameterized template literal string interpolation in SQLite search queries.

3. **A05:2021 — Security Misconfiguration:**
   * Wildcard Cross-Origin Resource Sharing (`Access-Control-Allow-Origin: *`).
   * Verbose internal error stack trace leakage in API error responses.
   * Server technology fingerprinting (`X-Powered-By: Express`).

4. **A06:2021 — Vulnerable and Outdated Components:**
   * Outdated `jsonwebtoken@8.5.1` with documented CVE advisories (CVE-2022-23529 / CVE-2022-23540).

---

## 🚀 Getting Started

### 1. Backend Setup (Port 5000)
```bash
cd backend
npm install
npm run seed     # Automatically initializes SQLite database & seed data
npm start        # Starts Express server on http://localhost:5000
```

### 2. Frontend Setup (Port 5173)
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## 👤 Development Testing Credentials

* **Regular Customer Account:**
  * **Email:** `user@tatashops.local`
  * **Password:** `UserLab2026!`

* **Administrator Account:**
  * **Email:** `admin@tatashops.local`
  * **Password:** `AdminLab2026!`

---

## 📄 Assessment Documentation
For complete vulnerability analysis and ZAP findings, refer to:
* [`OWASP_ZAP_Security_Report.md`](./OWASP_ZAP_Security_Report.md)
