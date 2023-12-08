# SkyWorld User API

The SkyWorld User API, a Node.js-based RESTful service, follows the MVC pattern. It facilitates user authentication, management, and token operations, offering CRUD functionalities for user accounts

## Table of Contents

- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Models](#models)
- [Controllers](#controllers)
- [Database](#database)
- [Application Entry Point](#application-entry-point)
- [Contact](#contact)

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/jiahongggg/Skyworld-UserAPI.git
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Set Up Environment Variables:**

    Create a .env file in the root directory with the following content:

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

4. **Run the Application:**

    ```bash
    npm start
    ```

    The API should now be running on the specified port (default: 3000).

## API Endpoints

### Authentication

- POST `/api/v1/users/login`: Logs in a user and provides an access token.
Rate-limited to prevent brute-force attacks.
Requires a valid username and password in the request body.
- POST `/api/v1/users/refresh`: Refreshes the access token using a valid refresh token stored in an HTTP-only cookie.
Requires a valid refresh token in the cookie.
- POST `/api/v1/users/logout`: Logs out the user by clearing the refresh token cookie.

### User Management
- POST `/api/v1/users`: Creates a new user with the specified username, password, and role.
Requires admin privileges to create users. Input validation is applied to ensure a valid username, password, and role.
- GET `/api/v1/users`: Lists all users. Requires admin or editor privileges to view the user list.
- GET `/api/v1/users/:id`: Retrieves details of a specific user by their ID. Requires admin or editor privileges to view user details.
- PUT `/api/v1/users/:id`: Updates user details (username, password, role) for a specific user by their ID. Requires admin or editor privileges to update user details. Input validation is applied to ensure valid updates.
- DELETE `/api/v1/users/:id`: Deletes a specific user by their ID. Requires admin privileges to delete users.

## Middleware

### authMiddleware.js

- Provides middleware for token verification (verifyToken) and role-based access control (checkAccess).

## Models

### userModel.js
- Defines functions for user-related database operations such as creating, retrieving, updating, and deleting users.

## Controllers

### authController.js
- Contains functions for user authentication, token generation, and logout.

### userApiController.js
- Handles user-related actions such as creating, retrieving, updating, and deleting users.

- Secure user registration and login process.
- JWT access and refresh token generation for authenticated sessions.
- Encrypted password storage using bcrypt.
- Role-based authorization checks for protected routes.
- Refresh token mechanism for extended authentication sessions.
- CRUD operations for user management, restricted to admin users.

## Database

### db.js
- Handles database connection and exports a connection pool.

## Application Entry Point

### app.js
- The main application entry point, which sets up the Express app, connects to the database, and defines routes.
- Handles database connection and exports a connection pool.

## Contact

For inquiries or further information, please contact me at:

- [Jia Hong](jiahong.sim01@gmail.com)





