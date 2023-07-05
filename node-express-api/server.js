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
const CourseRecord = require('../src/models/course_record_model')//Import courserecord model 
const jwt = require('jsonwebtoken') //Import token 
const { swagger, swaggerSpec } = require('./swagger');



const app = new Koa();
const router = new Router();
const port = 5000;

app.use(cors());
app.use(bodyParser());

/**
 * @swagger
 * /enroll:
 *   put:
 *     summary: Enroll a user in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully enrolled in course
 *       '404':
 *         description: Course not found or user already enrolled on course
 *       '500':
 *         description: Error enrolling in course
 */
router.put('/enroll',async ctx => {
  try{
    const user = await User.findOne({_id: ctx.state.user._id});
    const {courseId} = ctx.request.body;
    const course = await Course.findOne({_id:courseId});
    const employee = await Employee.findOne({_id: user.employee_Id});
    const manager = await Manager.findOne({_id: user.manager_Id})
    
    console.log("this is the courses:",course);
    console.log("this is the manager:", manager);
    console.log("this is the employee:", employee);
    // Check if course exists
    if(!course){
      ctx.status = 404;
      ctx.body = { error: 'course not found'};
      return;
    }

    // Check if the employee is already enrolled 
    if(employee && employee.courses && employee.courses.includes(course._id)) {
      ctx.status = 404;
      ctx.body = { error: 'Already enrolled on course'};
      return;
    }

    //check if the manager is already enrolled 
    else if (manager && manager.courses && manager.courses.includes(course._id)) {
      ctx.status = 404;
      ctx.body = { error: 'Already enrolled on course' };
      return;
    }

    //enroll the employee to the course 
    if(employee) {
    employee.courses.push(course._id);
    await employee.save()
    }

    //enroll the manager on the course 
    if(manager) {
      manager.courses.push(course._id);
      await manager.save()
    }

    ctx.status = 200; 
    ctx.body = {success: 'successfully enrolled in course'};
  } catch (error) {
    console.error('Error enrolling in course:', error); 
    ctx.status = 500;
    ctx.body = {error: 'Error enrolling in course'};
  }
})

/**
 * @swagger
 * /unenroll:
 *   put:
 *     summary: Unenroll a user from a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully unenrolled from course
 *       '404':
 *         description: Course not found or user not enrolled on this course
 *       '500':
 *         description: Error unenrolling from course
 */
router.put('/unenroll',async ctx => {
  try{
    const user = await User.findOne({_id: ctx.state.user._id});
    const {courseId} = ctx.request.body;
    const course = await Course.findOne({_id:courseId});
    const employee = await Employee.findOne({_id: user.employee_Id});
    const manager = await Manager.findOne({_id: user.manager_Id});

    // Check if course exists
    if(!course){
      ctx.status = 404;
      ctx.body = { error: 'Course not found'};
      return;
    }

    // Check if the employee is not enrolled 
    if(employee && !employee.courses.includes(course._id)) {
      ctx.status = 404;
      ctx.body = { error: 'Employee not enrolled on this course'};
      return;
    }

    // Check if the manager is enrolled 
    if(manager && !manager.courses.includes(course._id)) {
      ctx.status = 404;
      ctx.body = {error: 'Manager not enrolled on this course'};
      return;
    }

    // Unenroll the employee from the course 
    if(employee) {
    const index = employee.courses.indexOf(course._id);
    if (index > -1) {
      employee.courses.splice(index, 1);
    await employee.save()
    }
  }
    //unenroll the manager from the course 
    if(manager){
      const index = manager.courses.indexOf(course._id);
      if (index > -1) {
        manager.courses.splice(index, 1);
        await manager.save();
      }
    }

    ctx.status = 200; 
    ctx.body = {success: 'Successfully unenrolled from course'};
  } catch (error) {
    console.error('Error unenrolling from course:', error); 
    ctx.status = 500;
    ctx.body = {error: 'Error unenrolling from course'};
  }
})

/**
 * @swagger
 * /manager/enroll:
 *   put:
 *     summary: Enroll an employee in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - courseId
 *             properties:
 *               employeeId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully enrolled employee in course
 *       '404':
 *         description: Course not found or employee already enrolled on course
 *       '500':
 *         description: Error enrolling employee in course
 */
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

/**
 * @swagger
 * /manager/unenroll:
 *   put:
 *     summary: Unenroll an employee from a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - courseId
 *             properties:
 *               employeeId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully unenrolled employee from course
 *       '404':
 *         description: Course not found or employee not enrolled on this course
 *       '500':
 *         description: Error unenrolling employee from course
 */
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

/**
 * @swagger
 * /complete:
 *   put:
 *     summary: Mark a course as complete for a user
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully marked course as complete
 *       '400':
 *         description: Not enrolled in the course, course already completed, or user is neither an employee nor a manager
 *       '404':
 *         description: Course, employee or manager not found
 *       '500':
 *         description: Error completing course
 */
router.put('/complete', async ctx => {
  try {
    const user = await User.findOne({ _id: ctx.state.user._id });
    const { courseId } = ctx.request.body;

    // Get course
    const course = await Course.findOne({ _id: courseId });

    // Check if the course exists
    if (!course) {
      ctx.status = 404;
      ctx.body = { error: 'Course not found' };
      return;
    }

    // Check if user is an Employee or Manager, then perform appropriate operations
    if (user.employee_Id) {
      // Handle Employee
      const employee = await Employee.findOne({ _id: user.employee_Id });

      // Check if the employee exists
      if (!employee) {
        ctx.status = 404;
        ctx.body = { error: 'Employee not found' };
        return;
      }

      // Check if the employee is not already enrolled or has already completed the course
      if (!employee.courses.includes(course._id) || course.completed.includes(employee._id)) {
        ctx.status = 400;
        ctx.body = { error: 'Not enrolled in the course or Course already completed' };
        return;
      }

      // Mark the course as completed by the employee
      course.completed.push(employee._id);
    } else if (user.manager_Id) {
      // Handle Manager
      const manager = await Manager.findOne({ _id: user.manager_Id });

      // Check if the manager exists
      if (!manager) {
        ctx.status = 404;
        ctx.body = { error: 'Manager not found' };
        return;
      }

      // Check if the manager is not already enrolled or has already completed the course
      if (!manager.courses.includes(course._id) || course.completed.includes(manager._id)) {
        ctx.status = 400;
        ctx.body = { error: 'Not enrolled in the course or Course already completed by Manager' };
        return;
      }

      // Mark the course as completed by the manager
      course.completed.push(manager._id);
    } else {
      ctx.status = 400;
      ctx.body = { error: 'User is neither an Employee nor a Manager' };
      return;
    }

    await course.save();
    ctx.status = 200;
    ctx.body = { success: 'Successfully marked course as complete!', course: course};
  } catch (error) {
    console.error('Error completing course:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error completing course' };
  }
});

/**
 * @swagger
 * /api/employee/courses:
 *   get:
 *     summary: Get all courses that the authenticated employee is enrolled in
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved courses
 *       '401':
 *         description: Missing or invalid authorization header or Invalid token
 *       '404':
 *         description: User or Employee not found
 *       '500':
 *         description: Error fetching enrolled courses or Error populating courses for employee
 */
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

/**
 * @swagger
 * /api/manager/courses:
 *   get:
 *     summary: Get all courses that the authenticated manager is enrolled in
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved courses
 *       '401':
 *         description: Missing or invalid authorization header or Invalid token
 *       '404':
 *         description: User or Manager not found
 *       '500':
 *         description: Error fetching enrolled courses or Error populating courses for manager
 */
router.get('/api/manager/courses', async (ctx) => {
  try {
    console.log('inside /api/manager/courses');

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

    const manager = await Manager.findOne({_id: user.manager_Id});

    if (!manager) {
      ctx.status = 404;
      ctx.body = { error: 'Manager not found' };
      return;
    }

    // Populate the courses field to retrieve the course details
    const populatedManager = await Manager.findById(manager._id).populate('courses').exec();

    if (!populatedManager) {
      ctx.status = 500;
      ctx.body = { error: 'Error populating courses for manager' };
      return;
    }

    ctx.status = 200;
    ctx.body = { courses: populatedManager.courses };
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error fetching enrolled courses' };
  }
});

/**
 * @swagger
 * /api/employee/{employeeId}/courses:
 *   get:
 *     summary: Get all courses that the specified employee is enrolled in
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         schema:
 *           type: string
 *         required: true
 *         description: Employee ID
 *     responses:
 *       '200':
 *         description: Successfully retrieved courses
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Error retrieving enrolled courses
 */
router.get('/api/employee/:employeeId/courses', async (ctx) => {
  try {
    console.log('inside api/employee/:employeeID/courses');
    const { employeeId } = ctx.params;
    console.log(employeeId);
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

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Add a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - provider
 *               - departments
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               provider:
 *                 type: string
 *               departments:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '201':
 *         description: Successfully added course
 *       '500':
 *         description: Error adding course
 */

router.post('/api/courses', async (ctx) => {
  const { name, description, provider, departments } = ctx.request.body;

  try {
    const course = new Course({
      name,
      description,
      provider,
      departments
    });

    await course.save();

    ctx.status = 201;
    ctx.body = course;
  } catch (error) {
    console.error('Error adding course:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error adding course' };
  }
});

/**
 * @swagger
 * /api/courses/{name}:
 *   delete:
 *     summary: Delete a course by name
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Course name
 *     responses:
 *       '200':
 *         description: Successfully deleted course
 *       '404':
 *         description: No course found with this name
 *       '500':
 *         description: Error removing course
 */
router.delete('/api/courses/:name', async (ctx) => {
  const { name } = ctx.params;

  try {
    const course = await Course.findOneAndDelete({name: name});

    if (!course) {
      ctx.status = 404;
      ctx.body = { error: 'No course found with this name.' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Course successfully deleted.' };
  } catch (error) {
    console.error('Error removing course:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error removing course' };
  }
});

/**
 * @swagger
 * /api/employee/{employeeId}/courseRecords:
 *   get:
 *     summary: Get training history for specified employee
 *     tags: [Training]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         schema:
 *           type: string
 *         required: true
 *         description: Employee ID
 *     responses:
 *       '200':
 *         description: Successfully retrieved training history
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Error fetching training history
 */
router.get('/api/employee/:employeeId/courseRecords', async ctx => {
  try {
    const { employeeId } = ctx.params;
    const employee = await Employee.findOne({_id: employeeId});
    // Check if employee exists
    if (!employee) {
      ctx.status = 404;
      ctx.body = { error: 'Employee not found' };
      return;
    }

    // Fetch all the courses the employee has enrolled in
    const courses = await Course.find({_id: { $in: employee.courses }}).select('name provider description completed');

    // Construct training history
    const trainingHistory = courses.map(course => {
      const status = course.completed && course.completed.includes(employeeId) ? 'completed' : 'In-progress';
      return {
        course: {
          name: course.name,
          provider: course.provider,
          description: course.description,
        },
        employee: employeeId,
        status: status
      };
    });

    ctx.status = 200;
    ctx.body = trainingHistory;
  } catch (error) {
    console.error('Error fetching training history:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error' };
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

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Retrieve all user data
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Successfully retrieved user data
 *       '500':
 *         description: Error retrieving user data
 */
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

/**
 * @swagger
 * /api/manager:
 *   get:
 *     summary: Retrieve manager data for authenticated user
 *     tags: [Managers]
 *     responses:
 *       '200':
 *         description: Successfully retrieved manager data
 *       '404':
 *         description: Manager data not found
 *       '500':
 *         description: Error retrieving manager data
 */
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

/**
 * @swagger
 * /api/employee:
 *   get:
 *     summary: Retrieve employee data for authenticated user
 *     tags: [Employees]
 *     responses:
 *       '200':
 *         description: Successfully retrieved employee data
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Error retrieving employee data
 */
app.use(async (ctx, next) => {
  if (ctx.path === '/api/employee'){
    try {
      console.log('Inside /api/employee route');
      // Retrieve the manager data from the database based on the authenticated user's employeeId
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

/**
 * @swagger
 * /api/all/employees:
 *   get:
 *     summary: Retrieve all employees for authenticated manager
 *     tags: [Employees]
 *     responses:
 *       '200':
 *         description: Successfully retrieved employees data
 *       '404':
 *         description: No employees found
 *       '401':
 *         description: Missing or invalid authorization header or Invalid token
 *       '500':
 *         description: Error retrieving employees data
 */
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

/**
 * @swagger
 * /api/course:
 *   get:
 *     summary: Retrieve all courses for specific departments or all courses if no department is specified
 *     tags: [Courses]
 *     responses:
 *       '200':
 *         description: Successfully retrieved courses
 *       '500':
 *         description: Error retrieving courses
 */
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

/**
 * @swagger
 * /:
 *   get:
 *     summary: Default route to test the server
 *     tags: [Test]
 *     responses:
 *       '200':
 *         description: Server running successfully
 */
app.use(async (ctx) => {
  if (ctx.path === '/') {
    ctx.body = 'Hello World!';
    console.log("hello")
  } 
});

app.use(swagger);

router.get('/swagger.json', async (ctx) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = swaggerSpec;
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






