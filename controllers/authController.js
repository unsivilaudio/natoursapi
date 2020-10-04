const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

const signToken = id =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOpts = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        secure: true,
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'development') cookieOpts.secure = false;

    res.cookie('jwt', token, cookieOpts);

    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    const url = `${req.protocol}://${req.get('host')}/me`;
    console.log(url);
    await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('Missing email or password', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError('Invalid email or password', 401);
    }

    createSendToken(user, 200, res);
});

const logout = (req, res) => {
    res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({ status: 'success' });
};

const isLoggedIn = catchAsync(async (req, res, next) => {
    if (req.cookies.jwt && req.cookies.jwt !== 'loggedOut') {
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt,
            process.env.JWT_SECRET
        );
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next();
        }

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next();
        }

        res.locals.user = currentUser;
        return next();
    }
    next();
});

const protect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedOut') {
        token = req.cookies.jwt;
    }
    if (!token) {
        throw new AppError(
            'You are not logged in! Please log in to get access.',
            401
        );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new AppError(
            'The user belonging to this token no longer exists.',
            401
        );
    }

    if (user.changedPasswordAfter(decoded.iat)) {
        throw new AppError(
            'This token is no longer valid. Please log in again!',
            403
        );
    }

    req.user = user;
    res.locals.user = user;
    next();
});

const restrictTo = roles => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        throw new AppError('You are not authorized to do that.', 401);
    }
    next();
};

const forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new AppError('No user with that email address!', 404);

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/users/resetpassword/${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email',
        });
    } catch (err) {
        console.log(err.message);
        user.passwordResetToken = undefined;
        user.passwordResetExpired = undefined;
        await user.save({ validateBeforeSave: false });
        throw new AppError(
            'There was aan error sending the email. Try again later.',
            500
        );
    }
});

const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpired: { $gt: Date.now() },
    });
    if (!user) throw new AppError('Invalid or expired reset link', 400);

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save();

    createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');
    if (
        !user ||
        !(await user.correctPassword(req.body.password, user.password))
    ) {
        throw new AppError('Invalid credentials supplied!', 403);
    }
    const { updatePassword, updatePasswordConfirm } = req.body;
    if (!updatePassword || !updatePasswordConfirm) {
        throw new AppError(
            'Missing updatePassword or updatePasswordConfirm fields',
            400
        );
    } else if (updatePasswordConfirm !== updatePassword) {
        throw new AppError('Passwords do not match, please try again.');
    }
    user.password = updatePassword;
    user.passwordConfirm = updatePasswordConfirm;
    await user.save();

    createSendToken(user, 200, res);
});

module.exports = {
    signup,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword,
    isLoggedIn,
    logout,
};
