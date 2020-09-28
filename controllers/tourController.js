const Tour = require('../models/tour');
const APIFeatures = require('../utils/apiFeatures');

const getAllTours = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

const getTour = async (req, res) => {
    try {
        const foundTour = await Tour.findById(req.params.id);
        if (!foundTour) throw new Error('Tour not found.');
        res.status(200).json({
            status: 'success',
            data: {
                tour: foundTour,
            },
        });
    } catch (err) {
        return res.status(404).json({ status: 'fail', message: err.message });
    }
};

const createTour = async (req, res) => {
    const newTour = new Tour(req.body);
    try {
        await newTour.save();
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

const updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(200).json({
            status: 'success',
            data: {
                tour: updatedTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

const deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

const getToursStats = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

const getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    getToursStats,
    getMonthlyPlan,
};
