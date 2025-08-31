console.log('=== DEBUG INFO ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('=================');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cartCounter = require('./middlewares/cartCounter');
const cartPrice = require('./middlewares/cartPrice')
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/productsRoutes');
var cartRouter = require('./routes/cart');
var apiRouter = require('./routes/apiRoutes') //Rutas de las apis

var app = express();
const session = require('express-session');



app.use(session({
  secret: '1123581321', 
  resave: false,
  saveUninitialized: false
}));


const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(userLoggedMiddleware);
app.use(cartPrice)

app.use(express.static(path.join(__dirname, 'public')));
app.use(cartCounter); 
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', productsRouter);
app.use('/', cartRouter);
app.use('/api', apiRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
