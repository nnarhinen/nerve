/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../../locale/%s/LC_MESSAGES/messages.po');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="fe-expense-supplier">{ i18n.gettext('Supplier') }</label>
            <input type="text" className="form-control" id="fe-expense-supplier" name="supplier" value={this.props.expense.supplier.name} />
          </div>
        </div>
      </div>
      );
  }
});

