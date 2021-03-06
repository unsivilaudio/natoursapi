const express = require('express');

const router = express.Router({ mergeParams: true });
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    getMe,
    uploadUserPhoto,
    resizeUserPhoto,
} = require('../controllers/userController');
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    protect,
    updatePassword,
    restrictTo,
    logout,
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);

// Must be logged in below here
router.use(protect);
router.patch('/updatepassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateme', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteme', deleteMe);

// Must be Admin below here
router.use(restrictTo('admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
