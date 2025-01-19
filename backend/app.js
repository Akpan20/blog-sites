var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Import Sequelize and models
const { sequelize } = require('./models');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Function to run migrations
async function runMigrations() {
  try {
    await sequelize.authenticate(); // Test the database connection
    console.log('Database connection has been established successfully.');

    // Run migrations
    await sequelize.sync({ force: false }); // Set `force: true` to drop and recreate tables
    console.log('Migrations completed successfully.');
  } catch (err) {
    console.error('Failed to run migrations:', err);
  }
}

// Run migrations when the app starts
runMigrations();

module.exports = app;