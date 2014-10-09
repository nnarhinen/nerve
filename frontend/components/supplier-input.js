/**
 * @jsx React.DOM
 */


var React = require('react'),
    Modal = require('react-bootstrap/Modal'),
    Button = require('react-bootstrap/Button'),
    i18n = requirePo('../../locale/%s/LC_MESSAGES/messages.po'),
    Flux = require('delorean.js').Flux,
    SupplierActions = require('../actions/supplier-actions'),
    OverlayMixin = require('react-bootstrap/OverlayMixin');


var SupplierInput = module.exports = React.createClass({
  mixins: [OverlayMixin],
  getInitialState: function() {
    return {
      isModalOpen: false
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
        <input type="text" className="form-control" value={this.props.value.name} onChange={this.handleInputChange} />
        <span className="input-group-btn">
          <Button onClick={this.handleToggle} className="btn-btn-default btn-primary-inverted" type="button" title={ i18n.gettext('Choose supplier') }><i className="fa fa-folder-open-o"></i></Button>
        </span>
      </div>
      );
  },
  selectSupplier: function(ev) {
    var supplierId = Number(ev.currentTarget.getAttribute('data-id'));
    var supplier = _.find(this.props.suppliers.suppliers, function(s) { return s.id === supplierId; });
    this.props.onSupplierChange && this.props.onSupplierChange(supplier);
    this.handleToggle();
  },
  renderOverlay: function() {
    var self = this;
    if (!this.state.isModalOpen) {
      return <span />;
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
