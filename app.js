var express = require('express'),
    app = express(),
    nunjucks = require('nunjucks'),
    i18n = require('i18n-abide'),
    browserify = require('browserify-middleware'),
    stylus = require('stylus'),
    nib = require('nib'),
    path = require('path'),
    jedify = require('jedify'),
    bookshelf = require('./db/bookshelf'),
    env = require('node-env-file'),
    fs = require('fs'),
    session = require('express-session'),
    BookshelfStore = require('connect-bookshelf')(session),
    util = require('util');


var envFile = path.join(__dirname, 'development.env');
if (fs.existsSync(envFile)) {
  env(envFile);
}

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
    .use(nib());
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
    req.session.oauth2 = token.token;
    res.redirect('/app/');
  });
});

app.get('/app/*', function(req, res, next) {
  if (!req.session.oauth2 || !req.session.oauth2.access_token) {
    return res.redirect(authorizationUri);
  }
  var token = oauth2.AccessToken.create(req.session.oauth2);
  console.log('is token expired?', token.expired());
  if (token.expired()) {
    return token.refresh(function(err, result) {
      if (err) return next(err);
      req.session.oauth2 = result;
      render();
    });
  }
  render();

  function render() {
    res.render('app.html', {
      accessToken: req.session.oauth2.access_token
    });
  };
});

/*
app.get('/api/*', function(req, res, next) {
  if (req.session && req.session.isLoggedIn) return next();
  res.status(400).send({error: 'Auth required'});
});*/

module.exports = app;
