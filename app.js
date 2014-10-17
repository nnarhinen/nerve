var env = require('node-env-file'),
    path = require('path'),
    fs = require('fs'),
    envFile = path.join(__dirname, 'development.env');
if (fs.existsSync(envFile)) {
  env(envFile);
}


var express = require('express'),
    app = express(),
    nunjucks = require('nunjucks'),
    i18n = require('i18n-abide'),
    browserify = require('browserify-middleware'),
    stylus = require('stylus'),
    nib = require('nib'),
    jedify = require('jedify'),
    bookshelf = require('./db/bookshelf'),
    session = require('express-session'),
    BookshelfStore = require('connect-bookshelf')(session),
    _ = require('underscore'),
    util = require('util');


var languages = ['en', 'fi'];

app.locals.sprintf = function() {
  return util.format.apply(util, arguments);
};


nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('bookshelf', bookshelf);

app.use(i18n.abide({
  supported_languages: languages,
  default_lang: 'en',
  debug_lang: 'it-CH',
  translation_directory: 'i18n',
  locale_on_url: true
}));

var jedifyWithLang = function(lang) {
  return function(file) {
    return jedify(file, { 'lang': lang });
  };
};

var compileStylus = function(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
    .import('nib');
};

languages.forEach(function(lang) {
  app.get('/js/application.' + lang + '.js', browserify('./frontend/index.' + lang + '.js', {transform: ['reactify', jedifyWithLang(lang), 'envify']}));
});
app.get('/js/login.js', browserify('./frontend/login.js'));

app.use(stylus.middleware({src: __dirname + '/public', compile: compileStylus}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index.html');
});


app.use('/api', require('./routes/api'));

app.use(session({
  store: new BookshelfStore({model: bookshelf.models.Session}),
  secret: 'asdei32fa',
  resave: true,
  saveUninitialized: false
}));

app.use('/', require('./routes/oauth2'));

var oauth2 = require('simple-oauth2')({
  clientID: process.env.NERVE_OAUTH_CLIENT_ID,
  clientSecret: process.env.NERVE_OAUTH_CLIENT_SECRET,
  site: process.env.NERVE_ENDPOINT,
  tokenPath: '/oauth/token'
});

var authorizationUri = oauth2.AuthCode.authorizeURL({
  redirect_uri: process.env.NERVE_OAUTH_REDIRECT_URI
});

app.get('/callback/nerve', function(req, res, next) {
  var code = req.query.code;
  oauth2.AuthCode.getToken({
    code: code,
    redirect_uri: process.env.NERVE_OAUTH_REDIRECT_URI
  }, function(err, result) {
    if (err) return next(err);
    var token = oauth2.AccessToken.create(result);
    req.session.oauth2 = _.omit(token.token, 'expires_in');
    res.redirect('/app/');
  });
});

app.use(function(req, res, next) {
  if (!req.session.user || !req.session.user.id) return next();
  app.get('bookshelf').models.User.forge({id: req.session.user.id}).fetch().then(function(model) {
    req.user = model;
    next();
  }).catch(next);
});

app.get('/app/*', function(req, res, next) {
  if (!req.session.oauth2 || !req.session.oauth2.access_token) {
    return res.redirect(authorizationUri);
  }
  var tokenData = _.extend({
    expires_in: (new Date(req.session.oauth2.expires_at).getTime() - new Date().getTime()) / 1000
  }, _.omit(req.session.oauth2, 'expires_at'));
  var token = oauth2.AccessToken.create(tokenData);
  if (token.expired()) {
    return token.refresh(function(err, result) {
      if (err) return next(err);
      //var token = oauth2.AccessToken.create(result);
      req.session.oauth2 = _.omit(token.token, 'expires_in');
      render();
    });
  }
  render();

  function render() {
    res.render('app.html', {
      accessToken: req.session.oauth2.access_token,
      user: req.user && JSON.stringify(_.omit(req.user.toJSON(), 'password_hash'))
    });
  };
});

/*
app.get('/api/*', function(req, res, next) {
  if (req.session && req.session.isLoggedIn) return next();
  res.status(400).send({error: 'Auth required'});
});*/

module.exports = app;
