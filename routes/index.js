var expenses = require('./expenses');

module.exports = function(app) {
  app.get('/api/expenses/pending', expenses.pending); 
};
