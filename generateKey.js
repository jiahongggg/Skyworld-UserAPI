const crypto = require('crypto');

// Generate a secure random string for JWT secret key
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('JWT Secret Key:', jwtSecret);
