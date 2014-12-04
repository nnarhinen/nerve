/**
 * @jsx React.DOM
 */
'use strict';
var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    _ = require('underscore'),
    SettingsActions = require('../actions/settings-actions'),
    Router = require('react-router'),
    MenuItem = require('../components/menu-item');
var Settings = module.exports = React.createClass({
  mixins: [Router.ActiveState],
  render: function() {
    var title = _.last(this.getActiveRoutes()).props.title;
    return (
        <div>
          <h1>{ i18n.gettext('Settings') } <small>{ title }</small></h1>
          <div className="row">
            <div className="col-md-9">{ this.transferPropsTo(<this.props.activeRouteHandler />) }</div>
            <div className="col-md-3">
              <ul className="nav nav-pills nav-stacked">
                <MenuItem to="settings/user">{ i18n.gettext('User information') }</MenuItem>
                <MenuItem to="settings/environment">{ i18n.gettext('Company information') }</MenuItem>
                <MenuItem to="settings/maventa">Maventa</MenuItem>
                <MenuItem to="settings/bankson">Bankson</MenuItem>
              </ul>
            </div>
          </div>
        </div>
        );
  }
});

