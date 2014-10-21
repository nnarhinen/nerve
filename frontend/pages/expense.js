/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../locale/%s/LC_MESSAGES/messages.po'),
    InboundInvoiceActions = require('../actions/inbound-invoice-actions'),
    MenuItem = require('../components/menu-item'),
    Label = require('react-bootstrap/Label'),
    _ = require('underscore'),
    moment = require('moment'),
    OverlayTrigger = require('react-bootstrap/OverlayTrigger'),
    Tooltip = require('react-bootstrap/Tooltip');

var formatDt = function(dt) {
  return moment(dt).format('DD.MM.YYYY HH:mm:ss');
};

module.exports = React.createClass({
  componentDidMount: function() {
    InboundInvoiceActions.refreshOne(this.props.params.id);
  },
  isOverdue: function(expense) {
    return moment(expense.due_date).isBefore(moment(), 'date');
  },
  renderStatus: function(expense) {
    if (!expense) return '';
    if (expense.status === 'unpaid' && this.isOverdue(expense)) {
      return <Label bsStyle="danger"> { i18n.gettext('Overdue') }</Label>;
    }
    if (expense.status === 'unpaid') {
      return <Label bsStyle="warning">{ i18n.gettext('Unpaid') }</Label>;
    }
    return <OverlayTrigger overlay={<Tooltip>{formatDt(expense.payment_date)}</Tooltip>}><Label bsStyle="success">{ i18n.gettext('Paid') }</Label></OverlayTrigger>;
  },
  render: function() {
    var id = Number(this.props.params.id),
        finder = function(one) { return one.id === id; },
        expense = _.find(this.props.expenses.pending, finder) || _.find(this.props.expenses.invoices, finder),
        routeParams = _.pick(expense, 'id');
    return expense ? (
      <div>
        <h1>{ i18n.gettext('Expense') } <small>{ expense.supplier.name } {this.renderStatus(expense)}</small></h1>
        <ul className="nav nav-tabs">
          <MenuItem to="expense-info" params={routeParams}>Basic information</MenuItem>
          <MenuItem to="expense-attachments" params={routeParams}>Attachments <Label bsStyle="default">{expense.attachments.length}</Label></MenuItem>
        </ul>
        <this.props.activeRouteHandler suppliers={this.props.suppliers} expense={expense} />
      </div>
      ) : <i className="fa fa-spin fa-spinner"></i>;
  }
});

