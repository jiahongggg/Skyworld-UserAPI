# Skyworld User API

This project is a user authentication system built with Node.js and Express, featuring JWT-based authentication. It allows users to register, login, and perform CRUD operations on user profiles with MySQL as the database for secure data storage.

## Features

- Secure user registration and login process.
- JWT access and refresh token generation for authenticated sessions.
- Encrypted password storage using bcrypt.
- Role-based authorization checks for protected routes.
- Refresh token mechanism for extended authentication sessions.
- CRUD operations for user management, restricted to admin users.

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm (Node Package Manager)
- MySQL database

### Installation

1. Clone the repository to your local machine: git clone [Your Repository URL]
2. Navigate to the project directory: cd [Your Repository Name]
3. Install the required npm packages: npm install
4. Set up your MySQL database and ensure it is running.
5. Create a `.env` file in the root directory and configure the environment variables: JWT_SECRET=your_jwt_secret

JWT_REFRESH_SECRET=your_jwt_refresh_secret
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE_NAME=your_database_name
NODE_ENV=development
PORT=3000

6. Start the server with: npm start

Your server should now be running on `http://localhost:3000`.

## Usage

Here are the API endpoints provided by the system:

- `POST /api/users/login`: Logs in a user and returns an access token.
- `POST /api/users/refresh`: Refreshes an access token using a refresh token.
- `POST /api/users/logout`: Logs out a user, invalidating the refresh token.
- `POST /api/users`: (Admin only) Creates a new user.
- `GET /api/users/:id`: Retrieves user details.
- `PUT /api/users/:id`: (Admin only) Updates user details.
- `DELETE /api/users/:id`: (Admin only) Deletes a user.
- `GET /api/users`: (Admin only) Lists all users.

## API Documentation

For detailed API documentation, refer to the `docs` directory within the project repository.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Acknowledgments

- Thanks to all Node.js contributors for maintaining such a powerful and flexible runtime environment.
- Kudos to the Express team for their excellent web framework.

## Contact

For inquiries or further information, please contact me at:

- [Jia Hong](jiahong.sim01@gmail.com)





