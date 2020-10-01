const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) throw new AppError('No document not found.', 404);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    });

const updateOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) throw new AppError('Document not found.', 404);
        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

const createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

module.exports = { deleteOne, updateOne, createOne };
