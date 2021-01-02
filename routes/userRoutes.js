const express = require('express');
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')


const videoRoutes = require('./videoRoutes');
const reviewRoutes = require('./reviewRoutes');
const router = express.Router();
router.use('/user/add-video', videoRoutes)
router.use('/user/course/:idCourse/review', reviewRoutes)
// ROUTER FOR USERrouter.use('/:courseId/reviews', reviewRoutes);
router.get('/', authController.index)
router.get('/logout', authController.getLogout);
router
    .post('/user/updatePassword', authController.protect, authController.updatePassword);
router.route('/forgotPassword')
    .get(authController.getForgotPassword)
    .post(authController.postForgotPassword)

router.route('/resetPassword/:token')
    .get(authController.getResetPassword)
router.route('/user/updateMe').post(authController.protect, userController.updateMe)
router
    .route('/register')
    .get(authController.getRegister)
    .post(authController.postRegister);


router.use('/user/enrolledCourse', authController.protect, authController.restrictTo('user'));

router.route('/user/enrolledCourse').get(userController.getEnrolledCoursed)

router.use('/user/wish-list', authController.protect)
router.route('/user/wish-list').get(userController.getAllWishListByUser)
router.route('/user/wish-list/:idCourse').get(authController.protect, userController.getAddWishList)

router.route('/user/wish-list/:idCourse/delete').get(authController.protect, userController.deleteOneWishList)


router.route('/user/add-course').get(authController.protect, authController.restrictTo('instructors', 'admin'), userController.addCourses)

router
    .route('/login')
    .get(authController.getLogin)
    .post(authController.postLogin);
router.route('/profile')
    .get(authController.protect, userController.getUserProfile)
module.exports = router;