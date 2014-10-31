/**
 * @jsx React.DOM
 */

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return this.transferPropsTo(<this.props.activeRouteHandler />);
  }
});

