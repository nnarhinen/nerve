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
    fs = require('fs');


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

app.use(stylus.middleware({src: __dirname + '/public', compile: compileStylus}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/app/*', function(req, res) {
  res.render('app.html');
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});
