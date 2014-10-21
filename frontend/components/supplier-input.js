/**
 * @jsx React.DOM
 */


var React = require('react'),
    Modal = require('react-bootstrap/Modal'),
    Button = require('react-bootstrap/Button'),
    i18n = requirePo('../../locale/%s/LC_MESSAGES/messages.po'),
    Flux = require('delorean.js').Flux,
    SupplierActions = require('../actions/supplier-actions'),
    Input = require('react-bootstrap/Input'),
    OverlayMixin = require('react-bootstrap/OverlayMixin'),
    ButtonToolbar = require('react-bootstrap/ButtonToolbar'),
    FormMixin = require('../mixins/form-mixin'),
    supplierSchema = require('../../schemas/supplier'),
    _ = require('underscore'),
    common = require('../common');


var SupplierInput = module.exports = React.createClass({
  mixins: [OverlayMixin, FormMixin],
  getInitialState: function() {
    return {
      isModalOpen: false,
      validationErrors: {}
    };
  },
  handleToggle: function() {
    if (!this.state.isModalOpen) SupplierActions.fetch();
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  handleInputChange: function() {},
  render: function() {
    return (
      <div className="input-group">
        <input id={this.props.id} type="text" className="form-control" value={this.props.value && this.props.value.name} onChange={this.handleInputChange} />
        <span className="input-group-btn">
          <Button onClick={this.handleToggle} className="btn-btn-default btn-primary-inverted" type="button" title={ i18n.gettext('Choose supplier') } ><i className="fa fa-folder-open-o"></i></Button>
        </span>
      </div>
      );
  },
  selectSupplier: function(ev) {
    var supplierId = Number(ev.currentTarget.getAttribute('data-id'));
    var supplier = _.find(this.props.suppliers.suppliers, function(s) { return s.id === supplierId; });
    if (this.props.onSupplierChange) this.props.onSupplierChange(supplier);
    this.handleToggle();
  },
  createNew: function(ev) {
    ev.preventDefault();
    this.setState({
      promptNew: true,
      newSupplier: {}
    });
  },
  newCanceled: function(ev) {
    ev.preventDefault();
    this.setState({
      promptNew: false,
      newSupplier: {}
    });
  },
  handleNewSupplier: function(ev) {
    ev.preventDefault();
    this.setState({
      persistingNew: true
    });
    var self = this;
    SupplierActions.createNew(this.state.newSupplier).then(function(supplier) {
      self.setState({
        persistingNew: false,
        promptNew: false,
        newSupplier: {}
      });
      if (self.props.onSupplierChange) self.props.onSupplierChange(supplier);
      self.handleToggle();
    }).catch(function() {
      alert('Unable to save');
      self.setState({
        persistingNew: false
      });
    });
  },
  objectPropertyPath: 'newSupplier',
  validationSchema: supplierSchema,
  autoSave: false,
  transformObject: _.identity,
  renderOverlay: function() {
    var self = this;
    if (!this.state.isModalOpen) {
      return <span />;
    }
    if (this.state.promptNew) {
      return (
        <Modal title={ i18n.gettext('New supplier') } onRequestHide={this.handleToggle}>
          <div className="modal-body">
            <form onSubmit={this.handleNewSupplier}>
              <Input
                label="Name"
                bsStyle={this.validationState('name')} hasFeedback help={this.validationMessage('name')}
                type="text"
                onChange={this.onTextInputChange}
                name="name"
                value={this.state.newSupplier.name} />
              <Input
                name="iban"
                bsStyle={this.validationState('iban')} hasFeedback help={this.validationMessage('iban')}
                label="IBAN"
                type="text"
                onChange={this.onIBANChange}
                value={common.formatIban(this.state.newSupplier.iban)} />
              <Input
                label="BIC"
                bsStyle={this.validationState('bic')} hasFeedback help={this.validationMessage('bic')}
                type="text"
                onChange={this.onUppercaseInputChange}
                name="bic"
                value={this.state.newSupplier.bic} />
              <ButtonToolbar>
                <Button disabled={this.state.persistingNew}
                  type="submit"
                  bsStyle="primary">
                  { this.state.persistingNew ? i18n.gettext('Wait..') : i18n.gettext('Save') }
                </Button>
                <Button disabled={this.state.persistingNew}
                  bsStyle="default"
                  onClick={this.newCanceled}>
                  { i18n.gettext('Cancel') }
                </Button>
              </ButtonToolbar>
            </form>
          </div>
        </Modal>
        );
    }
    return (
      <Modal title={ i18n.gettext('Choose supplier') } onRequestHide={this.handleToggle}>
        <div className="modal-body">
          {this.props.suppliers.loading ? <i className="fa fa-spin fa-spinner"></i> :
            (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <td><a href="#" onClick={self.createNew}><i className="fa fa-plus"></i> { i18n.gettext('Create new') }</a></td>
                  </tr>
                </tfoot>
                <tbody>
                  {this.props.suppliers.suppliers.map(function(s) {
                    return <tr onClick={self.selectSupplier} data-id={s.id} className="cursor-hand" key={s.id}><td>{s.name}</td></tr>;
                  }) }
                </tbody>
              </table>
            )
          }
        </div>
        <div className="modal-footer">
          <Button onClick={this.handleToggle}>Close</Button>
        </div>
      </Modal>
      );
  }
});
