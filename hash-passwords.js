const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/user_model'); // Adjust this path according to your project structure
const saltRounds = 10;

async function hashPasswords() {
  // Connect to your database
  await mongoose.connect('mongodb://localhost:27017/IP2Data', { useNewUrlParser: true, useUnifiedTopology: true });

  // Get all users from the database
  const users = await User.find({});

  for (let user of users) {
    // Hash each user's password
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();
  }

  // Close the database connection
  mongoose.connection.close();
}

hashPasswords();
 