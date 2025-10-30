# Authentication Backend Setup Guide

This guide will help you set up the complete authentication backend for your Next.js 14 app with Azure Cosmos DB.

## 🚀 Quick Start

### 1. Environment Variables Setup

Copy the environment template and fill in your values:

```bash
cp env.template .env.local
```

Edit `.env.local` with your actual values:

```env
# Azure Cosmos DB Connection String
COSMOS_DB_URI=mongodb://your-cosmos-db-connection-string

# JWT Secret Key (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js Environment
NODE_ENV=development
```

### 2. Generate JWT Secret

Generate a strong JWT secret key:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Azure Cosmos DB Setup

1. Go to your Azure Cosmos DB account
2. Navigate to "Connection Strings" in the left sidebar
3. Copy the "Primary Connection String"
4. Paste it as the value for `COSMOS_DB_URI` in your `.env.local`

### 4. Start the Development Server

```bash
npm run dev
```

## 📁 Project Structure

```
├── app/
│   ├── api/auth/
│   │   ├── signup/route.ts      # User registration
│   │   ├── login/route.ts       # User authentication
│   │   ├── logout/route.ts      # User logout
│   │   └── me/route.ts          # Get current user
│   ├── dashboard/[userId]/
│   │   └── page.tsx             # Protected dashboard
│   ├── login/
│   │   └── page.tsx             # Login form
│   └── signup/
│       └── page.tsx             # Registration form
├── lib/
│   ├── db.ts                    # Database connection utility
│   └── models/
│       └── User.ts              # User model schema
└── env.template                 # Environment variables template
```

## 🔐 Authentication Flow

### Registration Flow
1. User fills out signup form (`/signup`)
2. Form submits to `POST /api/auth/signup`
3. Password is hashed with bcrypt
4. User is saved to Cosmos DB
5. JWT token is generated and set as HTTP-only cookie
6. User is redirected to `/dashboard/{userId}`

### Login Flow
1. User fills out login form (`/login`)
2. Form submits to `POST /api/auth/login`
3. Password is verified against stored hash
4. JWT token is generated and set as HTTP-only cookie
5. User is redirected to `/dashboard/{userId}`

### Protected Routes
1. Dashboard page checks for authentication cookie
2. If no valid token, redirects to `/login`
3. If valid token, displays user information

### Logout Flow
1. User clicks logout button
2. Request sent to `POST /api/auth/logout`
3. HTTP-only cookie is cleared
4. User is redirected to `/login`

## 🛠️ API Endpoints

### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "672f34e8c7f2c5d7f3b9e123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "672f34e8c7f2c5d7f3b9e123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/logout
Logout the current user.

**Response:**
```json
{
  "message": "Logout successful"
}
```

### GET /api/auth/me
Get current user information.

**Response:**
```json
{
  "user": {
    "id": "672f34e8c7f2c5d7f3b9e123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS-only in production
- **SameSite Protection**: Prevents CSRF attacks
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Proper error messages without exposing sensitive data

## 🧪 Testing the Setup

1. **Test Registration:**
   - Go to `/signup`
   - Fill out the form with valid data
   - Should redirect to dashboard

2. **Test Login:**
   - Go to `/login`
   - Use the credentials from registration
   - Should redirect to dashboard

3. **Test Protected Route:**
   - Try accessing `/dashboard/any-id` without being logged in
   - Should redirect to login page

4. **Test Logout:**
   - Click logout button on dashboard
   - Should redirect to login page

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify your `COSMOS_DB_URI` is correct
   - Check if your Cosmos DB account is accessible
   - Ensure the connection string includes the database name

2. **JWT Secret Error:**
   - Make sure `JWT_SECRET` is set in `.env.local`
   - Use a strong, random secret key

3. **Cookie Not Set:**
   - Check if you're running on HTTPS in production
   - Verify cookie settings in browser dev tools

4. **CORS Issues:**
   - Ensure API routes are properly configured
   - Check if you're making requests to the correct endpoints

### Debug Mode

To enable debug logging, add this to your `.env.local`:

```env
DEBUG=auth:*
```

## 📦 Dependencies

The following packages were installed:

- `jsonwebtoken` - JWT token generation and verification
- `bcryptjs` - Password hashing
- `cookie` - Cookie parsing utilities
- `mongodb` - MongoDB driver
- `mongoose` - MongoDB ODM
- `@types/jsonwebtoken` - TypeScript types
- `@types/bcryptjs` - TypeScript types
- `@types/cookie` - TypeScript types

## 🎯 Next Steps

1. **Add Email Verification**: Implement email verification for new accounts
2. **Password Reset**: Add forgot password functionality
3. **Social Login**: Integrate Google OAuth (button is already in signup form)
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks
5. **Session Management**: Add session management and device tracking
6. **Audit Logging**: Log authentication events for security monitoring

## 📚 Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Azure Cosmos DB MongoDB API](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
