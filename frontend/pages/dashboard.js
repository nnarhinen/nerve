/**
 * @jsx React.DOM
 */

var React = require('react'),
    Flux = require('delorean.js').Flux,
    i18n = requirePo('../../locale/%s/LC_MESSAGES/messages.po'),
    InboundInvoiceActions = require('../actions/inbound-invoice-actions'),
    moment = require('moment'),
    Link = require('react-router').Link;

module.exports = React.createClass({
  mixins: [Flux.mixins.storeListener],
  componentWillMount: function() {
    InboundInvoiceActions.fetchPending();
  },
  render: function() {
            return (
              <div className="container-fluid">
                <h1>{ i18n.gettext('Dashboard') }</h1>
                <div className="row">
                  <div className="col-md-7">What</div>
                  <div className="col-md-5">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">{ i18n.gettext('Pending invoices') } <small><Link to="expenses">{ i18n.gettext('show all') }</Link></small></h4>
                      </div>
                      {this.getStore('inboundInvoices').loading ?
                        <div className="panel-body"><i className="fa fa-spin fa-circle-o-notch"></i></div> :
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
                                <tr>
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
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">{ i18n.gettext('E-Mail inbox') }</h4>
                      </div>
                      <div className="panel-body">
                        <i className="fa fa-spin fa-circle-o-notch"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
          }
});

