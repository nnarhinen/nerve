/**
 * @jsx React.DOM
 */
'use strict';
var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    UserActions = require('../../actions/user-actions'),
    _ = require('underscore'),
    banksonApi = require('frontend/bankson'),
    util = require('util');

module.exports = React.createClass({
  componentDidMount: function() {
    UserActions.fetchMe();
  },
  getInitialState: function() {
    return {};
  },
  componentWillReceiveProps: function(newProps) {
    var self = this;
    if (newProps.users && newProps.users.me && newProps.users.me.bankson_auth_token) {
      banksonApi().me().then(function(data) {
        self.setState({
          banksonInfo: data
        });
      });
    }
  },
  render: function() {
    if (this.props.users.loading) return <i className="fa fa-spin fa-spinner"></i>;
    if (!this.props.users.me.bankson_auth_token) {
      return (
        <div>
          <p>{i18n.gettext('You are not connected to Bankson.')}</p>
          <p><a href={'/connect/bankson?redirect=' + encodeURIComponent(window.location.toString())}>{i18n.gettext('Connect with Bankson')}</a></p>
        </div>
      );
    }
    if (!this.state.banksonInfo) return <i className="fa fa-spin fa-spinner"></i>;
    return (
      <div>
        <p>{util.format(i18n.gettext('You are connected to Bankson as %s (%s)'), this.state.banksonInfo.user.name, this.state.banksonInfo.environment.name)}</p>
      </div>
    );
  }
});

