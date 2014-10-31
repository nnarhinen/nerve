if (process.env.NODE_ENV === 'production') {
  require('newrelic');
}

var app = require('./app');

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});
