/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    InvoiceActions = require('frontend/actions/invoice-actions'),
    _ = require('underscore');

module.exports = React.createClass({
  componentDidMount: function() {
    InvoiceActions.refreshOne(this.props.params.id);
  },
  render: function() {
    if (this.props.invoices.loading) return <i className="fa fa-spin fa-spinner"></i>;
    var id = Number(this.props.params.id),
        finder = function(one) { return one.id === id; },
        invoice = _.find(this.props.invoices.invoices, finder);
    if (!invoice) return <div>{ i18n.gettext('Invoice not found') }</div>

    return (
      <div>
        <h1>{i18n.gettext('Invoice')} <small>{ invoice.invoice_number }</small></h1>
        { this.props.activeRouteHandler(_.extend({}, this.props, {invoice: invoice})) }
      </div>
    );

  }
});

