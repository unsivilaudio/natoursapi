const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const csp = require('express-csp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const reviewRoutes = require('./routes/Review');
const userRoutes = require('./routes/User');
const tourRoutes = require('./routes/Tour');
const viewRoutes = require('./routes/View');
const bookingRoutes = require('./routes/Booking');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

app.use(helmet());

csp.extend(app, {
    policy: {
        directives: {
            'default-src': ['self'],
            'style-src': [
                'self',
                'unsafe-inline',
                'https://fonts.googleapis.com',
                'https://api.mapbox.com',
            ],
            'font-src': ['self', 'https://fonts.gstatic.com'],
            'script-src': [
                'self',
                'unsafe-inline',
                'data',
                'blob',
                'https://js.stripe.com',
                'https://m.stripe.com',
                'https://m.stripe.network',
                'https://api.mapbox.com',
                'https://cdnjs.cloudflare.com',
            ],
            'worker-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://js.stripe.com',
                'https://api.mapbox.com',
            ],
            'frame-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://js.stripe.com',
                'https://api.mapbox.com',
            ],
            'img-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://js.stripe.com',
                'https://api.mapbox.com',
            ],
            'connect-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://api.mapbox.com',
                'https://events.mapbox.com',
                'ws://localhost:*',
            ],
        },
    },
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/', viewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/booking', bookingRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

app.use(globalErrorHandler);

module.exports = app;
