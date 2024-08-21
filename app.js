const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');

const toursRouter = require('./routes/tourRoutes.js');
const usersRouter = require('./routes/userRoutes.js');
const errorController = require('./controllers/errorController');

const app = express();

// const path = './public/overview.html'
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // console.log((req.requestTime = new Date().toISOString()));
  next();
});

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(
  //   `Couldn't find page ${req.originalUrl} on this server!`,
  // );
  // err.status = 'fail';
  // err.statusCode = 404;

  next(
    new AppError(`Couldn't find page ${req.originalUrl} on this server!`, 404),
  );
});

app.use((err, req, res, next) => errorController(err, req, res, next));

module.exports = app;
