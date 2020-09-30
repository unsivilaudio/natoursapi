const mongoose = require('mongoose');

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

reviewSchema.pre(/^find/, function (next) {
    this.select('-__v');
    next();
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name',
    }).populate({
        path: 'user',
        select: 'name photo',
    });

    next();
});

module.exports = mongoose.model('Review', reviewSchema);
