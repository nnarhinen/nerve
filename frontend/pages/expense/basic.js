/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../../locale/%s/LC_MESSAGES/messages.po'),
    SupplierInput = require('../../components/supplier-input'),
    InboundInvoiceActions = require('../../actions/inbound-invoice-actions');

module.exports = React.createClass({
  onSupplierChanged: function(supplier) {
    InboundInvoiceActions.updateOne(_.extend({}, this.props.expense, {supplier: supplier}));
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="fe-expense-supplier">{ i18n.gettext('Supplier') }</label>
            <SupplierInput value={this.props.expense.supplier} onSupplierChange={this.onSupplierChanged} />
          </div>
        </div>
      </div>
      );
  }
});

