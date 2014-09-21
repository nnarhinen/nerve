var moment = require('moment');

module.exports = {
  pending: function(req,res,next) {
    var maventa = req.app.get('maventa');
    maventa.invoiceListInboundBetweenDates(moment().add(-3, 'months').toDate(), new Date()).then(function(resp) {
      res.send(resp);
    }).fail(next);
  }
};
