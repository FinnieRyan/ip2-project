const Router = require('koa-router');
const axios = require('axios');
const User = require('../models/user_model'); 
const jwt = require('jsonwebtoken');
const Manager = require('../models/manager_model');
const bcrypt = require('bcrypt');


const router = new Router();




const authenticate = async (ctx, next) => {
  console.log('Inside authenticate middleware');

  // Check if the request is for Swagger documentation
  if (ctx.path === '/swagger' || ctx.path === '/swagger.json') {
    return next(); // Skip the rest of the middleware
  }

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
    const employeeId = decoded.employeeId;

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


/**
 * @swagger
 * paths:
 *   /login:
 *     post:
 *       summary: Login a user and return JWT
 *       tags: [Authentication]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - username
 *                 - password
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The user's name
 *                 password:
 *                   type: string
 *                   description: The user's password
 *               example:
 *                 username: user1
 *                 password: password123
 *       responses:
 *         200:
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message
 *                   user:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       role:
 *                         type: string
 *               example:
 *                 message: "Login successful"
 *                 user: 
 *                   username: "user1"
 *                   role: "manager"
 *         401:
 *           description: Invalid username or password
 *         500:
 *           description: An error occurred during authentication
 */
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;
  //console.log('Inside /login route');
  //console.log('Username:', username);
  //console.log('Password:', password);

  try {
    // Find the user in the database
    const user = await User.findOne({ username: username });

    // If user is not found or password is incorrect, respond with authentication failure
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!user || !passwordMatch) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid username or password' };
      return;
    }

    console.log("user role:", user.role);
    let managerId;
      if (user.role === 'manager') {
        if (user.manager_Id) {
          managerId = user.manager_Id;
        } else {
          ctx.status = 401;
          ctx.body = { error: 'Manager not found for the given user' };
          return;
        }
      }

      console.log("managerId:", managerId);

    // Generate a JWT token
    const tokenPayload = { userId: user._id, employeeId: user.employee_Id};
    if (managerId) {
      tokenPayload.managerId = managerId;
    }
    const token = jwt.sign(tokenPayload, 'secretKey', { expiresIn: '1h' });

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







