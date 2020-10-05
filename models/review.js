const mongoose = require('mongoose');
const Tour = require('./tour');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Please provide a review'],
            minlength: [10, 'Your review must be at least 10 characters'],
            maxlength: [500, 'Your review must be at less than 500 characters'],
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating between 1 and 5'],
            min: [1, 'Please provide a rating greater than 0'],
            max: [5, 'Please provide a rating less than 6'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        tour: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a tour.'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user.'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    this.select('-__v');
    next();
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo',
    });

    next();
});

reviewSchema.statics.calcAverageRating = async function (id) {
    const stats = await this.aggregate([
        {
            $match: { tour: id },
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);

    if (stats.length > 0) {
        const tour = await Tour.findByIdAndUpdate(id, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating,
        });
        await tour.save();
    } else {
        const tour = await Tour.findByIdAndUpdate(id, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
        await tour.save();
    }
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRating(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRating(this.r.tour);
});

module.exports = mongoose.model('Review', reviewSchema);
