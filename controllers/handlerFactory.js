const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
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

const getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query.populate(popOptions);
        const doc = await query;

        if (!doc) throw new AppError('Document not found.', 404);
        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

const getAll = Model =>
    catchAsync(async (req, res, next) => {
        let filter;
        if (req.params.tourId) filter = { tour: req.params.tourId };
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limit()
            .paginate();
        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc,
            },
        });
    });

module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
