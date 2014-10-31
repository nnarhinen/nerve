/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    OverlayTrigger = require('react-bootstrap/OverlayTrigger'),
    Tooltip = require('react-bootstrap/Tooltip'),
    InvoiceActions = require('frontend/actions/invoice-actions'),
    common = require('frontend/common');
module.exports = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
    InvoiceActions.fetch();
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
          {this.props.invoices.pending.map(function(inv) {
            return (
              <tr key={inv.id} className={trClass(inv)}>
                <td><Link to="invoice" params={inv}>{ inv.customer ? inv.customer.name : i18n.gettext('(No customer)') }</Link></td>
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

