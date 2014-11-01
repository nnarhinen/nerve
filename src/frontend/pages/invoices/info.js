/**
 * @jsx React.DOM
 */

var React = require('react'),
    FormMixin = require('frontend/mixins/form-mixin'),
    invoiceSchema = require('shared/schemas/invoice'),
    Input = require('react-bootstrap/Input'),
    DatePickerInput = require('frontend/components/date-picker-input'),
    CustomerInput = require('frontend/components/customer-input'),
    _ = require('underscore'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po');

module.exports = React.createClass({
  mixins: [FormMixin],
  getInitialState: function() {
    return {
      invoice: this.props.invoice,
      validationErrors: {}
    };
  },
  onFormSubmit: function(ev) {
    ev.preventDefault();
  },
  transformObject: function(o) {
    if (/\.$/.exec(o.sum) || isNaN(Number(o.sum))) return o; // Let flow to validator
    return _.extend({}, o, {sum: Number(o.sum)});
  },
  objectPropertyPath: 'invoice',
  validationSchema: invoiceSchema,
  autoSave: true,
  updateOne: function(newObject) {
    InvoiceActions.updateOne(newObject);
  },
  onCustomerSelected: function(cust) {
    this.onPropertyChanged({
      customer: cust,
      customer_id: cust.id
    });
  },
  render: function() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-md-6">
            <CustomerInput label={ i18n.gettext('Customer') } value={this.state.invoice.customer && this.state.invoice.customer.name} type="text" customerSelected={this.onCustomerSelected} />
          </div>
          <div className="col-md-3">
            <Input readOnly label={ i18n.gettext('Invoice number') } value={this.state.invoice.invoice_number} type="text" />
          </div>
          <div className="col-md-3">
            <DatePickerInput id="fe-invoice-invoice-date" onChange={this.invoiceDateChanged} label={ i18n.gettext('Invoice date') } value={this.state.invoice.invoice_date} type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Input
                id="fe-invoice-reference-number"
                name="reference_number"
                bsStyle={this.validationState('reference_number')} hasFeedback help={this.validationMessage('reference_number')}
                type="text"
                value={this.state.invoice.reference_number}
                onChange={this.onReferenceNumberChange}
                label={i18n.gettext('Reference number')} />
          </div>
          <div className="col-md-3">
            <Input
                id="fe-invoice-sum"
                readOnly
                label={i18n.gettext('Sum')} type="text" />
          </div>
          <div className="col-md-3">
            <DatePickerInput id="fe-invoice-due-date" onChange={this.dueDateChanged} label={ i18n.gettext('Due date') } value={this.state.invoice.due_date} type="text" />
          </div>
        </div>
      </form>
      );
  }
});

