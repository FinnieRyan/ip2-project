const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const cors = require('koa-cors');
const Router = require('@koa/router');
const authService = require('../src/services/authService'); //Import auth service 
const User = require('../src/models/user_model'); // Import the User model
const Course = require('../src/models/course_model'); // Import the Course model
const Manager = require('../src/models/manager_model'); // Import the manager model
const Employee = require('../src/models/employee_model');// Import Employee model 
const jwt = require('jsonwebtoken') //Import token 



const app = new Koa();
const router = new Router();
const port = 5000;

app.use(cors());
app.use(bodyParser());

//new /enroll route
router.put('/enroll',async ctx => {
  try{
    const user = await User.findOne({_id: ctx.state.user._id});
    const {courseId} = ctx.request.body;
    const course = await Course.findOne({_id:courseId});
    const employee = await Employee.findOne({_id: user.employee_Id});

    // Check if course exists
    if(!course){
      ctx.status = 404;
      ctx.body = { error: 'course not found'};
      return;
    }

    // Check if the employee is already enrolled 
    if(employee.courses.includes(course._id)) {
      ctx.status = 404;
      ctx.body = { error: 'Already enrolled on course'};
      return;
    }

    //enroll the employee to the course 
    employee.courses.push(course._id);
    await employee.save()
    ctx.status = 200; 
    ctx.body = {success: 'successfully enrolled in course'};
  } catch (error) {
    console.error('Error enrolling in course:', error); 
    ctx.status = 500;
    ctx.body = {error: 'Error enrolling in course'};
  }
})

// new /unenroll route
router.put('/unenroll',async ctx => {
  try{
    const user = await User.findOne({_id: ctx.state.user._id});
    const {courseId} = ctx.request.body;
    const course = await Course.findOne({_id:courseId});
    const employee = await Employee.findOne({_id: user.employee_Id});

    // Check if course exists
    if(!course){
      ctx.status = 404;
      ctx.body = { error: 'Course not found'};
      return;
    }

    // Check if the employee is not enrolled 
    if(!employee.courses.includes(course._id)) {
      ctx.status = 404;
      ctx.body = { error: 'Employee not enrolled on this course'};
      return;
    }

    // Unenroll the employee from the course 
    const index = employee.courses.indexOf(course._id);
    if (index > -1) {
      employee.courses.splice(index, 1);
    }
    await employee.save()
    ctx.status = 200; 
    ctx.body = {success: 'Successfully unenrolled from course'};
  } catch (error) {
    console.error('Error unenrolling from course:', error); 
    ctx.status = 500;
    ctx.body = {error: 'Error unenrolling from course'};
  }
})
router.put('/manager/enroll', async ctx => {
  try {
    const {employeeId, courseId} = ctx.request.body;
    const course = await Course.findOne({_id:courseId});
    const employee = await Employee.findOne({_id: employeeId});

    if(!course){
      ctx.status = 404;
      ctx.body = { error: 'Course not found'};
      return;
    }

    if(employee.courses.includes(course._id)) {
      ctx.status = 404;
      ctx.body = { error: 'Already enrolled in course'};
      return;
    }

    employee.courses.push(course._id);
    await employee.save()
    ctx.status = 200; 
    ctx.body = {success: 'Successfully enrolled employee in course'};
  } catch (error) {
    console.error('Error enrolling employee in course:', error); 
    ctx.status = 500;
    ctx.body = {error: 'Error enrolling employee in course'};
  }
})

router.put('/manager/unenroll', async ctx => {
  try {
    const {employeeId, courseId} = ctx.request.body;
    const course = await Course.findOne({_id:courseId});
    const employee = await Employee.findOne({_id: employeeId});

    if(!course){
      ctx.status = 404;
      ctx.body = { error: 'Course not found'};
      return;
    }

    if(!employee.courses.includes(course._id)) {
      ctx.status = 404;
      ctx.body = { error: 'Employee is not enrolled in this course'};
      return;
    }

    employee.courses = employee.courses.filter(id => id.toString() !== course._id.toString());
    await employee.save()
    ctx.status = 200; 
    ctx.body = {success: 'Successfully unenrolled employee from course'};
  } catch (error) {
    console.error('Error unenrolling employee from course:', error); 
    ctx.status = 500;
    ctx.body = {error: 'Error unenrolling employee from course'};
  }
})

router.get('/api/employee/courses', async (ctx) => {
  try {
    console.log('inside /api/employee/courses');
  
    const authHeader = ctx.request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: 'Missing or invalid authorization header' };
      return;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, 'secretKey'); 
    } catch (error) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid token' };
      return;
    }

    const user = await User.findOne({_id: decodedToken.userId});
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    const employee = await Employee.findOne({_id: user.employee_Id});

    if (!employee) {
      ctx.status = 404;
      ctx.body = { error: 'Employee not found' };
      return;
    }

    // Populate the courses field to retrieve the course details
    const populatedEmployee = await Employee.findById(employee._id).populate('courses').exec();

    if (!populatedEmployee) {
      ctx.status = 500;
      ctx.body = { error: 'Error populating courses for employee' };
      return;
    }

    ctx.status = 200;
    ctx.body = { courses: populatedEmployee.courses };
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error fetching enrolled courses' };
  }
});

// GET /api/employee/:employeeId/courses route to retrieve enrolled courses for a given employee
router.get('/api/employee/:employeeId/courses', async (ctx) => {
  try {
    console.log('inside api/employee/:employeeID/courses');
    const { employeeId } = ctx.params;
    const employee = await Employee.findOne({_id: employeeId});
    console.log('employee ID :', employeeId);

    if(!employee){
      ctx.status = 404;
      ctx.body = { error: 'Employee not found'};
      return;
    }

    // Populate the courses field to retrieve the course details
    const populatedEmployee = await Employee.findById(employee._id).populate('courses').exec();
    
    ctx.status = 200;
    ctx.body = { courses: employee.courses };
  } catch (error) {
    console.error('Error retrieving enrolled courses:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error retrieving enrolled courses'};
  }
});




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
app.use(router.routes());

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
      const user = await User.findOne({ _id: ctx.state.user._id });
      console.log('User:', user); // Log the user object
      
      // Retrieve the manager data from the Managers collection using the user's manager_Id
      const manager = await Manager.findOne({ _id: user.manager_Id });
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
  if (ctx.path === '/api/employee'){
    try {
      console.log('Inside /api/employee route');
      // Retrieve the manager data from the database based on the authenticated user's managerId
      const user = await User.findOne({ _id: ctx.state.user._id });
      console.log('User:', user); // Log the user object

      const employee = await Employee.findOne({ _id: user.employee_Id });
      console.log('employee', employee);
      if (!employee) {
        ctx.status = 404;
        ctx.body = {error: 'Employee not found'};
        return;
      }
      ctx.status = 200;
      ctx.body = employee;
    } catch (error) {
      console.error('Error retrieving employee data ', error);
      ctx.status = 500;
      ctx.body = { error: 'Error retrieving employee data'}
    }
  } else {
    await next();
  }
});


app.use(async (ctx, next) => {
  if (ctx.path === '/api/all/employees') {
    try {
      console.log('Inside /api/employees route');

      // Retrieve the JWT token from the request header
      const authHeader = ctx.request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ctx.status = 401;
        ctx.body = { error: 'Missing or invalid authorization header' };
        return;
      }

      const token = authHeader.split(' ')[1];
      
      // Verify and decode the JWT token to get the manager ID
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, 'secretKey');
      } catch (error) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid token' };
        return;
      }

      const managerId = decodedToken.managerId;
      console.log('Manager ID:', managerId); // Log the manager ID

      // Retrieve employees associated with the manager
      const employees = await Employee.find({ manager_id: managerId });

      console.log('Employees:', employees); // Log the employees object

      if (!employees || employees.length === 0) {
        ctx.status = 404;
        ctx.body = { error: 'No employees found' };
        return;
      }

      ctx.status = 200;
      ctx.body = employees;
    } catch (error) {
      console.error('Error retrieving employees data', error);
      ctx.status = 500;
      ctx.body = { error: 'Error retrieving employees data' };
    }
  } else {
    await next();
  }
});


app.use(async (ctx, next) => {
  if (ctx.path === '/api/course') {
    try {
      const departments = ctx.request.headers.departments; // Retrieve the departments from the request headers
      let courses = [];

      if (departments) {
        // If departments are provided in the request headers, filter the courses based on the departments
        courses = await Course.find({ departments: { $in: departments } });
      } else {
        // If no departments are provided, retrieve all courses
        courses = await Course.find();
      }

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






