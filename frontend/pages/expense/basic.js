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
    common = require('../../common'),
    expenseSchema = require('../../../schemas/expense'),
    validator = require('../../../schemas/validator');


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
    //InboundInvoiceActions.updateOne(_.extend({}, this.props.expense, {supplier: supplier}));
    this.onPropertyChanged({
      supplier_id: supplier.id,
      supplier: supplier
    });
  },
  getInitialState: function() {
    return {
      expense: this.props.expense,
      validationErrors: {}
    }
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({
      expense: newProps.expense
    });
  },
  onFormSubmit: function(ev) {
    ev.preventDefault();
  },
  transformObject: function(o) {
    if (/\.$/.exec(o.sum) || isNaN(Number(o.sum))) return o; // Let flow to validator
    return _.extend({}, o, {sum: Number(o.sum)});
  },
  onPropertyChanged: function(property, newValue) {
    var newObject = _.extend({}, this.props.expense, _.isObject(property) ? property : _.object([[property, newValue]]));
    newObject = this.transformObject(newObject);
    this.setState({ // Modify only locally
      expense: newObject,
      validationErrors: {} // Be optimistic
    });
    var validationReport = validator.validate(newObject, expenseSchema);
    if (!validationReport.errors.length) return InboundInvoiceActions.updateOne(newObject);
    var validationErrors = _.chain(validationReport.errors)
                                .map(function(e) {
                                  var pr = e.property.split('.')[1]; //FIXME this is not a generic solutions
                                  return [pr, e.message];
                                })
                                .object().value();
    this.setState({
      validationErrors: validationErrors
    });
  },
  validationState: function(property) {
    if (this.state.validationErrors[property]) return 'error';
    return 'default';
  },
  validationMessage: function(property) {
    return this.state.validationErrors[property];
  },
  onIBANChange: function(ev) {
    this.onPropertyChanged('iban', ev.target.value.toUpperCase().replace(/ /g, ''));
  },
  onReferenceNumberChange: function(ev) {
    this.onPropertyChanged('reference_number', ev.target.value.replace(/ /g, ''));
  },
  expenseDateChanged: function(m) {
    this.onPropertyChanged('expense_date', m.format('YYYY-MM-DD'));
  },
  dueDateChanged: function(m) {
    this.onPropertyChanged('due_date', m.format('YYYY-MM-DD'));
  },
  onNumericInputChange: function(ev) {
    this.onPropertyChanged(ev.target.name, ev.target.value.replace(',', '.'));
  },
  onUppercaseInputChange: function(ev) {
    this.onPropertyChanged(ev.target.name, ev.target.value.toUpperCase());
  },

  render: function() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="fe-expense-supplier">{ i18n.gettext('Supplier') }</label>
              <SupplierInput suppliers={this.props.suppliers} value={this.state.expense.supplier} onSupplierChange={this.onSupplierChanged} />
            </div>
          </div>
          <div className="col-md-3">
            <Input bsStyle={this.validationState('sum')} hasFeedback help={this.validationMessage('sum')} onChange={this.onNumericInputChange} name="sum" label={ i18n.gettext('Sum') } value={this.state.expense.sum} type="text" />
          </div>
          <div className="col-md-3">
            <DatePickerInput onChange={this.expenseDateChanged} label={ i18n.gettext('Invoice date') } value={this.state.expense.expense_date} type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Input bsStyle={this.validationState('iban')} hasFeedback help={this.validationMessage('iban')} onChange={this.onIBANChange} label={ i18n.gettext('IBAN') } value={formatIban(this.state.expense.iban)} type="text" />
          </div>
          <div className="col-md-3">
            <Input bsStyle={this.validationState('bic')} hasFeedback help={this.validationMessage('bic')} onChange={this.onUppercaseInputChange} name="bic" label={ i18n.gettext('BIC') } value={this.state.expense.bic} type="text" />
          </div>
          <div className="col-md-3">
            <DatePickerInput onChange={this.dueDateChanged} label={ i18n.gettext('Due date') } value={this.state.expense.due_date} type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Input bsStyle={this.validationState('reference_number')} hasFeedback help={this.validationMessage('reference_number')} onChange={this.onReferenceNumberChange} label={ i18n.gettext('Reference number') } value={formatReferenceNumber(this.state.expense.reference_number)} type="text" />
          </div>
        </div>
      </form>
      );
  }
});

