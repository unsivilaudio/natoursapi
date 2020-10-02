const Tour = require('../models/tour');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
});

const getTour = catchAsync(async (req, res, next) => {
    if (!req.params.slug) res.redirect('/');
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });
    if (!tour) throw new AppError('Tour not found!', 404);
    console.log(tour);
    res.status(200).render('tour', {
        title: tour.name,
        tour,
    });
});

module.exports = { getOverview, getTour };
