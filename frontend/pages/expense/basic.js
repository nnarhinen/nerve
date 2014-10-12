/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../../locale/%s/LC_MESSAGES/messages.po'),
    SupplierInput = require('../../components/supplier-input'),
    InboundInvoiceActions = require('../../actions/inbound-invoice-actions'),
    Input = require('react-bootstrap/Input'),
    OverlayTrigger = require('react-bootstrap/OverlayTrigger'),
    Popover = require('react-bootstrap/Popover'),
    Calendar = require('react-bootstrap-calendar').Calendar,
    moment = require('moment'),
    common = require('../../common');


var DatePickerInput = React.createClass({
  getInitialState: function() {
    return {
      value: moment(this.props.value),
      dateFormat: this.props.dateFormat || 'YYYY-MM-DD'
    };
  },
  daySelected: function(m) {
    this.setState({
      value: m
    });
    this.props.onChange && this.props.onChange(m);
  },
  render: function() {
    return (
      <OverlayTrigger trigger="click" placement="bottom" overlay={<Popover><Calendar onDaySelected={this.daySelected} selectedDate={this.state.value} /></Popover>}>
        <Input type="text" onChange={common.noop} name={this.props.name} value={this.state.value.format(this.state.dateFormat)} label={this.props.label} />
      </OverlayTrigger>
      );
  }
});

var formatIban = function(str) {
  str = str || '';
  return str.match(/.{1,4}/g).join(' ');
};

var formatReferenceNumber = function(str) {
  str = str || '';
  return str.replace(/^0+/, '').split('').reverse().join('').match(/.{1,5}/g).map(function(p) { return p.split('').reverse().join(''); }).reverse().join(' ');
};


module.exports = React.createClass({
  onSupplierChanged: function(supplier) {
    InboundInvoiceActions.updateOne(_.extend({}, this.props.expense, {supplier: supplier}));
  },
  onFormSubmit: function(ev) {
    ev.preventDefault();
  },
  render: function() {
    var dueDate = moment(this.props.expense.due_date);
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="fe-expense-supplier">{ i18n.gettext('Supplier') }</label>
              <SupplierInput suppliers={this.props.suppliers} value={this.props.expense.supplier} onSupplierChange={this.onSupplierChanged} />
            </div>
          </div>
          <div className="col-md-3">
            <Input label={ i18n.gettext('Sum') } value={this.props.expense.sum} type="text" />
          </div>
          <div className="col-md-3">
            <DatePickerInput onChange={this.expenseDateChanged} label={ i18n.gettext('Invoice date') } value={this.props.expense.expense_date} type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Input label={ i18n.gettext('IBAN') } value={formatIban(this.props.expense.iban)} type="text" />
          </div>
          <div className="col-md-3">
            <Input label={ i18n.gettext('BIC') } value={this.props.expense.bic} type="text" />
          </div>
          <div className="col-md-3">
            <DatePickerInput onChange={this.dueDateChanged} label={ i18n.gettext('Due date') } value={dueDate.toString('DD.MM.YYYY')} type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Input label={ i18n.gettext('Reference number') } value={formatReferenceNumber(this.props.expense.reference_number)} type="text" />
          </div>
        </div>
      </form>
      );
  }
});

