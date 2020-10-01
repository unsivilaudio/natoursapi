const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect, restrictTo } = require('../controllers/authController');
const {
    getAllReviews,
    getReview,
    createReview,
    editReview,
    deleteReview,
} = require('../controllers/reviewController');

router
    .route('/') // Create tour reviews and read All reviews
    .get(getAllReviews)
    .post(protect, restrictTo('user'), createReview);

router
    .route('/:reviewId') // Read/Edit/Destroy one tour review
    .get(getReview)
    .patch(protect, editReview)
    .delete(protect, deleteReview);

module.exports = router;
