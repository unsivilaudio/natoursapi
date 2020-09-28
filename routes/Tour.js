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
const { aliasTopTours } = require('../middleware/tour');

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getToursStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
