# Pet Care Tips & Stories - Backend

This is the backend service for the **Pet Care Tips & Stories** web application. It handles API requests, manages user authentication, stores data using MongoDB, and integrates with payment gateways for premium content.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Payment Gateway Integration](#payment-gateway-integration)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

The backend is built using:
- **Node.js**: Runtime environment for executing JavaScript on the server.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM for MongoDB.
- **JWT (JSON Web Tokens)**: User authentication and session management.
- **Stripe / Aamarpay**: Payment gateway integration.
- **bcryptjs**: For secure password hashing.

---

## Features

- **User Authentication**: User login and registration using JWT.
- **Blog Management**: Create, read, update, and delete (CRUD) blog posts.
- **Premium Content Access**: Restrict access to certain content based on payment.
- **Payment Integration**: Use Stripe and Aamarpay for handling premium content payments.
- **Search and Filtering**: Search blogs by title and filter by categories.
- **Pagination & Infinite Scrolling**: Load more content as the user scrolls.

---

## Installation

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (v14.x or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation or cloud-based MongoDB Atlas)

### Steps to install and run the backend:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/pet-care-backend.git
   cd pet-care-backend
Install the dependencies:

bash
Copy code
npm install
Create a .env file with the following environment variables:

bash
Copy code
PORT=5000
MONGO_URI=mongodb://localhost:27017/pet-care-db
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
AAMARPAY_STORE_ID=your_aamarpay_store_id
AAMARPAY_SIGNATURE_KEY=your_aamarpay_signature_key
Start the server:

bash
Copy code
npm start
For development, you can use nodemon for automatic reloading:

bash
Copy code
npm run dev
Configuration
Environment Variables
Create a .env file with the following values:

env
Copy code
PORT=5000
MONGO_URI=mongodb://localhost:27017/pet-care-db
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
AAMARPAY_STORE_ID=your_aamarpay_store_id
AAMARPAY_SIGNATURE_KEY=your_aamarpay_signature_key
PORT: The port the server will run on.
MONGO_URI: MongoDB connection string.
JWT_SECRET: Secret key for signing and verifying JWT tokens.
STRIPE_SECRET_KEY: Stripe API key for handling payments.
AAMARPAY_STORE_ID and AAMARPAY_SIGNATURE_KEY: Credentials for integrating Aamarpay payment gateway.
Database
This application uses MongoDB as the database. Data is managed using Mongoose, which provides schema-based modeling.

Models
User: Stores user details such as name, email, password, and role (admin, author, user).
Blog: Stores blog details including title, content, author, category, and timestamps.
Payment: Stores payment information when users pay for premium content.
API Endpoints
Authentication Routes
POST /api/users/register: Register a new user.
POST /api/users/login: Authenticate user and provide a JWT token.
GET /api/users/profile: Get the authenticated user's profile (requires JWT).
Blog Routes
GET /api/posts: Get all blog posts.
POST /api/posts: Create a new blog post (Admin or Author only).
GET /api/posts/:id: Get a single blog post by ID.
PUT /api/posts/:id: Update a blog post by ID (Admin or Author only).
DELETE /api/posts/:id: Delete a blog post by ID (Admin only).
Payment Routes
POST /api/payment/stripe: Create a Stripe payment session.
POST /api/payment/aamarpay: Create an Aamarpay payment session.
Search and Filtering
GET /api/posts?search=keyword: Search blogs by title.
GET /api/posts?category=category_name: Filter blogs by category.
Pagination
Use ?page=1&limit=10 in the request to paginate results.
Authentication
The backend uses JWT (JSON Web Token) for authentication. When a user logs in, they receive a token that must be sent in the Authorization header for protected routes.

bash
Copy code
Authorization: Bearer <token>
You can find the authentication middleware in middleware/auth.js. This middleware checks if the JWT is valid before allowing access to protected routes.

Payment Gateway Integration
Stripe
For payments, Stripe is integrated to handle secure payments for premium content. You need to configure STRIPE_SECRET_KEY in your .env file.

Aamarpay
You can also use Aamarpay as an alternative payment gateway, especially for local transactions in Bangladesh. Provide AAMARPAY_STORE_ID and AAMARPAY_SIGNATURE_KEY in your .env file.

Error Handling
Error handling is done globally in the backend using a custom middleware located in middleware/errorHandler.js.

Example error response format:

json
Copy code
{
  "error": true,
  "message": "Unauthorized",
  "statusCode": 401
}
This ensures consistent error handling throughout the application.

Contributing
We welcome contributions! To contribute, follow these steps:

Fork the repository.
Create a new feature branch:
bash
Copy code
git checkout -b feature-name
Make your changes and commit:
bash
Copy code
git commit -m "Added a new feature"
Push the changes:
bash
Copy code
git push origin feature-name
Submit a pull request.
License
This project is licensed under the MIT License.

vbnet
Copy code

This `README.md` provides a comprehensive guide to the backend, including installation steps, environment configuration, and details about the various features, API routes, and more. You can copy and paste this into your project directly. Let me know if you need further adjustments!





