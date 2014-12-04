'use strict';
var SettingsSchema = require('shared/schemas/settings'),
    Validator = require('jsonschema').Validator,
    v = new Validator(),
    _ = require('underscore');

//GET /api/settings
var fetch = function(req, res, next) {
  req.getEnvironmentSettings().then(function(sett) {
    res.send(_.extend({
      bankson_enabled: !!req.user.get('bankson_auth_token')
    }, sett.toJSON()));
  }).catch(next);
};

//PUT /api/settings
var update = function(req, res, next) {
  var report = v.validate(req.body, SettingsSchema);
  if (!report.valid) return res.status(400).end();
  req.getEnvironmentSettings(req.body).then(function(sett) {
    return sett.save(_.pick(req.body, Object.keys(SettingsSchema.properties))).then(function(sett) {
      res.send(sett.toJSON());
    });
  }).catch(next);
};


module.exports.fetch = fetch;
module.exports.update = update;
