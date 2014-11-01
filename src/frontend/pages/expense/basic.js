/**
 * @jsx React.DOM
 */
'use strict';
var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    SupplierInput = require('../../components/supplier-input'),
    InboundInvoiceActions = require('../../actions/inbound-invoice-actions'),
    Input = require('react-bootstrap/Input'),
    OverlayTrigger = require('react-bootstrap/OverlayTrigger'),
    Popover = require('react-bootstrap/Popover'),
    Label = require('react-bootstrap/Label'),
    Calendar = require('react-bootstrap-calendar').Calendar,
    moment = require('moment'),
    common = require('../../common'),
    expenseSchema = require('shared/schemas/expense'),
    validator = require('shared/schemas/validator'),
    ButtonToolbar = require('react-bootstrap/ButtonToolbar'),
    Button = require('react-bootstrap/Button'),
    FormMixin = require('../../mixins/form-mixin'),
    DatePickerInput = require('frontend/components/date-picker-input'),
    _ = require('underscore');


module.exports = React.createClass({
  mixins: [FormMixin],
  onSupplierChanged: function(supplier) {
    //InboundInvoiceActions.updateOne(_.extend({}, this.props.expense, {supplier: supplier}));
    this.onPropertyChanged({
      supplier_id: supplier.id,
      supplier: supplier,
      iban: supplier.iban,
      bic: supplier.bic
    });
  },
  getInitialState: function() {
    return {
      expense: this.props.expense,
      validationErrors: {}
    }
  },
  componentWillReceiveProps: function(newProps) {
    if (this.props.confirmSave) return; //Don't be bothered by outside world this time
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
  objectPropertyPath: 'expense',
  validationSchema: expenseSchema,
  autoSave: function() {
    return !this.props.confirmSave;
  },
  updateOne: function(newObject) {
    InboundInvoiceActions.updateOne(newObject);
  },
  expenseDateChanged: function(m) {
    this.onPropertyChanged('expense_date', m.format('YYYY-MM-DD'));
  },
  dueDateChanged: function(m) {
    this.onPropertyChanged('due_date', m.format('YYYY-MM-DD'));
  },
  saveButtonHandler: function(ev) {
    ev.preventDefault();
    this.props.onSave && this.props.onSave(this.state.expense);
  },
  cancelButtonHandler: function(ev) {
    ev.preventDefault();
    this.props.onCancel && this.props.onCancel();
  },
  setPaid: function() {
    this.onPropertyChanged({
      status: 'paid',
      payment_date: new Date()
    });
  },
  render: function() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="fe-expense-supplier">{ i18n.gettext('Supplier') }</label>
              <SupplierInput id="fe-expense-supplier" suppliers={this.props.suppliers} value={this.state.expense.supplier} onSupplierChange={this.onSupplierChanged} />
            </div>
          </div>
          <div className="col-md-3">
            <Input id="fe-expense-sum" bsStyle={this.validationState('sum')} hasFeedback help={this.validationMessage('sum')} onChange={this.onNumericInputChange} name="sum" label={ i18n.gettext('Sum') } value={this.state.expense.sum} type="text" />
          </div>
          <div className="col-md-3">
            <DatePickerInput id="fe-expense-expense-date" onChange={this.expenseDateChanged} label={ i18n.gettext('Invoice date') } value={this.state.expense.expense_date} type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Input id="fe-expense-iban" bsStyle={this.validationState('iban')} hasFeedback help={this.validationMessage('iban')} onChange={this.onIBANChange} label={ i18n.gettext('IBAN') } value={common.formatIban(this.state.expense.iban)} type="text" />
          </div>
          <div className="col-md-3">
            <Input id="fe-expense-bic" bsStyle={this.validationState('bic')} hasFeedback help={this.validationMessage('bic')} onChange={this.onUppercaseInputChange} name="bic" label={ i18n.gettext('BIC') } value={this.state.expense.bic} type="text" />
          </div>
          <div className="col-md-3">
            <DatePickerInput id="fe-expense-due-date" onChange={this.dueDateChanged} label={ i18n.gettext('Due date') } value={this.state.expense.due_date} type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Input id="fe-expense-reference-number" bsStyle={this.validationState('reference_number')} hasFeedback help={this.validationMessage('reference_number')} onChange={this.onReferenceNumberChange} label={ i18n.gettext('Reference number') } value={common.formatReferenceNumber(this.state.expense.reference_number)} type="text" />
          </div>
          <div className="col-md-6">
          </div>
        </div>
        {this.state.expense.id && this.state.expense.status === 'unpaid' ? <div className="row">
          <div className="col-md-12">
            <ButtonToolbar className="well">
              <Button bsStyle="primary" onClick={this.setPaid}>{ i18n.gettext('Mark as paid') }</Button>
              <Button bsStyle="primary" disabled>{ i18n.gettext('Pay via bank') }</Button>
            </ButtonToolbar>
          </div>
        </div> : null }
        {this.props.confirmSave ? <div className="row">
          <div className="col-md-12">
            <ButtonToolbar>
              <Button disabled={this.props.saving} onClick={this.saveButtonHandler} bsStyle="primary">{ this.props.saving ? i18n.gettext('Saving...') : i18n.gettext('Save') }</Button>
              <Button onClick={this.cancelButtonHandler}>{ i18n.gettext('Cancel') }</Button>
            </ButtonToolbar>
          </div>
        </div> : ''}
      </form>
      );
  }
});

