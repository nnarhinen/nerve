/**
 * @jsx React.DOM
 */

var React = require('react'),
    FormMixin = require('frontend/mixins/form-mixin'),
    customerSchema = require('shared/schemas/customer'),
    Input = require('react-bootstrap/Input'),
    _ = require('underscore'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po');

module.exports = React.createClass({
  mixins: [FormMixin],
  getInitialState: function() {
    return {
      customer: this.props.customer || {},
      validationErrors: {}
    };
  },
  onFormSubmit: function(ev) {
    ev.preventDefault();
  },
  transformObject: function(o) {
    return _.extend({}, o);
  },
  objectPropertyPath: 'customer',
  validationSchema: customerSchema,
  autoSave: false, // TODO fix this
  updateOne: function(newObject) {
    //InvoiceActions.updateOne(newObject);
  },
  render: function() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-md-6">
            <Input
                id="fe-customer-name"
                bsStyle={this.validationState('name')} hasFeedback help={this.validationMessage('name')}
                value={this.state.customer.name}
                onChange={this.onTextInputChange} name="name" label={ i18n.gettext('Name')  } type="text" />
          </div>
          <div className="col-md-3">
            <Input readOnly value={this.state.customer.customer_number} type="text" label={i18n.gettext('Customer number')} />
          </div>
          <div className="col-md-3">
            <Input id="fe-customer-business-id"
                   bsStyle={this.validationState('business_id')} hasFeedback help={this.validationMessage('business_id')}
                   value={this.state.customer.business_id}
                   onChange={this.onTextInputChange}
                   name="business_id"
                   type="text"
                   label={i18n.gettext('Business id')} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Input
                id="fe-customer-email"
                bsStyle={this.validationState('email')} hasFeedback help={this.validationMessage('email')}
                value={this.state.customer.email}
                onChange={this.onTextInputChange}
                name="email"
                type="email"
                label={i18n.gettext('E-Mail')} />
          </div>
          <div className="col-md-6">
            <Input
                id="fe-customer-phone"
                bsStyle={this.validationState('phone')} hasFeedback help={this.validationMessage('phone')}
                value={this.state.customer.phone}
                onChange={this.onTextInputChange}
                name="phone"
                type="text"
                label={i18n.gettext('Phone')} />
          </div>
        </div>
      </form>
      );
  }
});

