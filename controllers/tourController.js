const fs = require('fs');
const tours = require('../dev-data/data/tours-simple.json');

const getAllTours = (req, res) => {
    // console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: { tours },
    });
};

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const foundTour = tours.find(el => el.id === id);

    if (!foundTour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: foundTour,
        },
    });
};

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = { id: newId, ...req.body };

    tours.push(newTour);

    fs.writeFile(
        `../dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );
};

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    const foundTour = tours.find(el => el.id === id);

    if (!foundTour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: 'UPDATED TOUR HERE',
        },
    });
};

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    const foundTour = tours.find(el => el.id === id);

    if (!foundTour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
};

module.exports = { getAllTours, getTour, createTour, updateTour, deleteTour };
