const AppError = require('../utils/appError');

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Inavlid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = err =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiresError = err =>
    new AppError('Your token has expired. Please log in again!', 401);

const handleDuplicateFieldsDB = err => {
    const value = err.message.match(/(['"])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}, Please use another value!`;
    return new AppError(message, 400);
};

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }

    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
    });
};

const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api') && err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
        });
    }

    console.log('Error', err.message);
    return res.status(500).render('error', {
        title: 'Something went wrong',
        msg: 'Please try again',
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (err.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (err.name === 'TokenExpiredError')
            error = handleJWTExpiresError(error);
        sendErrorProd(error, req, res);
    }
};
