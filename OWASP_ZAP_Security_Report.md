# TataShops — Application Security Assessment & OWASP ZAP Vulnerability Report

**Target System:** TataShops E-Commerce Application  
**Assessment Type:** Dynamic Application Security Testing (DAST) & Code-Level Vulnerability Analysis  
**Testing Tooling:** OWASP Zed Attack Proxy (ZAP) v2.16.x & Manual Request Assessment  
**Scope:** Localhost Deployment (`Frontend: http://localhost:5173` | `Backend: http://localhost:5000`)  
**Assessment Date:** October 8, 2026  
**Classification:** Academic / Red Team Security Laboratory Baseline  

---

## Executive Summary

A comprehensive application security assessment was conducted against the **TataShops** full-stack web application. The testing combined automated DAST scanning via **OWASP ZAP** (Passive Scanning, Active Scanning, and Spidering) with targeted code-level evaluation against the **OWASP Top 10 (2021)** framework.

The assessment identified multiple critical, high, and medium severity vulnerabilities across four core categories:
1. **A01:2021 — Broken Access Control (IDOR in Order Retrieval)**
2. **A03:2021 — Injection (SQL Injection in Product Search)**
3. **A05:2021 — Security Misconfiguration (Permissive CORS, Missing Security Headers, Information Leaks)**
4. **A06:2021 — Vulnerable and Outdated Components (Outdated JWT Library with Known CVEs)**

---

## Vulnerability Summary Matrix

| Vulnerability ID | Vulnerability Name | OWASP Category | Severity | Target Endpoint / Component | Detection Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-VULN-01** | Insecure Direct Object Reference (IDOR) | A01:2021 — Broken Access Control | **High** | `GET /api/orders/:id` | Manual DAST / Authorization Audit |
| **TS-VULN-02** | SQL Injection (String Interpolation) | A03:2021 — Injection | **Critical** | `GET /api/products/search?q=` | Active Scan / Parameter Fuzzing |
| **TS-VULN-03** | Cross-Domain Misconfiguration (Wildcard CORS) | A05:2021 — Security Misconfiguration | **Medium** | Global Express Middleware (`/`) | ZAP Passive Scan |
| **TS-VULN-04** | Server Header & Technology Fingerprinting | A05:2021 — Security Misconfiguration | **Low** | Global HTTP Response Headers | ZAP Passive Scan |
| **TS-VULN-05** | Missing Anti-Clickjacking & CSP Headers | A05:2021 — Security Misconfiguration | **Medium** | HTTP Response Headers | ZAP Passive Scan |
| **TS-VULN-06** | Outdated Component (`jsonwebtoken@8.5.1`) | A06:2021 — Vulnerable Components | **High** | `package.json` (`jsonwebtoken`) | Dependency Audit (CVE-2022-23529) |

---

## Detailed Vulnerability Analysis

```
                      ┌────────────────────────────────────────┐
                      │          OWASP ZAP ATTACK SUITE        │
                      └───────────────────┬────────────────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
        [ Frontend: :5173 ]                             [ Backend: :5000 ]
     - Missing CSP Headers                          - Wildcard CORS (A05)
     - Missing Anti-Clickjacking                    - X-Powered-By Leak (A05)
     - Client Script Ingestion                      - SQLi in Search Query (A03)
                                                    - Order IDOR Bypasses (A01)
                                                    - Outdated jsonwebtoken (A06)
```

---

### TS-VULN-01: Insecure Direct Object Reference (IDOR)

* **OWASP Category:** A01:2021 — Broken Access Control  
* **CVSS v3.1 Score:** `7.5` (High) — `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N`  
* **Affected Endpoint:** `GET /api/orders/:id`  
* **Source Location:** `backend/controllers/orderController.js` (`getOrderById`)  

#### 1. Vulnerability Description
The order retrieval endpoint allows authenticated users to view order details by providing an order ID in the URL path. While the endpoint verifies that a user possesses a valid JWT authentication token (`authMiddleware`), it fails to verify object-level authorization (ownership). Specifically, the controller does not check whether `orders.user_id` matches the authenticated `req.user.id`.

#### 2. Technical Evidence
* **Vulnerable Code Implementation:**
  ```javascript
  // backend/controllers/orderController.js
  export const getOrderById = (req, res) => {
    try {
      const { id } = req.params;
      // VULNERABLE: Direct database fetch without scoping to req.user.id
      const order = findOrderById(id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }
      return res.status(200).json({ success: true, order });
    } catch (error) { ... }
  };
  ```

* **Attack Scenario:**
  1. Customer A (`user@tatashops.local`, User ID: `2`) logs in and obtains a valid JWT.
  2. Customer A initiates a request:
     ```http
     GET /api/orders/1 HTTP/1.1
     Host: localhost:5000
     Authorization: Bearer <Customer_A_JWT>
     ```
  3. The server returns Order #1 (which belongs to Customer B / Admin, User ID: `1`), revealing purchased items, total prices, timestamps, and customer order history.

#### 3. Impact
Unauthorized disclosure of private order receipts, item purchase histories, and transaction metadata across the entire user base.

---

### TS-VULN-02: SQL Injection (SQLi) in Search Query

* **OWASP Category:** A03:2021 — Injection  
* **CVSS v3.1 Score:** `8.6` (High / Critical) — `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`  
* **Affected Endpoint:** `GET /api/products/search?q=`  
* **Source Location:** `backend/models/productModel.js` (`searchProducts`)  

#### 1. Vulnerability Description
The product search endpoint allows public users to filter electronics by name, category, or description. The query string `q` supplied by the client is interpolated directly into raw SQLite SQL statement strings rather than utilizing parameterized query placeholders.

#### 2. Technical Evidence
* **Vulnerable Code Implementation:**
  ```javascript
  // backend/models/productModel.js
  export const searchProducts = (query) => {
    // VULNERABLE: Direct template literal interpolation into SQLite statement
    const sql = `SELECT * FROM products WHERE name LIKE '%${query}%' OR category LIKE '%${query}%' OR description LIKE '%${query}%' ORDER BY id ASC`;
    const stmt = db.prepare(sql);
    return stmt.all();
  };
  ```

* **OWASP ZAP Active Scan Vector:**
  * Parameter: `q`
  * Vector Type: URL Query Parameter
  * ZAP Plugin: *SQL Injection - SQLite / Generic*

* **Attack Mechanism:**
  When an input containing single quotes `'` or SQL syntax operators (e.g. `' OR '1'='1`) is passed to `GET /api/products/search?q='`, the internal SQL query structure is altered:
  ```sql
  SELECT * FROM products WHERE name LIKE '%' OR '1'='1'%' ...
  ```

#### 3. Impact
Allows unauthenticated attackers to bypass search constraints, extract unauthorized database records via UNION-based techniques, and infer database structure through Boolean or error-based observation.

---

### TS-VULN-03: Security Misconfiguration — Wildcard CORS & Header Leaks

* **OWASP Category:** A05:2021 — Security Misconfiguration  
* **CVSS v3.1 Score:** `6.5` (Medium) — `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N`  
* **Affected Endpoint:** Global API (`*`)  
* **Source Location:** `backend/server.js`  

#### 1. Vulnerability Description
The backend server implements an overly permissive Cross-Origin Resource Sharing (CORS) policy by setting `Access-Control-Allow-Origin: *`. Furthermore, default framework headers (`X-Powered-By: Express`) and verbose error stack traces are exposed to HTTP clients.

#### 2. Technical Evidence (from OWASP ZAP Alerts)
* **ZAP Alert 1: Cross-Domain Misconfiguration (Medium)**
  * **Header Observed:** `Access-Control-Allow-Origin: *`
  * **Evidence:** Any origin can initiate AJAX requests against the API endpoints.
* **ZAP Alert 2: Server Leaks Information via "X-Powered-By" (Low)**
  * **Header Observed:** `X-Powered-By: Express`
  * **Evidence:** Explicit technology stack disclosure facilitating targeted exploitation.
* **ZAP Alert 3: Missing Security Headers (Medium)**
  * Missing `Content-Security-Policy (CSP)`
  * Missing `X-Frame-Options` (Anti-Clickjacking)
  * Missing `X-Content-Type-Options: nosniff`

#### 3. Impact
Permits cross-domain data reading in certain browser contexts, reveals underlying framework versions, and leaves client interfaces susceptible to clickjacking or MIME-type confusion.

---

### TS-VULN-04: Vulnerable and Outdated Component (`jsonwebtoken@8.5.1`)

* **OWASP Category:** A06:2021 — Vulnerable and Outdated Components  
* **CVSS v3.1 Score:** `7.8` (High) — `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`  
* **Affected Component:** `jsonwebtoken` version `8.5.1`  
* **Source Location:** `backend/package.json` / `package-lock.json`  

#### 1. Vulnerability Description
The authentication subsystem relies on an outdated version of the `jsonwebtoken` npm library (`v8.5.1`), which contains known Common Vulnerabilities and Exposures (CVEs) affecting signature verification and algorithm handling.

#### 2. Advisory & CVE Mapping
* **CVE-2022-23529:** Critical severity flaw in `jsonwebtoken` versions `< 9.0.0` where improper verification of `secretOrPublicKey` can lead to unintended execution paths when complex objects are processed.
* **CVE-2022-23540:** High severity issue where algorithm validation can be bypassed under specific option configurations.
* **NPM Audit Result:** `1 high severity vulnerability` flagged during dependency analysis.

---

## Remediation & Hardening Roadmap

To transition the application from the vulnerable baseline into a production-grade secure state, the following engineering controls are recommended:

```
+-------------------------------------------------------------------------+
|                       REMEDIATION ARCHITECTURE                          |
+-------------------------------------------------------------------------+
| 1. Fix IDOR (A01)     -> Bind order queries to req.user.id              |
| 2. Fix SQLi (A03)     -> Use db.prepare('... LIKE ?').all(param)        |
| 3. Fix Misconfig (A05)-> Whitelist specific origins & install helmet    |
| 4. Fix Outdated (A06) -> Upgrade jsonwebtoken to ^9.0.2                 |
+-------------------------------------------------------------------------+
```

1. **Enforce Object-Level Authorization (A01):**
   ```javascript
   // Secure implementation in orderController.js
   const order = findOrderById(id, req.user.role === 'admin' ? null : req.user.id);
   ```

2. **Implement Parameterized Statements (A03):**
   ```javascript
   // Secure implementation in productModel.js
   const stmt = db.prepare(`
     SELECT * FROM products 
     WHERE name LIKE ? OR category LIKE ? OR description LIKE ? 
     ORDER BY id ASC
   `);
   return stmt.all(`%${query}%`, `%${query}%`, `%${query}%`);
   ```

3. **Harden HTTP & CORS Headers (A05):**
   * Remove wildcard CORS; restrict origins to authorized frontend domains (`http://localhost:5173`).
   * Apply `helmet` middleware to set `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and disable `X-Powered-By`.

4. **Upgrade Dependencies (A06):**
   * Run `npm install jsonwebtoken@latest` to upgrade to `v9.0.2` and remediate CVE-2022-23529.

---

*Report generated for TataShops Cybersecurity Laboratory Assessment.*
