const express = require('express');
const morgan = require('morgan');
const TourRouter = require('./routes/tourRoutes');
const UserRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', TourRouter);
app.use('/api/v1/users', UserRouter);

module.exports = app;
