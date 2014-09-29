var moment = require('moment');

module.exports = {
  pending: function(req,res,next) {
    req.maventaClient().then(function(maventa) {
      return maventa.invoiceListInboundBetweenDates(moment().add(-3, 'months').toDate(), new Date()).then(function(resp) {
        res.send(resp);
      }).catch(function(err) {
        if (err.message === 'ERROR: NO INVOICES') {
          return res.send([]);
        }
        throw err;
      });
    }).catch(next);
  }
};
