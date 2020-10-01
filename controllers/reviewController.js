const Review = require('../models/review');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const getAllReviews = catchAsync(async (req, res, next) => {
    let filter;
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Review.find(filter), req.query)
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

const setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

const createReview = factory.createOne(Review);
const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);

module.exports = {
    getAllReviews,
    getReview,
    createReview,
    setTourUserIds,
    updateReview,
    deleteReview,
};
