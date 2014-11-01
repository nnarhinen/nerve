/**
 * @jsx React.DOM
 */

var React = require('react'),
    AutoComplete = require('react-bootstrap-async-autocomplete'),
    _ = require('underscore'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    api = require('frontend/api'),
    Modal = require('react-bootstrap/Modal'),
    Button = require('react-bootstrap/Button');
    ModalTrigger = require('react-bootstrap/ModalTrigger'),
    CustomerForm = require('frontend/pages/customers/info'),
    common = require('frontend/common'),
    CustomerActions = require('frontend/actions/customer-actions');


var CustomerInput = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  doSearch: _.debounce(function(keyw, cb) {
    api().searchCustomers({q: keyw}).then(function(customers) {
      cb(customers);
    }).catch(function(e) {
      console.error(e);
    });
  }, 500),
  getTextContentForItem: function(customer) {
    return customer.name;
  },
  render: function() {
    return this.transferPropsTo(<AutoComplete itemContent={this.getTextContentForItem} onSearch={this.doSearch} emptyContent={this.renderEmptyContent()} onItemSelect={this.props.customerSelected} />);
  },
  renderEmptyContent: function() {
    return (
      <li>
        <ModalTrigger ref="newCustomerModalTrigger" modal={this.renderModal()}>
          <a href="#" onClick={common.preventDefault}><i className="fa fa-plus"></i> {i18n.gettext('New customer')}</a>
        </ModalTrigger>
      </li>
    );
  },
  handleCancel: function() {
    this.refs.newCustomerModalTrigger.hide();
  },
  handleSave: function() {
    var data = this.refs.newCustomerForm.state.customer;
    var self = this;
    api().saveCustomer(data).then(function(newCustomer) {
      CustomerActions.updateOne(newCustomer);
      if (self.props.customerSelected) self.props.customerSelected(newCustomer);
      self.refs.newCustomerModalTrigger.hide();
    }).catch(function(err) {
      console.error(err);
      alert('Failed to save customer');
    });
  },
  renderModal: function() {
    return (
      <Modal title={i18n.gettext('New customer')} ref="newCustomerModal">
        <div className="modal-body">
          <CustomerForm ref="newCustomerForm" />
        </div>
        <div className="modal-footer">
          <Button onClick={this.handleCancel}>{i18n.gettext('Cancel')}</Button>
          <Button bsStyle="primary" onClick={this.handleSave}>{i18n.gettext('Create')}</Button>
        </div>
      </Modal>
    );
  }
});


module.exports = CustomerInput;
