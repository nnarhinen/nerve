/**
 * @jsx React.DOM
 */

var React = require('react'),
    FormMixin = require('../../mixins/form-mixin'),
    i18n = requirePo('../../../locale/%s/LC_MESSAGES/messages.po'),
    envSchema = require('../../../schemas/environment'),
    common = require('../../common'),
    Input = require('react-bootstrap/Input'),
    EnvironmentActions = require('../../actions/environment-actions');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      validationErrors: {},
      environment: this.props.environments.environment
    };
  },
  componentDidMount: function() {
    EnvironmentActions.fetch();
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.environments) this.setState({
      environment: newProps.environments.environment
    });
  },
  mixins: [FormMixin],
  transformObject: function(o) {
    return _.extend({}, o);
  },
  objectPropertyPath: 'environment',
  validationSchema: envSchema,
  autoSave: function() {
    return !this.props.confirmSave;
  },
  updateOne: function(newObject) {
    EnvironmentActions.update(newObject);
  },
  render: function() {
    if (this.props.environments.loading) return <i className="fa fa-spin fa-spinner"></i>;
    return (
      <form onSubmit={common.preventDefault}>
        <div className="row">
          <div className="col-md-6">
            <Input
              name="name"
              type="text"
              value={this.state.environment.name}
              onChange={this.onTextInputChange}
              label={i18n.gettext('Name')}
              bsStyle={this.validationState('name')}
              hasFeedback
              help={this.validationMessage('name')} />
          </div>
          <div className="col-md-6"></div>
        </div>
      </form>
      );
  }
});

