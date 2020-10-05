const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewRouter = require('./Review');
const {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    getToursStats,
    getMonthlyPlan,
    getToursWithin,
    getDistances,
    resizeTourImages,
    uploadTourImages,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const { aliasTopTours } = require('../middleware/tour');

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getToursStats);
router
    .route('/monthly-plan/:year')
    .get(protect, restrictTo(['admin', 'guide', 'lead-guide']), getMonthlyPlan);

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
    .route('/')
    .get(getAllTours)
    .post(protect, restrictTo(['admin', 'lead-guide']), createTour);
router
    .route('/:id') // CRUD tour
    .get(getTour)
    .patch(
        protect,
        restrictTo(['admin', 'lead-guide']),
        uploadTourImages,
        resizeTourImages,
        updateTour
    )
    .delete(protect, restrictTo(['admin', 'lead-guide']), deleteTour);

module.exports = router;
