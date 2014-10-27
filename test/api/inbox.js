if (process.env.NODE_ENV !== 'test') throw new Error('Tests are only allowed to run in the `test` environment');

var request = require('supertest'),
    app = require('../../src/backend/app'),
    knex = require('knex'),
    Bookshelf = require('../../src/backend/db/bookshelf'),
    envId = null,
    to = null,
    fs = require('fs');

function insertEnvironment(done) {
  //First run migrations
  Bookshelf.knex.migrate.latest().then(function() {
    return Bookshelf.models.Environment.forge({name: 'Test-env'}).save().then(function(env) {
      envId = env.id;
      to = env.getToken();
    });
  }).then(function() { done(); }).catch(done);
}

function removeDatabase(done) {
  fs.unlink(__dirname + '/../../test.sqlite', done);
}



describe('/callbacks/mailgun', function() {
  before(insertEnvironment);
  after(removeDatabase);
  it('should only accept POST requests', function(done) {
    request(app)
      .get('/callbacks/mailgun?envId=' + to)
      .expect(405, done);
  });

  it('should only accept multipart/form-data or application/x-www-form-urlencoded', function(done) {
    request(app)
      .post('/callbacks/mailgun?envId=' + to)
      .set('Content-Type', 'application/json')
      .expect(406, done); // Mailgun expects to have 406 for rejected
  });

  it('should reject mail with no attachments', function(done) {
    //At this point I don't want to turn this into a mailing board or such
    request(app)
      .post('/callbacks/mailgun?envId=' + to)
      .send('attachment-count=0')
      .expect(406, done);
  });

  it('should reject mail for environments not known', function(done) {
    request(app)
    .post('/callbacks/mailgun?envId=asdf')
    .send('attachment-count=1')
    .expect(406, done);
  });

});
