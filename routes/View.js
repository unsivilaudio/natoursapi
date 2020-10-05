const express = require('express');
const {
    getOverview,
    getTour,
    getLogin,
    getAccount,
    updateUserData,
    getMyTours,
} = require('../controllers/viewController');
const { isLoggedIn, protect } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router({ mergeParams: true });

router.use(protect);
router.get('/me', getAccount);
router.get('/my-tours', getMyTours);
router.post('/submit-user-data', updateUserData);

router.use(isLoggedIn);
router.get('/', createBookingCheckout, getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLogin);

module.exports = router;
