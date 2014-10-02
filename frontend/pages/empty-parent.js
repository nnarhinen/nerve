/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../locale/%s/LC_MESSAGES/messages.po');

module.exports = React.createClass({
  render: function() {
    return <div>{ this.props.activeRouteHandler() }</div>
  }
});

