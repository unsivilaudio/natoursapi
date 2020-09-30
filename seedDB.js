const Tour = require('./models/tour');
const tours = require('./dev-data/data/tours.json');

const seedTours = async () => {
    await Tour.find().deleteMany();
    console.log('[SeedDB] Tours removed from db');
    tours.forEach(async tour => {
        await Tour.create(tour);
        console.log('[SeedDB] Tour created!');
    });
};

seedTours();
