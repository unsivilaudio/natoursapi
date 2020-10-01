const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../controllers/authController');
const {
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    setTourUserIds,
} = require('../controllers/reviewController');

router
    .route('/') // Create tour reviews and read All reviews
    .get(getAllReviews)
    .post(protect, setTourUserIds, createReview);

router
    .route('/:id') // Read/Edit/Destroy one tour review
    .get(getReview)
    .patch(protect, updateReview)
    .delete(protect, deleteReview);

module.exports = router;
