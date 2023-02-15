var express = require('express');
var router = express.Router();

const middleware = require('../middlewares/auth');

const admin_controller = require('../controllers/admin.controller');
const users_controller = require('../controllers/users.controller');
const categories_controller = require('../controllers/categories.controller');
const courses_controller = require('../controllers/courses.controller');
const user_courses_controller = require('../controllers/user_courses.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/admin', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*Admin Routes*/
router.post('/register', admin_controller.admin_register);
router.post('/login', admin_controller.admin_login);

/*Users Routes*/
router.get('/users', middleware.auth, users_controller.users_read);
router.post('/users', middleware.auth, users_controller.users_create);
router.patch('/users', middleware.auth, users_controller.users_update);
router.delete('/users', middleware.auth, users_controller.users_delete);

/*Categories Routes*/
router.get('/category', middleware.auth, categories_controller.categories_read);
router.post('/category', middleware.auth, categories_controller.categories_create);
router.patch('/category', middleware.auth, categories_controller.categories_update);
router.delete('/category', middleware.auth, categories_controller.categories_delete);

/*Courses Routes*/
router.get('/course', middleware.auth, courses_controller.course_read);
router.post('/course', middleware.auth, courses_controller.course_create);
router.patch('/course', middleware.auth, courses_controller.course_update);
router.delete('/course', middleware.auth, courses_controller.course_delete);

/*User_Courses Routes */
router.get('/user_course', middleware.auth, user_courses_controller.user_courses_read);
router.post('/user_course', middleware.auth, user_courses_controller.user_courses_create);
router.patch('/user_course', middleware.auth, user_courses_controller.user_courses_update);
router.delete('/user_course', middleware.auth, user_courses_controller.user_courses_delete);

module.exports = router;
