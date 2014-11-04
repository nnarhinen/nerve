//Load env
require('./env');

var express = require('express'),
    app = express(),
    nunjucks = require('nunjucks'),
    i18n = require('i18n-abide'),
    nib = require('nib'),
    jedify = require('jedify'),
    bookshelf = require('./db/bookshelf'),
    session = require('express-session'),
    BookshelfStore = require('connect-bookshelf')(session),
    path = require('path'),
    _ = require('underscore'),
    AWS = require('aws-sdk'),
    Promise = require('bluebird'),
    util = require('util'),
    compression = require('compression'),
    debug = require('debug')('nerve:app');

AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'dummy';
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || 'dummy';
AWS.config.region = process.env.AWS_REGION || 'eu-west-1';

var s3 = Promise.promisifyAll(new AWS.S3());

var languages = ['en', 'fi'];

app.locals.sprintf = function() {
  return util.format.apply(util, arguments);
};


nunjucks.configure(__dirname + '/views', {
  autoescape: true,
  express: app
});

app.set('bookshelf', bookshelf);
app.set('s3', s3);

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

app.use(compression());

app.use('/static', express.static(path.join(__dirname, 'public')));

(process.env.PRE_MIDDLEWARE || '').split(',').forEach(function(moduleName) {
  if (!moduleName) return;
  app.use(require(moduleName));
});

app.get('/', function(req, res) {
  res.render('index.html');
});

var send405 = function(req, res) { res.status(405).send('Method not allowed'); };

app.route('/callbacks/mailgun').post(require('connect-busboy')(), function(req, res, next) {
  debug('starting mailgun callback, req.type: %s, environment: %s', req.get('Content-Type'), req.query.envId);
  if (!req.is(['multipart/*', 'application/x-www-form-urlencoded'])) return res.status(406).end();
  if (!req.query.envId) return res.status(406).end();
  app.get('bookshelf').models.Environment.fromToken(req.query.envId).fetch().then(function(env) {
    debug('mailgun: resolved env to %s', env ? env.get('name') : 'undefined');
    if (!env) return res.status(406).end();
    var fieldData = {}, files = [];
    req.busboy.on('field', function(fieldName, fieldValue) {
      fieldData[fieldName] = fieldValue;
    });
    req.busboy.on('file', function(key, file, fileName, encoding, mimeType) {
      var bufs = [];
      file.on('data', function(part) {
        bufs.push(part);
      });
      file.on('end', function() {
        files.push({
          fileName: fileName,
          buffer: Buffer.concat(bufs),
          mimeType: mimeType
        });
      });
    });
    req.busboy.on('finish', function() {
      debug('mailgun:finish: data: %s', JSON.stringify(fieldData));
      if (!Number(fieldData['attachment-count'])) return res.status(406).end();
      app.get('bookshelf').models.InboxItem.forge({
        environment_id: env.id,
        sender: fieldData.sender,
        from: fieldData.from,
        body_plain: fieldData['body-plain'],
        body_html: fieldData['body-html'],
        subject: fieldData.subject
      }).save().then(function(model) {
        return Promise.all(files.map(function(f) {
          var fileName = f.fileName, buf = f.buffer, mimeType = f.mimeType,
              s3Path = env.id + '/inbox/' + model.id + '/' + fileName.replace(/[^\x00-\x7F]/g, '');
          debug('mailgun: will put to s3 with key %s', s3Path);
          return s3.putObjectAsync({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: s3Path,
            Body: buf,
            ContentLength: buf.length,
            ContentType: mimeType
          }).then(function() {
            return model.attachments().create({
              s3path: s3Path,
              filename: fileName,
              environment_id: env.id,
              inbox_item_id: model.id,
              mime_type: mimeType
            });
          });
        })).then(function(atts) {
          res.send(model.toJSON());
        });
      }).catch(next);
    });
    req.pipe(req.busboy);
  }).catch(next);
}).all(send405);



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

app.get('/callbacks/nerve', function(req, res, next) {
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
  if (!req.session.passwordless) return next();
  app.get('bookshelf').models.User.forge({id: req.session.passwordless}).fetch({withRelated: ['environment']}).then(function(model) {
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
      user: req.user && JSON.stringify(_.omit(req.user.toJSON(), 'password_hash')),
      newRelicAppId: process.env.NEW_RELIC_BROWSER_APPLICATION_ID,
      newRelicLicenseKey: process.env.NEW_RELIC_BROWSER_APPLICATION_LICENSE_KEY
    });
  }
});

/*
app.get('/api/*', function(req, res, next) {
  if (req.session && req.session.isLoggedIn) return next();
  res.status(400).send({error: 'Auth required'});
});*/

module.exports = app;
