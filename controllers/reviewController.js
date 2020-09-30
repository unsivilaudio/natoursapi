const Review = require('../models/review');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllReviews = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Review.find(), req.query)
        .filter()
        .sort()
        .limit()
        .paginate();
    const reviews = await features.query;

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: { reviews },
    });
});

const getReview = catchAsync(async (req, res, next) => {
    const foundReview = await Review.findById(req.params.id);
    if (!foundReview) throw new AppError('Review not found.', 404);
    res.status(200).json({
        status: 'success',
        data: {
            Review: foundReview,
        },
    });
});

const createReview = catchAsync(async (req, res, next) => {
    const submittedReview = { ...req.body, user: req.user.id };
    const newReview = await Review.create(submittedReview);
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview,
        },
    });
});

module.exports = { getAllReviews, getReview, createReview };
