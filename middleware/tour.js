const tours = require('../dev-data/data/tours-simple.json');

const isValidTour = (req, res, next) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid tour specified.  Please include a name property.',
        });
    }
    next();
};

module.exports = { isValidTour };
