/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../locale/%s/LC_MESSAGES/messages.po'),
    InboundInvoiceActions = require('../actions/inbound-invoice-actions'),
    Flux = require('delorean.js').Flux,
    ReactRouter = require('react-router'),
    moment = require('moment'),
    MenuItem = require('../components/menu-item');

module.exports = React.createClass({
  mixins: [Flux.mixins.storeListener],
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
                {this.getStore('inboundInvoices').loading ? <i className="fa fa-spin fa-spinner"></i> :
                <table className="table">
                  <thead>
                    <tr>
                      <th>{ i18n.gettext('Supplier') }</th>
                      <th>{ i18n.gettext('Sum') }</th>
                      <th>{ i18n.gettext('Due') }</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.getStore('inboundInvoices').pending.map(function(inv) {
                      return (
                        <tr key={inv.id}>
                          <td>{ inv.supplier.name }</td>
                          <td>{ inv.sum }</td>
                          <td> { moment(inv.due_date).format('DD.MM.YYYY') }</td>
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

