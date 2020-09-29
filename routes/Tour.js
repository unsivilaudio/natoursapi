const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    getToursStats,
    getMonthlyPlan,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const { aliasTopTours } = require('../middleware/tour');

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getToursStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createTour);
router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(protect, restrictTo(['admin', 'lead-guide']), deleteTour);

module.exports = router;
