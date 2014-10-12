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
            <DatePickerInput onChange={this.expenseDateChanged} label={ i18n.gettext('Invoice date') } value={this.props.expense.expense_date} type="text" />
          </div>
          <div className="col-md-3">
            <DatePickerInput onChange={this.dueDateChanged} label={ i18n.gettext('Due date') } value={dueDate.toString('DD.MM.YYYY')} type="text" />
          </div>
        </div>
        <div className="row">
        </div>
      </form>
      );
  }
});

