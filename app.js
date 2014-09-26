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
    BookshelfStore = require('connect-bookshelf')(session);


var envFile = path.join(__dirname, 'development.env');
if (fs.existsSync(envFile)) {
  env(envFile);
}

var languages = ['en', 'fi'];

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

app.use(session({
  store: new BookshelfStore({model: bookshelf.models.Session}),
  secret: 'asdei32fa',
  resave: true,
  saveUninitialized: false
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
  app.get('/js/application.' + lang + '.js', browserify('./frontend/index.' + lang + '.js', {transform: ['reactify', jedifyWithLang(lang)], 'jedify-lang': lang}));
});
app.get('/js/login.js', browserify('./frontend/login.js'));

app.use(stylus.middleware({src: __dirname + '/public', compile: compileStylus}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/oauth2'));
app.use('/api', require('./routes/api'));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/app/*', function(req, res) {
  res.render('app.html');
});

/*
app.get('/api/*', function(req, res, next) {
  if (req.session && req.session.isLoggedIn) return next();
  res.status(400).send({error: 'Auth required'});
});*/


var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});
