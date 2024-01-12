# SkyWorld User API

The SkyWorld User API is a Node.js-based RESTful service that follows the MVC pattern. It provides functionalities for user authentication, management, and token operations, including CRUD operations for user accounts.

## Table of Contents

- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jiahongggg/Skyworld-UserAPI.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```bash
NODE_ENV=development
PORT=3000
MYSQL_HOST=<your-mysql-host>
MYSQL_PORT=<your-mysql-port>
MYSQL_DATABASE=<your-mysql-database>
MYSQL_USER=<your-mysql-username>
MYSQL_PASSWORD=<your-mysql-password>
JWT_SECRET=<your-jwt-secret>
JWT_REFRESH_SECRET=<your-jwt-refresh-secret>
```

### 4. Run the Application

```bash
npm start
```

The API should now be running on the specified port (default: 3000).

## Dependencies

The SkyWorld User API relies on the following dependencies:

- **bcryptjs**: Password hashing library for user authentication.
- **cookie-parser**: Middleware for handling HTTP cookies.
- **cors**: Middleware for handling Cross-Origin Resource Sharing (CORS).
- **crypto**: Node.js module for cryptographic functionality.
- **dotenv**: Module for loading environment variables from a .env file.
- **express**: Web application framework for Node.js.
- **express-rate-limit**: Middleware for rate-limiting HTTP requests.
- **express-validator**: Middleware for request data validation.
- **express-winston**: Middleware for logging with Winston in Express applications.
- **helmet**: Middleware for securing your Express apps by setting various HTTP headers.
- **jsonwebtoken**: Library for creating and verifying JSON Web Tokens (JWT).
- **mongodb**: MongoDB driver for Node.js.
- **morgan**: Middleware for HTTP request/response logging.
- **mysql2**: MySQL database driver for Node.js.
- **mysql2-promise**: Promise-based wrapper for the MySQL 2 package.
- **node-cache**: Library for caching data in Node.js applications.
- **swagger-jsdoc**: Package to integrate Swagger using JSDoc.
- **swagger-ui-express**: Middleware for serving Swagger UI in Express applications.
- **uuid**: Library for generating UUIDs (Universally Unique Identifiers).
- **winston**: A logger library for Node.js.
- **winston-mongodb**: Winston transport for MongoDB.

#### Development Dependencies

- **jest**: JavaScript testing framework for unit and integration tests.
- **nodemon**: Development dependency for automatic server restarting during development.
- **supertest**: Library for testing HTTP assertions.

## Installation

To install these dependencies, run the following command:

```bash
npm install bcryptjs cookie-parser cors crypto dotenv express express-rate-limit express-validator express-winston helmet jsonwebtoken mongodb morgan mysql2 mysql2-promise node-cache swagger-jsdoc swagger-ui-express uuid winston winston-mongodb --save
```

## API Endpoints

### Authentication

- POST `/api/v1/users/login`: Logs in a user and provides an access token. Rate-limited to prevent brute-force attacks. Requires a valid username and password in the request body.
- POST `/api/v1/users/refresh`: Refreshes the access token using a valid refresh token stored in an HTTP-only cookie. Requires a valid refresh token in the cookie.
- POST `/api/v1/users/logout`: Logs out the user by clearing the refresh token cookie.

### User Management

- POST `/api/v1/users`: Creates a new user with the specified username, password, and role. Requires admin privileges to create users. Input validation is applied to ensure a valid username, password, and role.
- GET `/api/v1/users`: Lists all users. Requires admin or editor privileges to view the user list.
- GET `/api/v1/users/:id`: Retrieves details of a specific user by their ID. Requires admin or editor privileges to view user details.
- PUT `/api/v1/users/:id`: Updates user details (username, password, role) for a specific user by their ID. Requires admin or editor privileges to update user details. Input validation is applied to ensure valid updates.
- DELETE `/api/v1/users/:id`: Deletes a specific user by their ID. Requires admin privileges to delete users.

### Customer Management

- POST `/api/v1/customers`: Creates a new customer with the specified details. Requires admin or editor privileges to create customers. Input validation is applied to ensure valid customer creation.
- GET `/api/v1/customers`: Lists all customers. Anyone with access to the API can view the customer list.
- GET `/api/v1/customers/:id`: Retrieves details of a specific customer by their ID. Anyone with access to the API can view customer details.
- PUT `/api/v1/customers/:id`: Updates customer details for a specific customer by their ID. Requires admin or editor privileges to update customer details. Input validation is applied to ensure valid updates.
- DELETE `/api/v1/customers/:id`: Deletes a specific customer by their ID. Requires admin privileges to delete customers.

### Lead Management

- POST `/api/v1/leads`: Creates a new lead with the specified details. Requires admin or editor privileges to create leads. Input validation is applied to ensure valid lead creation.
- GET `/api/v1/leads`: Lists all leads. Anyone with access to the API can view the lead list.
- GET `/api/v1/leads/:id`: Retrieves details of a specific lead by their ID. Anyone with access to the API can view lead details.
- PUT `/api/v1/leads/:id`: Updates lead details for a specific lead by their ID. Requires admin or editor privileges to update lead details. Input validation is applied to ensure valid updates.
- DELETE `/api/v1/leads/:id`: Deletes a specific lead by their ID. Requires admin privileges to delete leads.

### Sales Management

- POST `/api/v1/sales`: Creates a new sales record with the specified details. Requires admin or editor privileges to create sales records. Input validation is applied to ensure valid sales record creation.
- GET `/api/v1/sales`: Lists all sales records. Anyone with access to the API can view the sales record list.
- GET `/api/v1/sales/:id`: Retrieves details of a specific sales record by its ID. Anyone with access to the API can view sales record details.
- PUT `/api/v1/sales/:id`: Updates sales record details for a specific record by its ID. Requires admin or editor privileges to update sales record details. Input validation is applied to ensure valid updates.
- DELETE `/api/v1/sales/:id`: Deletes a specific sales record by its ID. Requires admin privileges to delete sales records.

## Middleware

### authMiddleware.js

This module provides middleware for token verification (`verifyToken`) and role-based access control (`checkAccess`).

- `verifyToken`: Middleware for verifying JWT tokens. It checks if a valid token is provided in the `Authorization` header and decodes it using the JWT secret from the environment variables. If the token is valid, it attaches the user information to the request (`req.user`).

- `checkAccess`: Middleware for controlling access based on user roles. It takes an array of allowed roles and checks if the user's role is included in the array. If the user's role matches one of the allowed roles, the request proceeds; otherwise, it returns a 403 Forbidden response.

- `checkApiAccess`: Middleware for checking API access based on user API collection groups. It takes the required API group name and checks if the user has access to it by comparing the user's API collection groups with the group name mapping. If the user has access, the request proceeds; otherwise, it returns a 403 Forbidden response.

These middleware functions are crucial for ensuring authentication, role-based authorization, and API access control within the Skyworld User API. They help secure your routes and protect sensitive data from unauthorized access.