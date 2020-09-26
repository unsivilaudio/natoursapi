const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/Users');
const tourRoutes = require('./routes/Tour');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', tourRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/overview.html');
});

module.exports = app;
