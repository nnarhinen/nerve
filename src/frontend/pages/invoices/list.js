/**
 * @jsx React.DOM
 */
'use strict';
var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    ReactRouter = require('react-router'),
    Navigation = ReactRouter.Navigation,
    OverlayTrigger = require('react-bootstrap/OverlayTrigger'),
    Tooltip = require('react-bootstrap/Tooltip'),
    InvoiceActions = require('frontend/actions/invoice-actions'),
    Link = ReactRouter.Link,
    common = require('frontend/common'),
    _ = require('underscore'),
    moment = require('moment');
module.exports = React.createClass({
  getInitialState: function() {
    return {};
  },
  mixins: [Navigation],
  componentDidMount: function() {
    InvoiceActions.fetch();
  },
  createNewInvoice: function(ev) {
    ev.preventDefault();
    var newInvoice = {
      due_date: moment().add('2', 'weeks').format('YYYY-MM-DD'),
      invoice_date: moment().format('YYYY-MM-DD')
    };
    var self = this;
    InvoiceActions.createNew(newInvoice).then(function(inv) {
      self.transitionTo('invoice', {id: inv.id});
    }).catch(function() {
      alert('Unable to create invoice');
    });
  },
  render: function() {
    var iconClass = 'fa fa-plus';
    if (this.state.hilightAddIcon) iconClass += ' hilighted';
    return (
      <div>
        <div className="row">
          <div className="col-md-8">
            <h1>
              { i18n.gettext('Invoices') } <small>
                <OverlayTrigger placement="right" overlay={<Tooltip>{i18n.gettext('Create new invoice')}</Tooltip>}>
                  <a href="#" onClick={this.createNewInvoice}>
                    <i className={iconClass}></i>
                  </a>
                </OverlayTrigger>
              </small>
            </h1>
          </div>
          <div className="col-md-4">
          </div>
        </div>
        {this.renderList()}
      </div>
    );
  },
  renderList: function() {
    if (this.props.invoices.loading) return <i className="fa fa-spin fa-spinner"></i>;
    if (!this.props.invoices.invoices.length) return (
      <div className="row clearfix">
        <div className="col-md-12">
          <div className="well">
            <h2>{ i18n.gettext('No invoices yet.') }</h2>
            <p>{ i18n.gettext('Get started by clicking the ') } <a href="#" onMouseEnter={this.hilightPlusIcon} onClick={common.preventDefault}><i className="fa fa-plus"></i></a> { i18n.gettext('-icon at the top of this page to create your first invoice!') }</p>
          </div>
        </div>
      </div>
    );
    return (
      <table className="table">
        <thead>
          <tr>
            <th>{ i18n.gettext('Customer') }</th>
            <th>{ i18n.gettext('Sum') }</th>
            <th>{ i18n.gettext('Due') }</th>
          </tr>
        </thead>
        <tbody>
          {this.props.invoices.invoices.map(function(inv) {
            return (
              <tr key={inv.id}>
                <td><Link to="invoice" params={inv}>{ inv.invoice_number }</Link></td>
                <td>{ !_.isEmpty(inv.customer) ? inv.customer.name : '(' + i18n.gettext('No customer') + ')' }</td>
                <td>{ inv.sum }</td>
                <td>{ moment(inv.due_date).format('DD.MM.YYYY') }</td>
              </tr>
              );
          }) }
        </tbody>
      </table>
      );
  }
});

