/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../locale/%s/LC_MESSAGES/messages.po'),
    InboundInvoiceActions = require('../actions/inbound-invoice-actions'),
    MenuItem = require('../components/menu-item'),
    _ = require('underscore');


module.exports = React.createClass({
  componentDidMount: function() {
    InboundInvoiceActions.refreshOne(this.props.params.id);
  },
  render: function() {
    var id = Number(this.props.params.id),
        finder = function(one) { return one.id === id; },
        expense = _.find(this.props.expenses.pending, finder) || _.find(this.props.expenses.invoices, finder),
        routeParams = _.pick(expense, 'id');
    return expense ? (
      <div>
        <h1>{ i18n.gettext('Expense') } <small>{ expense.supplier.name }</small></h1>
        <ul className="nav nav-tabs">
          <MenuItem to="expense-info" params={routeParams}>Basic information</MenuItem>
          <MenuItem to="expense-attachments" params={routeParams}>Attachments</MenuItem>
        </ul>
        <this.props.activeRouteHandler expense={expense} />
      </div>
      ) : <i className="fa fa-spin fa-spinner"></i>;
  }
});

