const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const app = require('./app');
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on('connected', () => {
    console.log('[Mongoose] Connected to DB.');
    app.listen(port, () => {
        console.log(`[Server] Listening on port ${port}`);
    });
});
db.on('error', err => {
    throw new Error(`[Mongoose] Connection error: ${err.message}`);
});
