/**
 * @jsx React.DOM
 */
/* global userInfo:true */
'use strict';
var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    InboundInvoiceActions = require('../actions/inbound-invoice-actions'),
    moment = require('moment'),
    Link = require('react-router').Link,
    bases = require('bases');

module.exports = React.createClass({
  componentWillMount: function() {
    InboundInvoiceActions.fetchPending();
  },
  render: function() {
            return (
              <div className="container-fluid">
                <h1>{ i18n.gettext('Dashboard') }</h1>
                <div className="row">
                  <div className="col-md-7">Something here</div>
                  <div className="col-md-5">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">{ i18n.gettext('Pending invoices') } <small><Link to="expenses">{ i18n.gettext('show all') }</Link></small></h4>
                      </div>
                      {this.props.expenses.loading ?
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
                            {this.props.expenses.pending.map(function(inv) {
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
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">{ i18n.gettext('E-Mail inbox') } <small>{ 'in+' + bases.toBase52(1000000-userInfo.environment.id) + '@melli.fi' }</small></h4>
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

