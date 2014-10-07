/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../locale/%s/LC_MESSAGES/messages.po'),
    InboundInvoiceActions = require('../actions/inbound-invoice-actions'),
    ReactRouter = require('react-router'),
    moment = require('moment'),
    MenuItem = require('../components/menu-item'),
    Link = ReactRouter.Link;

module.exports = React.createClass({
  componentDidMount: function() {
    InboundInvoiceActions.fetchPending();
  },
  render: function() {
    return (
      <div>
        <h1>{ i18n.gettext('Expenses') }</h1>
        <ul className="nav nav-pills pull-right">
          <MenuItem to="expenses-pending">Pending</MenuItem>
          <MenuItem to="expenses-history">History</MenuItem>
        </ul>
        {this.props.expenses.loading ? <i className="fa fa-spin fa-spinner"></i> :
        <table className="table">
          <thead>
            <tr>
              <th>{ i18n.gettext('Supplier') }</th>
              <th>{ i18n.gettext('Sum') }</th>
              <th>{ i18n.gettext('Due') }</th>
            </tr>
          </thead>
          <tbody>
            {this.props.expenses.pending.map(function(inv) {
              return (
                <tr key={inv.id}>
                  <td><Link to="expense" params={inv}>{ inv.supplier.name }</Link></td>
                  <td>{ inv.sum }</td>
                  <td>{ moment(inv.due_date).format('DD.MM.YYYY') }</td>
                </tr>
                );
            }) }
          </tbody>
        </table>
        }
      </div>
      );
    }
});

