/**
 * @jsx React.DOM
 */
'use strict';
var React = require('react'),
    ReactRouter = require('react-router'),
    Navigation = ReactRouter.Navigation,
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    InboundInvoiceActions = require('../actions/inbound-invoice-actions'),
    ReactRouter = require('react-router'),
    moment = require('moment'),
    MenuItem = require('../components/menu-item'),
    Link = ReactRouter.Link,
    OverlayTrigger = require('react-bootstrap/OverlayTrigger'),
    Tooltip = require('react-bootstrap/Tooltip'),
    FilePrompt = require('react-fileprompt'),
    BasicExpense = require('./expense/basic'),
    common = require('../common'),
    PDF = require('react-pdf');

var isOverdue = function(expense) {
  return moment(expense.due_date).isBefore(moment(), 'date');
};

var trClass = function(expense) {
  if (expense.status === 'unpaid' && isOverdue(expense)) return 'danger';
};

module.exports = React.createClass({
  mixins: [Navigation],
  componentDidMount: function() {
    InboundInvoiceActions.fetchPending();
  },
  getInitialState: function() {
    return {};
  },
  onFilesSelected: function(files) {
    var reader = new FileReader(),
        self = this;
    reader.onload = function(e) {
      self.setState({
        file: new Uint8Array(e.target.result),
        actualFile: files[0]
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
    this.setState({
      addingNew: true
    });
    var files = {};
    var dataView = new DataView(this.state.file.buffer);
    files[this.state.actualFile.name] = new Blob([dataView], {type: 'application/pdf'});
    InboundInvoiceActions.createNew(exp, files).then(function(newExp) {
      this.setState({
        file: null,
        addingNew: false
      });
      this.transitionTo('expense', {id: newExp.id});
    }.bind(this)).catch(function() {
      alert('Failed to create expense');
      this.setState({
        addingNew: false
      });
    }.bind(this));
  },
  render: function() {
    if (this.state.file) {
      return (
        <div>
          <BasicExpense confirmSave saving={this.state.addingNew} onCancel={this.onNewExpenseCanceled} onSave={this.onNewExpenseSaved} expense={{expense_type: 'invoice', status: 'unpaid'}} suppliers={this.props.suppliers} />
          <PDF file={this.state.file} />
        </div>
        );
    }
    var iconClass = 'fa fa-plus';
    if (this.state.hilightAddIcon) iconClass += ' hilighted';
    return (
      <div>
        <div className="row">
          <div className="col-md-8">
            <h1>
              { i18n.gettext('Expenses') } <small>
                <OverlayTrigger placement="right" overlay={<Tooltip>{i18n.gettext('Add new expense')}</Tooltip>}>
                  <FilePrompt onFilesSelected={this.onFilesSelected}>
                    <a href="#">
                      <i className={iconClass}></i>
                    </a>
                  </FilePrompt>
                </OverlayTrigger>
              </small>
            </h1>
          </div>
          <div className="col-md-4">
            <ul className="nav nav-pills pull-right">
              <MenuItem to="expenses-pending">Pending</MenuItem>
              <MenuItem to="expenses-history">History</MenuItem>
            </ul>
          </div>
        </div>
        {this.renderList()}
      </div> );
  },
  hilightPlusIcon: function() {
    this.setState({
      hilightAddIcon: true
    });
    setTimeout(function() {
      this.setState({
        hilightAddIcon: false
      });
    }.bind(this), 1000);
  },
  renderList: function() {
    if (this.props.expenses.loading) return <i className="fa fa-spin fa-spinner"></i>;
    if (!this.props.expenses.pending.length) return (
      <div className="row clearfix">
        <div className="col-md-12">
          <div className="well">
            <h2>{ i18n.gettext('Yay, no pending expenses!') }</h2>
            <p>{ i18n.gettext('You can use the ') } <a href="#" onMouseEnter={this.hilightPlusIcon} onClick={common.preventDefault}><i className="fa fa-plus"></i></a> { i18n.gettext('-icon at the top of this page to record new ones.') }</p>
          </div>
        </div>
      </div>
    );
    return (
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
      );
    }
});

