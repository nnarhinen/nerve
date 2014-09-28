var fetch = function(req, res, next) {
  req.getEnvironmentSettings().then(function(sett) {
    res.send(sett.toJSON());
  }).catch(next);
};

module.exports.fetch = fetch;
