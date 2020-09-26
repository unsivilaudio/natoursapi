const Tour = require('../models/tour');

const getAllTours = async (req, res) => {
    const tours = await Tour.find();

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours },
    });
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

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
};
