# Bookey - Algerian Online Bookstore (TD-TP 3 Backend API)

**Higher National School of Advanced Technologies (ENSTA)**  
**Department:** SS / IA — First Semester 2026  
**Module:** WAMD (Web and Mobile Development)  
**Lab Assignment:** TD-TP 3: Build an E-Commerce Backend: REST API with Node.js, Express.js, MongoDB, JWT, OAuth2, and Rate Limiting  
**Student Name:** [Your Name Here]

---

## 1. Application Description
**Bookey** is an online bookstore platform focused on Algerian literature, historical chronicles, and essays. 
In **TD-TP 2**, the e-commerce client-side application was built using React and Redux. 
In **TD-TP 3**, we implement the production-ready REST API backend using **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. The backend manages product catalogs, secure user authentication with password hashing (bcrypt), JSON Web Token (JWT) verification, OAuth 2.0 support, and security protections including IP rate limiting.

All emojis across the frontend have been replaced with clean inline SVG icons and classic typographical symbols for an elegant, professional, and vintage storybook aesthetic.

---

## 2. Technologies Used

| Technology | Purpose in Project |
| :--- | :--- |
| **Node.js (v22+)** | Backend JavaScript runtime environment |
| **Express.js (v5)** | Web framework for REST API routing and middleware pipeline |
| **MongoDB / Atlas** | NoSQL document database for products and users |
| **Mongoose (v9)** | Object Data Modeling (ODM) library for MongoDB |
| **JSON Web Token (`jsonwebtoken`)** | Stateless Bearer token generation and authorization |
| **`bcryptjs`** | Secure password hashing with salt rounds |
| **`express-rate-limit`** | IP rate limiting for API security and brute-force protection |
| **`cors`** | Cross-Origin Resource Sharing handling for React origin (`http://localhost:5173`) |
| **`dotenv`** | Environment variable management |
| **Postman / Thunder Client** | REST API testing and OAuth 2.0 validation |

---

## 3. Database Models

### Product Model (`backend/models/Product.js`)
Represents an item available in the bookstore catalog.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Title/Name of the book |
| `description` | String | Yes | Synopsis or book summary |
| `price` | Number | Yes | Price in Algerian Dinars (DZD), non-negative |
| `category` | String | Yes | Book genre (`Novel`, `History`, `Essay`) |
| `imageUrl` | String | No | Cover image URL |
| `stock` | Number | Yes | Quantity available in inventory (min: 0) |
| `author` | String | No | Author name (e.g. *Kateb Yacine*, *Assia Djebar*) |
| `year` | Number | No | First publication year |
| `color` | String | No | Cloth cover tint hex code |
| `timestamps` | Date | Auto | `createdAt` and `updatedAt` |

### User Model (`backend/models/User.js`)
Represents a registered customer account.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Full customer name |
| `email` | String | Yes | Unique, lowercase, validated email address |
| `passwordHash` | String | Yes | Salted bcrypt hash (passwords never stored in plain text) |
| `timestamps` | Date | Auto | `createdAt` and `updatedAt` |

---

## 4. API Endpoints & Access Requirements

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Purpose | Access | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public | `201 Created`, `400 Bad Request`, `409 Conflict`, `500 Server Error` |
| `POST` | `/api/auth/login` | Authenticate & receive JWT | Public *(Rate-limited: 5 req/15m)* | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `429 Too Many Requests` |
| `POST` | `/api/auth/oauth/token` | OAuth 2.0 token endpoint | Public | `200 OK` |

### Product Endpoints (`/api/products`)

| Method | Endpoint | Purpose | Access | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve all products (supports `?category=` and `?search=`) | Public | `200 OK`, `500 Server Error` |
| `GET` | `/api/products/:id` | Retrieve single product by ID | Public | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/api/products` | Create a new product | **JWT Required** | `201 Created`, `400 Bad Request`, `401 Unauthorized`, `500 Server Error` |
| `PUT` | `/api/products/:id` | Update an existing product | **JWT Required** | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| `DELETE` | `/api/products/:id` | Delete a product | **JWT Required** | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |

---

## 5. Security & Authentication Mechanism

### 1. Password Protection
* Incoming passwords must be at least 6 characters long.
* Before saving to MongoDB, passwords are encrypted with **bcryptjs** using 10 salt rounds (`bcrypt.hash(password, 10)`).
* Plain-text passwords are never logged or stored.

### 2. JWT Bearer Token Workflow
1. User submits credentials to `POST /api/auth/login`.
2. Backend verifies email and password hash.
3. Upon success, a JSON Web Token is signed using `process.env.JWT_SECRET` with user payload (`id`, `email`, `name`) and a 24-hour expiration.
4. For protected endpoints (`POST`, `PUT`, `DELETE` on `/api/products`), the client sends the token in the HTTP Authorization header:
   ```http
   Authorization: Bearer <JWT_TOKEN>
   ```
5. `authMiddleware` intercepts the request:
   * Missing header or invalid scheme $\rightarrow$ **`401 Unauthorized`**
   * Invalid or expired token $\rightarrow$ **`401 Unauthorized`**
   * Valid token $\rightarrow$ attaches `req.user` payload and proceeds with `next()`.

### 3. Rate Limiting (`express-rate-limit`)
* **General API**: Maximum **100 requests per 15 minutes** per client IP.
* **Login Endpoint**: Strict protection of **5 requests per 15 minutes** per client IP against brute-force attacks.
* Exceeding the threshold immediately responds with HTTP **`429 Too Many Requests`** and headers `RateLimit-*`.

### 4. OAuth 2.0 Testing
* The backend includes `POST /api/auth/oauth/token` for testing OAuth 2.0 Client Credentials or OpenID Connect Bearer token flows in Postman / Thunder Client as detailed in Section 8 of the lab statement.

---

## 6. Installation & Setup Instructions

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher)
* **MongoDB** (Local MongoDB Community Server on port 27017 or a free MongoDB Atlas URI)

### 1. Install Dependencies
In the root directory, install all frontend and backend dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/bookey_db
JWT_SECRET=your_super_secret_jwt_key_2026
```
*(Note: `.env` is safely ignored in `.gitignore` to prevent credential exposure).*

### 3. Seed Sample Algerian Literature Books (Optional)
Populate MongoDB with the 9 core Algerian books and a default test user (`student@ensta.dz` / `password123`):
```bash
npm run seed
```

### 4. Start the Backend API Server
```bash
# Start standard server (Port 5000)
npm run server

# Or run with Node auto-reload during development
npm run server:dev
```

### 5. Start the React Frontend (Optional)
```bash
npm run dev
```

---

## 7. Automated Test Suite & Postman Verification

### Run Automated Test Suite (18 Tests)
We provide an automated verification suite testing all endpoints, status codes, and rate limits:
```bash
npm run test:api
```
**Output:**
```
PASS: 1. Health check returns 200 OK
PASS: 2. Register new user returns 201 Created
PASS: 3. Register duplicate email returns 409 Conflict
PASS: 4. Register missing fields returns 400 Bad Request
PASS: 5. Login with invalid credentials returns 401 Unauthorized
PASS: 6. Login with valid credentials returns 200 OK and signed JWT token
PASS: 7. Retrieve all products (Public) returns 200 OK and products array
PASS: 8. Create product without token returns 401 Unauthorized
PASS: 9. Create product with invalid token returns 401 Unauthorized
PASS: 10. Create product with valid JWT returns 201 Created
PASS: 11. Retrieve product by ID returns 200 OK
PASS: 12. Malformed product ID returns 400 Bad Request
PASS: 13. Non-existent product ID returns 404 Not Found
PASS: 14. Update product with valid JWT returns 200 OK
PASS: 15. Delete product with valid JWT returns 200 OK
PASS: 16. Verified product is removed (404 Not Found)
PASS: 17. OAuth 2.0 Token endpoint returns 200 OK with Bearer access_token
PASS: 18. Rate limiting triggered on login attempts (429 Too Many Requests)
TEST RESULTS: 18 PASSED, 0 FAILED
```

### Testing with Postman / Thunder Client
A pre-configured collection is included directly in the root directory:
`Bookey_API.postman_collection.json`

1. Open **Postman** (or **Thunder Client** in VS Code).
2. Click **Import** $\rightarrow$ select `Bookey_API.postman_collection.json`.
3. The collection includes pre-configured tests:
   * **Login Valid User**: Automatically extracts and saves the returned JWT into the `{{token}}` collection variable.
   * **Create Product**: Automatically uses `Bearer {{token}}` and stores `{{productId}}` for subsequent `GET`, `PUT`, and `DELETE` requests.
   * **Negative tests**: Invalid IDs (400), Duplicate emails (409), Missing token (401), Brute-force rate limit (429).
