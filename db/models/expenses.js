var _ = require('underscore'),
    Promise = require('bluebird'),
    moment = require('moment');

module.exports = function(Bookshelf) {

  Bookshelf.models.Supplier = Bookshelf.Model.extend({
    tableName: 'suppliers',
    hasTimestamps: ['created_at', 'updated_at']
  });

  Bookshelf.models.Expense = Bookshelf.Model.extend({
    tableName: 'expenses',
    hasTimestamps: ['created_at', 'updated_at'],
    supplier: function() {
      return this.belongsTo(Bookshelf.models.Supplier);
    },
    attachments: function() {
      return this.hasMany(Bookshelf.models.ExpenseAttachment);
    },
    decorate: function() {
      return _.extend(this.toJSON(), {due_date: moment(this.get('due_date')).format('YYYY-MM-DD'), expense_date: moment(this.get('expense_date')).format('YYYY-MM-DD')});
    }
  }, {
    createWithSupplierAndAttachments: function(expenseData, supplierData, attachments) {
      var self = this;
      //First find a supplier or create on
      return Bookshelf.models.Supplier.forge({
        business_id: supplierData.business_id,
        environment_id: supplierData.environment_id
      }).fetch().then(function(supplier) {
        if (supplier) return supplier.save(supplierData); //Always update info
        return Bookshelf.models.Supplier.forge(supplierData).save();
      }).then(function(supplier) {
        return self.forge(_.extend({supplier_id: supplier.id}, expenseData)).save()
      }).then(function(expense) {
        return Promise.all(attachments.map(function(att) {
          return Bookshelf.models.ExpenseAttachment.forge(_.extend({expense_id: expense.id}, att)).save();
        })).return(expense);
      });
    }
  });

  Bookshelf.models.ExpenseAttachment = Bookshelf.Model.extend({
    tableName: 'expense_attachments',
    hasTimestamps: ['created_at', 'updated_at']
  });
};
