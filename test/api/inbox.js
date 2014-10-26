var request = require('supertest'),
    app = require('../../src/backend/app');

describe('/callbacks/mailgun', function() {
  it('should only accept POST requests', function(done) {
    var counter = 0,
        cb = function() { counter++; if (counter === 2) done(); };
    request(app)
      .get('/callbacks/mailgun')
      .expect(405, cb);
    request(app)
      .post('/callbacks/mailgun')
      .expect(200, cb);
  });
});
