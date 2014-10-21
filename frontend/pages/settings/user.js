/**
 * @jsx React.DOM
 */

var React = require('react'),
    FormMixin = require('../../mixins/form-mixin'),
    i18n = requirePo('../../../locale/%s/LC_MESSAGES/messages.po'),
    userSchema = require('../../../schemas/user'),
    common = require('../../common'),
    Input = require('react-bootstrap/Input'),
    UserActions = require('../../actions/user-actions');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      validationErrors: {},
      user: this.props.users.me
    };
  },
  componentDidMount: function() {
    UserActions.fetchMe();
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.users) this.setState({user: newProps.users.me});
  },
  mixins: [FormMixin],
  transformObject: function(o) {
    return _.extend({}, o);
  },
  objectPropertyPath: 'user',
  validationSchema: userSchema,
  autoSave: function() {
    return !this.props.confirmSave;
  },
  updateOne: function(newObject) {
    UserActions.updateOne(newObject);
  },
  render: function() {
    if (this.props.users.loading) return <i className="fa fa-spin fa-spinner"></i>;
    return (
      <form onSubmit={common.preventDefault}>
        <div className="row">
          <div className="col-md-6">
            <Input
              name="email"
              type="email"
              value={this.state.user.email}
              onChange={this.onTextInputChange} 
              label={i18n.gettext('Email')}
              bsStyle={this.validationState('email')}
              hasFeedback
              help={this.validationMessage('email')} />
          </div>
          <div className="col-md-6">
            <Input
              name="name"
              type="text"
              value={this.state.user.name}
              onChange={this.onTextInputChange}
              label={i18n.gettext('Name')}
              bsStyle={this.validationState('name')}
              hasFeedback
              help={this.validationMessage('name')} />
          </div>
        </div>
      </form>
      );
  }
});

