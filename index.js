const express = require('express');
const morgan = require('morgan');
const authRoutes = require('./routes/Auth');
const tourRoutes = require('./routes/Tour');

const app = express();
const appPort = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use(authRoutes);
app.use(tourRoutes);

app.listen(appPort, () => {
    console.log(`[Server] Listening on port ${appPort}`);
});
