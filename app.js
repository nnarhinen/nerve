var express = require('express'),
    app = express(),
    nunjucks = require('nunjucks'),
    i18n = require('i18n-abide');

var languages = ['en', 'fi'];

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(i18n.abide({
  supported_languages: languages,
  default_lang: 'en',
  debug_lang: 'en',
  translation_directory: 'i18n'
}));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/app/*', function(req, res) {
  res.render('app.html');
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});
