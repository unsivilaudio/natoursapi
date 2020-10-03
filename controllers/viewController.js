const Tour = require('../models/tour');
const User = require('../models/user');
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
    if (!tour) return next(new AppError('Tour not found!', 404));
    res.status(200).render('tour', {
        title: tour.name,
        tour,
    });
});

const getLogin = (req, res) => {
    res.status(200).render('login');
};

const getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account',
    });
};

const updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser,
    });
});

module.exports = { getOverview, getTour, getLogin, getAccount, updateUserData };
