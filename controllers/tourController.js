const Tour = require('../models/tour');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limit()
        .paginate();
    const tours = await features.query;

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours },
    });
});

const getTour = catchAsync(async (req, res, next) => {
    const foundTour = await Tour.findById(req.params.id).populate('reviews');
    if (!foundTour) throw new AppError('Tour not found.', 404);
    res.status(200).json({
        status: 'success',
        data: {
            tour: foundTour,
        },
    });
});

const createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
});

const updateTour = catchAsync(async (req, res, next) => {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedTour) throw new AppError('Tour not found.', 404);
    res.status(200).json({
        status: 'success',
        data: {
            tour: updatedTour,
        },
    });
});

const deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) throw new AppError('Tour not found.', 404);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

const getToursStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: {
                avgPrice: 1,
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = +req.params.year;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numToursStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { numToursStarts: -1 },
        },
        {
            $limit: 12,
        },
    ]);

    res.status(200).json({
        status: 'success',
        plan,
    });
});

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    getToursStats,
    getMonthlyPlan,
};
