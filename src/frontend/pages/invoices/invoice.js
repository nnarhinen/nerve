'use strict';
var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    InvoiceActions = require('frontend/actions/invoice-actions'),
    State = require('react-router').State,
    RouteHandler = require('react-router').RouteHandler,
    _ = require('underscore');

module.exports = React.createClass({
  mixins: [State], 
  componentDidMount: function() {
    InvoiceActions.refreshOne(this.getParams().id);
  },
  render: function() {
    if (this.props.invoices.loading) return <i className="fa fa-spin fa-spinner"></i>;
    var id = Number(this.getParams().id),
        finder = function(one) { return one.id === id; },
        invoice = _.find(this.props.invoices.invoices, finder);
    if (!invoice) return <div>{ i18n.gettext('Invoice not found') }</div>;

    return (
      <div>
        <h1>{i18n.gettext('Invoice')} <small>{ invoice.invoice_number }</small></h1>
        <RouteHandler {..._.extend({}, this.props, {invoice: invoice})} />
      </div>
    );

  }
});

