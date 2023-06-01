const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const cors = require('koa-cors');
const authService = require('../src/services/authService'); 
const User = require('../src/models/user_model'); // Import the User model
const Course = require('../src/models/course_model'); // Import the Course model
const Manager = require('../src/models/manager_model'); // Import the manager model
const jwt = require('jsonwebtoken')


const app = new Koa();
const port = 5000;

app.use(cors());
app.use(bodyParser());


app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('An error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
});

// Mount the authService middleware
app.use(authService.router.routes());
app.use(authService.authenticate);

// GET /api/user route to retrieve user data
app.use(async (ctx, next) => {
  if (ctx.path === '/api/user') {
    console.log('Inside /api/user route');
    try {
      // Retrieve the user data from the database
      const users = await User.find();

      ctx.status = 200;
      ctx.body = users;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      ctx.status = 500;
      ctx.body = { error: 'Error retrieving user data' };
    }
  } else {
    await next();
  }
});

// GET /api/manager route to retrieve manager data
app.use(async (ctx, next) => {
  if (ctx.path === '/api/manager') {
    try {
      console.log('Inside /api/manager route');
      // Retrieve the manager data from the database based on the authenticated user's managerId
      const user = await User.findOne({ manager_Id: ctx.state.user.manager_Id });
      console.log('User:', user); // Log the user object
      const manager = user.manager_Id;
      console.log('Manager:', manager); // Log the retrieved manager object
      if (!manager) {
        ctx.status = 404;
        ctx.body = { error: 'Manager data not found' };
        return;
      }

      ctx.status = 200;
      ctx.body = manager;
    } catch (error) {
      console.error('Error retrieving manager data:', error);
      ctx.status = 500;
      ctx.body = { error: 'Error retrieving manager data' };
    }
  } else {
    await next();
  }
});

app.use(async (ctx, next) => {
  if (ctx.path === '/api/course') {
    try {
      // Retrieve all courses from the database
      const courses = await Course.find();

      ctx.status = 200;
      ctx.body = courses;
    } catch (error) {
      console.error('Error retrieving courses:', error);
      ctx.status = 500;
      ctx.body = { error: 'Error retrieving courses' };
    }
  } else {
    await next();
  }
});

app.use(async (ctx) => {
  if (ctx.path === '/') {
    ctx.body = 'Hello World!';
    console.log("hello")
  } 
});

// Connect to MongoDB
console.log("connecting to DB");
mongoose
  .connect('mongodb://localhost:27017/IP2Data', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });





