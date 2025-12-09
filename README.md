# 🚀 ProConnect Backend

**ProConnect** is a modern marketplace application designed to connect clients with various service providers. This repository hosts the robust and scalable **Backend Service** for the ProConnect application, built using **TypeScript, Express, and MongoDB**.

---

## 🔗 Live Demo and Source Code

| Name | Type | Link |
|------|------|------|
| **Live Application** | Frontend Deployment | [https://pro-connect-frontend.vercel.app](https://pro-connect-frontend.vercel.app) |
| **Backend API** | API Deployment | [https://pro-connect-backend.vercel.app](https://pro-connect-backend.vercel.app) |
| **Frontend Source** | GitHub Repository | [ProConnect-Frontend](https://github.com/arman-miaa/ProConnect-Frontend) |
| **Backend Source** | GitHub Repository | [ProConnect-Backend](https://github.com/arman-miaa/ProConnect-Backend) |

---

## 🛠️ Tech Stack

The project is built using the following core technologies and libraries:

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | TypeScript | 5.8.3 | Type safety and scalability |
| **Runtime** | Node.js | - | JavaScript runtime environment |
| **Framework** | Express.js | 5.1.0 | Web application framework |
| **Database** | MongoDB | - | NoSQL document database |
| **ORM** | Mongoose | 8.16.1 | MongoDB object modeling |
| **Validation** | Zod | 3.25.74 | Schema validation and type inference |
| **Authentication** | JWT & Bcryptjs | 9.0.2 & 3.0.3 | Secure token-based authentication |
| **Payment Gateway** | SSLCommerz | - | Payment processing integration |
| **File Upload** | Cloudinary & Multer | 2.8.0 & 2.0.2 | Cloud storage for file uploads |
| **Email Service** | Nodemailer | 7.0.11 | Email sending functionality |
| **HTTP Client** | Axios | 1.13.2 | Promise-based HTTP client |
| **Utilities** | CORS, Cookie-Parser | - | Cross-origin and cookie management |

---

## ✨ Key Features

Based on the module structure, the core features include:

**User Authentication & Authorization:** JWT-based authentication with support for registration, login, and role-based access control (Admin, Seller, Client).

**Service Management:** Complete CRUD operations for service providers to create, update, view, and delete services with validation and error handling.

**Order Processing:** Comprehensive order management system allowing clients to place orders, track status, and manage order lifecycle.

**Payment Gateway Integration:** Secure payment processing using SSLCommerz with transaction tracking and payment status management.

**Review and Rating System:** Clients can leave detailed reviews and ratings for services with validation and moderation capabilities.

**Admin Dashboard:** Dedicated admin module for system analytics, user management, transaction oversight, and report handling.

**Wallet and Withdrawal:** User-specific wallet management system enabling service providers to withdraw earnings with transaction history.

**Message System:** Utility-based messaging between users for communication and support.

**Transaction Tracking:** Complete transaction history with detailed records for audit trails and financial tracking.

**Robust Error Handling:** Centralized global error handler with support for custom AppError, Mongoose validation errors, and Zod schema validation errors.

**Custom Middleware:** Authentication checks, request validation, error management, and CORS handling middleware.

---

## 📂 Project Structure

The project follows a clean, modular architecture with separation of concerns:

```
src/
├── app.ts                      # Express app initialization and middleware setup
├── server.ts                   # Database connection and server startup
├── app/
│   ├── config/                 # Configuration files
│   │   ├── env.ts              # Environment variable management
│   │   ├── cloudinary.config.ts # Cloudinary setup
│   │   └── multer.config.ts    # Multer file upload configuration
│   ├── errorHelpers/           # Custom error handling
│   │   └── AppError.ts         # Custom error class
│   ├── helpers/                # Error response helpers
│   │   ├── handleCastError.ts  # Mongoose cast error handling
│   │   ├── handleDuplicateError.ts # Duplicate field error handling
│   │   ├── handleValidtionError.ts # Mongoose validation error handling
│   │   └── handleZodError.ts   # Zod validation error handling
│   ├── interfaces/             # TypeScript interfaces and types
│   │   └── error.types.ts      # Error type definitions
│   ├── middlewares/            # Express middlewares
│   │   ├── checkAuth.ts        # Authentication verification
│   │   ├── globalErrorHandler.ts # Centralized error handling
│   │   ├── notFound.ts         # 404 handler
│   │   └── validateRequrest.ts # Request validation
│   ├── modules/                # Feature modules (M-C-S pattern)
│   │   ├── admin/              # Admin dashboard and analytics
│   │   ├── auth/               # Authentication logic
│   │   ├── order/              # Order management
│   │   ├── payment/            # Payment processing
│   │   ├── service/            # Service management
│   │   ├── review/             # Review and rating system
│   │   ├── transaction/        # Transaction tracking
│   │   ├── user/               # User management
│   │   ├── wallet/             # Wallet functionality
│   │   ├── withdrawal/         # Withdrawal management
│   │   ├── utility-messages/   # Messaging system
│   │   ├── report/             # Report handling
│   │   └── ssl/                # SSLCommerz integration
│   ├── routes/                 # Centralized route configuration
│   └── utils/                  # Utility functions
│       ├── jwt.ts              # JWT token generation and verification
│       ├── catchAsync.ts       # Async error wrapper
│       ├── sendResponse.ts     # Standardized response formatter
│       ├── sendEmail.ts        # Email sending utility
│       ├── seedSuperAdmin.ts   # Initial super admin creation
│       ├── setCookie.ts        # Cookie management
│       ├── getTransactionId.ts # Transaction ID generation
│       └── userTokens.ts       # User token utilities
├── tsconfig.json               # TypeScript configuration
└── vercel.json                 # Vercel deployment configuration
```

---

## ⚙️ Local Setup Guide

Follow these steps to get the project running on your local machine:

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18.x or higher)
- **npm** or **pnpm** (Package Manager)
- **MongoDB** server or cloud connection (MongoDB Atlas)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/arman-miaa/ProConnect-Backend.git

# Navigate into the project directory
cd ProConnect-Backend

# Install dependencies using pnpm (recommended)
pnpm install

# Or use npm
npm install
```

### 2. Environment Variable Setup

Create a `.env` file in the root directory of the project. You can use `.env.example` as a reference template.

```bash
# Core Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/proconnect?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (File Upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SSLCommerz Configuration (Payment Gateway)
SSL_STORE_ID=your_ssl_store_id
SSL_STORE_PASSWORD=your_ssl_store_password

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@proconnect.com

# Frontend URL (for redirects and CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Running the Project

To run the project in development mode with hot reload:

```bash
pnpm run dev
# or
npm run dev
```

The server will start on `http://localhost:5000/` by default. You should see console output confirming the database connection and server startup.

### 4. Building for Production

To compile TypeScript to JavaScript:

```bash
pnpm run build
# or
npm run build
```

This generates a `/dist` folder with compiled JavaScript files.

### 5. Running Production Build

```bash
pnpm start
# or
npm start
```

---

## 📜 Available Scripts

| Script | Description | Command |
|--------|-------------|---------|
| **dev** | Run app in development mode with live reload (ts-node-dev) | `pnpm run dev` |
| **build** | Compile TypeScript to JavaScript (outputs to `/dist`) | `pnpm run build` |
| **start** | Run the production build from `/dist` folder | `pnpm start` |
| **lint** | Check code for style issues and errors using ESLint | `pnpm run lint` |
| **test** | Run test suite (not yet configured) | `pnpm run test` |

---

## 🔑 Key Dependencies Overview

**Express.js:** Web application framework for building RESTful APIs with middleware support.

**Mongoose:** MongoDB object data modeling (ODM) providing schema validation and query building.

**TypeScript:** Brings static typing to JavaScript for better development experience and fewer runtime errors.

**JWT & Bcryptjs:** Secure authentication with token generation and password hashing.

**Zod:** TypeScript-first schema validation for runtime data validation and type safety.

**Cloudinary & Multer:** Cloud-based file storage solution with local file handling middleware.

**Nodemailer:** Email service for sending notifications, password resets, and transactional emails.

**Axios:** Promise-based HTTP client for external API integrations.

**CORS & Cookie-Parser:** Security and session management middleware for Express.

---

## 🤝 Contributing

Contributions are always welcome! Feel free to submit a Pull Request if you have improvements or bug fixes.

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m 'feat: Added awesome feature'`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a new Pull Request with a detailed description

---

## 👤 Author

**Arman Mia**

- GitHub: [arman-miaa](https://github.com/arman-miaa)


---

## 📄 License

This project is licensed under the **ISC License**. See the `LICENSE` file for details.