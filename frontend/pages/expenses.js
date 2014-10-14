/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../locale/%s/LC_MESSAGES/messages.po'),
    InboundInvoiceActions = require('../actions/inbound-invoice-actions'),
    ReactRouter = require('react-router'),
    moment = require('moment'),
    MenuItem = require('../components/menu-item'),
    Link = ReactRouter.Link,
    OverlayTrigger = require('react-bootstrap/OverlayTrigger'),
    Tooltip = require('react-bootstrap/Tooltip'),
    FilePrompt = require('react-fileprompt'),
    BasicExpense = require('./expense/basic'),
    PDF = require('react-pdf');

var isOverdue = function(expense) {
  return moment(expense.due_date).isBefore(moment(), 'date');
};

var trClass = function(expense) {
  if (expense.status === 'unpaid' && isOverdue(expense)) return 'danger';
  if (expense.status === 'unpaid') return 'warning';
}

module.exports = React.createClass({
  componentDidMount: function() {
    InboundInvoiceActions.fetchPending();
  },
  getInitialState: function() {
    return {}
  },
  onFilesSelected: function(files) {
    var reader = new FileReader(),
        self = this;
    reader.onload = function(e) {
      self.setState({
        file: new Uint8Array(e.target.result)
      });
    };
    reader.readAsArrayBuffer(files[0]);
  },
  onNewExpenseCanceled: function() {
    this.setState({
      file: null
    });
  },
  onNewExpenseSaved: function(exp) {
    console.log('new expense', exp);
  },
  render: function() {
    if (this.state.file) {
      return (
        <div>
          <BasicExpense confirmSave onCancel={this.onNewExpenseCanceled} onSave={this.onNewExpenseSaved} expense={{expense_type: 'invoice'}} suppliers={this.props.suppliers} />
          <PDF file={this.state.file} />
        </div>
        );
    }
    return (
      <div>
        <h1>
          { i18n.gettext('Expenses') } <small>
            <OverlayTrigger placement="right" overlay={<Tooltip>{i18n.gettext('Add new expense')}</Tooltip>}>
              <FilePrompt onFilesSelected={this.onFilesSelected}>
                <a href="#">
                  <i className="fa fa-plus"></i>
                </a>
              </FilePrompt>
            </OverlayTrigger>
          </small>
        </h1>
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
                <tr key={inv.id} className={trClass(inv)}>
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

