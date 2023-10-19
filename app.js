const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const flash = require('express-flash');
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(flash());


// Passport Configuration
app.use(require('express-session')({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local', {
  successRedirect: '/memes',
  failureRedirect: '/login',
  failureFlash: true,
}));

// Routes
const loginRouter = require('./routes/login');
const memeRouter = require('./routes/meme');
const indexRouter = require('./routes/index');
app.use('/login', loginRouter);
app.use('/', indexRouter);
app.use('/', memeRouter);


// Error Handling
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;