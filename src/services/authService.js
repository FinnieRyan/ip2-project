const Router = require('koa-router');
const axios = require('axios');
const User = require('../models/user_model'); // Update the path to the userModel file
const jwt = require('jsonwebtoken');


const router = new Router();

// Middleware to authenticate the user
const authenticate = async (ctx, next) => {
  console.log('Inside authenticate middleware');

  // Get the token from the request headers
  const authHeader = ctx.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Unauthorized' };
    return;
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'secretKey');
    const userId = decoded.userId;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }

    // Set the user object to ctx.state.user
    ctx.state.user = user;

    await next();
  } catch (error) {
    console.error('Error during authentication:', error);
    ctx.status = 401;
    ctx.body = { error: 'Unauthorized' };
  }
};

// POST /login
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;
  console.log('Inside /login route');
  console.log('Username:', username);
  console.log('Password:', password);

  try {
    // Find the user in the database
    const user = await User.findOne({ username: username }); // Ensure username is passed as a string

    // If user is not found or password is incorrect, respond with authentication failure
    if (!user || user.password !== password) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid username or password' };
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

    // Set the token in the response headers
    ctx.set('Authorization', `Bearer ${token}`);
    ctx.set('Access-Control-Expose-Headers', 'Authorization');

    // Authentication successful
    ctx.status = 200;
    ctx.body = { message: 'Login successful', user: { username: user.username, role: user.role } };
    ctx.cookies.set('token', token, { httpOnly: false });
  } catch (error) {
    console.error('Error during authentication:', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred during authentication' };
  }
});

module.exports = {
  router,
  authenticate,
};





