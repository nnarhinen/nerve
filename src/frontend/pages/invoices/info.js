/**
 * @jsx React.DOM
 */
'use strict';
var React = require('react'),
    FormMixin = require('frontend/mixins/form-mixin'),
    invoiceSchema = require('shared/schemas/invoice'),
    Input = require('react-bootstrap/Input'),
    DatePickerInput = require('frontend/components/date-picker-input'),
    CustomerInput = require('frontend/components/customer-input'),
    Tooltip = require('react-bootstrap/Tooltip'),
    ButtonToolbar = require('react-bootstrap/ButtonToolbar'),
    Button = require('react-bootstrap/Button'),
    OverlayTrigger = require('react-bootstrap/OverlayTrigger'),
    _ = require('underscore'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    api = require('frontend/api'),
    InvoiceActions = require('frontend/actions/invoice-actions');

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
  newRow: function(ev) {
    ev.preventDefault();
    var rows = this.state.invoice.rows;
    rows = rows.concat({});
    this.setState({
      invoice: _.extend(this.state.invoice, {rows: rows})
    });
  },
  onInvoiceRowChange: function(i) {
    var self = this;
    return function(ev) {
      var rows = JSON.parse(JSON.stringify(self.state.invoice.rows));
      var row = rows[i];
      row[ev.target.name] = ev.target.value;
      console.log('row', row);
      self.onPropertyChanged('rows', rows);
    };
  },
  sendMaventa: function(ev) {
    ev.preventDefault();
    var self = this;
    api().invoiceSendMaventa(this.state.invoice.id).then(function(inv) {
      self.setState({
        invoice: inv
      });
      InvoiceActions.resetOne(inv);
    });
  },
  invoiceDateChanged: function(m) {
    this.onPropertyChanged('invoice_date', m.format('YYYY-MM-DD'));
  },
  dueDateChanged: function(m) {
    this.onPropertyChanged('due_date', m.format('YYYY-MM-DD'));
  },
  render: function() {
    var sumWithoutVat = this.state.invoice.rows.reduce(function(sum, row) {
      return sum + (row.unit_price || 0) * (row.amount || 0);
    }, 0);
    var sumVat = this.state.invoice.rows.reduce(function(sum, row) {
      return sum + (row.unit_price || 0) * (row.amount || 0) * (row.vat_percent || 0) / 100;
    }, 0);
    var sumWithVat = sumWithoutVat + sumVat;

    var rowTotal = function(row) {
      return ((row.unit_price || 0) * (row.amount || 0) * (1+ (row.vat_percent || 0) / 100)).toFixed(2);
    };

    var self = this;

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
          <div className="col-md-3">
            <Input
                id="fe-invoice-reference-number"
                name="reference_number"
                bsStyle={this.validationState('reference_number')} hasFeedback help={this.validationMessage('reference_number')}
                type="text"
                value={this.state.invoice.reference_number}
                onChange={this.onReferenceNumberChange}
                label={i18n.gettext('Reference number')} />
          </div>
          <div className="col-md-2">
            <Input
                id="fe-invoice-sum"
                readOnly
                value={sumWithoutVat}
                label={i18n.gettext('Sum (without VAT)')} type="text" />
          </div>
          <div className="col-md-2">
            <Input
                id="fe-invoice-vat"
                readOnly
                value={sumVat}
                label={i18n.gettext('VAT')} type="text" />
          </div>
          <div className="col-md-2">
            <Input
                id="fe-invoice-sumvat"
                readOnly
                value={sumWithVat}
                label={i18n.gettext('Total (with VAT)')} type="text" />
          </div>
          <div className="col-md-3">
            <DatePickerInput id="fe-invoice-due-date" onChange={this.dueDateChanged} label={ i18n.gettext('Due date') } value={this.state.invoice.due_date} type="text" />
          </div>
        </div>
        <h2>{ i18n.gettext('Invoice rows') } <small>
            <OverlayTrigger placement="right" overlay={<Tooltip>{i18n.gettext('Add new row')}</Tooltip>}>
              <a href="#" onClick={this.newRow}><i className="fa fa-plus"></i></a>
            </OverlayTrigger>
          </small>
        </h2>
        { this.state.invoice.rows.length ? <div className="table-responsive"><table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>{ i18n.gettext('Procuct number') }</th>
              <th>{ i18n.gettext('Name') }</th>
              <th>{ i18n.gettext('à') }</th>
              <th>{ i18n.gettext('Vat %') }</th>
              <th>{ i18n.gettext('Amount') }</th>
              <th>{ i18n.gettext('Unit') }</th>
              <th>{ i18n.gettext('Total') }</th>
            </tr>
          </thead>
          <tbody>
            { this.state.invoice.rows.map(function(row, i) {
              var numCellStyle = {
                minWidth: '80px'
              };
              var productNumberCellStyle = {
                minWidth: '120px'
              };
              var changeHandler = self.onInvoiceRowChange(i);
              return (
                <tr key={i}>
                  <td>{ i + 1 }</td>
                  <td style={productNumberCellStyle}><Input type="text" onChange={changeHandler} name="product_number" className="input-sm" value={row.product_number} /></td>
                  <td className="col-md-12"><Input type="text" onChange={changeHandler} name="name" className="input-sm" value={row.name} /></td>
                  <td style={numCellStyle}><Input type="text" onChange={changeHandler} name="unit_price" className="input-sm" value={row.unit_price} /></td>
                  <td style={numCellStyle}><Input type="text" onChange={changeHandler} name="vat_percent" className="input-sm" value={row.vat_percent} /></td>
                  <td style={numCellStyle}><Input type="text" onChange={changeHandler} name="amount" className="input-sm" value={row.amount} /></td>
                  <td style={numCellStyle}><Input type="text" onChange={changeHandler} name="unit" className="input-sm" value={row.unit} /></td>
                  <td>{rowTotal(row)}</td>
                </tr> );
            }) }
          </tbody>
        </table></div> : ''}
        { this.renderStatus() }
      </form>
      );
  },
  renderStatus: function() {
    if (this.state.invoice.status === 'pending') {
      return (
        <div className="row">
          <ButtonToolbar>
            <Button disabled><i className="fa fa-print"></i> { i18n.gettext('Print') }</Button>
            <Button disabled><i className="fa fa-envelope-o"></i> { i18n.gettext('Send as e-mail') }</Button>
            <Button disabled={this.state.invoice.state === 'pending'} onClick={this.sendMaventa}><i className="fa fa-send-o"></i> { i18n.gettext('Send via Maventa') }</Button>
          </ButtonToolbar>
        </div>
      );
    }
    if (this.state.invoice.status === 'sent' && this.state.invoice.maventa_id) {
      return (
        <div className="row">
          Invoice sent via Maventa
        </div>
      );
    }
    return '';
  }
});

