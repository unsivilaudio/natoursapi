const express = require('express');
const {
    getOverview,
    getTour,
    getLogin,
    getAccount,
    updateUserData,
} = require('../controllers/viewController');
const { isLoggedIn, protect } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.get('/me', protect, getAccount);
router.post('/submit-user-data', protect, updateUserData);

router.use(isLoggedIn);
router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLogin);

module.exports = router;
