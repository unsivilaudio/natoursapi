const Tour = require('./models/tour');
const Review = require('./models/review');
const User = require('./models/user');
const tours = require('./dev-data/data/tours.json');
const reviews = require('./dev-data/data/reviews.json');
const users = require('./dev-data/data/users.json');

const seedTours = async () => {
    await Tour.find().deleteMany();
    console.log('[SeedDB] Tours removed from db');
    tours.forEach(async tour => {
        await Tour.create(tour);
        console.log('[SeedDB] Tour created!');
    });
};

const seedUsers = async () => {
    await User.find().deleteMany();
    console.log('[SeedDB] Users removed from db');
    users.forEach(async user => {
        const newUser = new User(user);
        newUser.password = 'password123';
        await newUser.save({ validateBeforeSave: false });
        console.log('[SeedDB] User created!');
    });
};

const seedReviews = async () => {
    await Review.find().deleteMany();
    console.log('[SeedDB] Users removed from db');
    reviews.forEach(async review => {
        await Review.create(review);
        console.log('[SeedDB] Review created!');
    });
};

module.exports = { seedTours, seedUsers, seedReviews };
