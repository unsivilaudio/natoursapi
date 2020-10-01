const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

process.on('uncaughtException', err => {
    console.log('UNHANDLED EXCEPTION: Shutting down...');
    console.log(err.name, err.message);
});

const app = require('./app');
let server;
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on('connected', () => {
    console.log('[Mongoose] Connected to DB.');
    server = app.listen(port, () => {
        console.log(`[Server] Listening on port ${port}`);
    });
    // require('./seedDB').seedUsers();
});
db.on('error', err => {
    throw new Error(`[Mongoose] Connection error: ${err.message}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION: Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
