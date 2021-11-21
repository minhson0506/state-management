'use strict';
const express = require('express');
const cookieParse = require('cookie-parser');
const session = require('express-session');
const passport = require('./utils/pass');
const app = express();
const port = 3000;

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};

app.set('views', './views');
app.set('view engine', 'pug');
app.use(cookieParse());
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

const username = 'foo';
const password = 'bar';

app.get('/', (req, res) => {
  console.log('cookies', req.cookies);
  console.log('session', req.session);
  res.render('home');
});

app.get('/setCookie/:clr', (req, res) => {
  // res.cookie('color', req.params.clr, { maxAge : 60*60*24*5, httpOnly: true});
  res.cookie('color', req.params.clr);
  res.send('cookie set');
});

app.get('/getCookie', (req, res) => {
  console.log('cookies', req.cookies);
  res.send(`color is ${req.cookies.color}`)
});

app.get('/deleteCookie', (req, res) => {
  res.clearCookie('color');
  console.log('cookies', req.cookies);
  res.send(`delete cookie color`)
});

app.get('/form', (req, res) => {
  console.log('cookies', req.cookies);
  res.render('form');
});

app.post('/login', passport.authenticate('local', {failureRedirect: '/form'}), (req, res) => {
  console.log('success');
  res.redirect('/secret');
});

app.get('/secret', loggedIn, (req, res) => {
  res.render('secret');
});

app.get('/logout', (req, res) => {
  req.session.logged = false;
  res.send('Bye!<br><a href="form">Sign again');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
