const bcrypt = require('bcryptjs');

async function generateHash(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("Hashed Password:", hash);
  } catch (err) {
    console.error(err);
  }
}

// Replace 'your_admin_password' with the password you want to hash
generateHash('admin123');