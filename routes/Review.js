const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    getAllReviews,
    getReview,
    createReview,
} = require('../controllers/reviewController');
const { protect } = require('../controllers/authController');

router.route('/').get(getAllReviews).post(protect, createReview);
router.route('/:id').get(getReview);

module.exports = router;
