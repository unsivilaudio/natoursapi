const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect, restrictTo } = require('../controllers/authController');
const {
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    setTourUserIds,
} = require('../controllers/reviewController');

router.use(protect);
router
    .route('/') // Create tour reviews and read All reviews
    .get(getAllReviews)
    .post(restrictTo(['user']), setTourUserIds, createReview);

router
    .route('/:id') // Read/Edit/Destroy one tour review
    .get(getReview)
    .patch(restrictTo(['user']), updateReview)
    .delete(restrictTo(['user']), deleteReview);

module.exports = router;
