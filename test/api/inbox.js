if (process.env.NODE_ENV !== 'test') throw new Error('Tests are only allowed to run in the `test` environment');

var request = require('supertest'),
    app = require('../../src/backend/app'),
    knex = require('knex'),
    Bookshelf = require('../../src/backend/db/bookshelf'),
    envId = null,
    to = null,
    fs = require('fs'),
    sinon = require('sinon'),
    Promise = require('bluebird');

require('should');

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

  it('should add title, receiver, sender, text body and html body to db', function(done) {
    request(app)
      .post('/callbacks/mailgun?envId=' + to)
      .send('attachment-count=1')
      .send('subject=TestMail')
      .send('from=Test%20Sender%20<test@test.com>')
      .send('sender=test@test.com')
      .send('recipient=in+' + to + '@melli.fi')
      .send('body-plain=Asdfsadfa')
      .send('body-html=<div>Asdfsadfa</div>')
      .expect(200, function(err) {
        if (err) return done(err);
        app.get('bookshelf').models.InboxItem.fetchAll().then(function(col) {
          col.length.should.equal(1);
          var model = col.first();
          model.get('subject').should.equal('TestMail');
          model.get('from').should.equal('Test Sender <test@test.com>');
          model.get('sender').should.equal('test@test.com');
          model.get('body_plain').should.equal('Asdfsadfa');
          model.get('body_html').should.equal('<div>Asdfsadfa</div>');
          done();
        }).catch(done);
      });
  });
  it('should save attachments to s3 and add to db', function(done) {
    var s3Mock = sinon.mock(app.get('s3'));
    s3Mock.expects('putObjectAsync').once().returns(Promise.resolve());
    request(app)
      .post('/callbacks/mailgun?envId=' + to)
      .field('attachment-count', '1')
      .field('subject', 'TestMail')
      .field('from', 'Test%20Sender%20<test@test.com>')
      .field('sender', 'test@test.com')
      .field('recipient', 'in+' + to + '@melli.fi')
      .field('body-plain', 'Asdfsadfa')
      .field('body-html', '<div>Asdfsadfa</div>')
      .attach('attachment-1', 'test/assets/example.pdf')
      .end(function(err, res) {
        if (err) return done(err);
        res.status.should.equal(200, res.text);
        app.get('bookshelf').models.InboxItem.forge({id: JSON.parse(res.text).id}).fetch({withRelated: ['attachments']}).then(function(model) {
          s3Mock.verify();
          model.related('attachments').length.should.equal(1);
          var att = model.related('attachments').first();
          att.get('filename').should.equal('example.pdf');
          att.get('mime_type').should.equal('application/pdf');
          done();
        }).catch(done);
      });
  });
    

});
