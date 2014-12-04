'use strict';
var React = require('react'),
    RouteHandler = require('react-router').RouteHandler;

module.exports = React.createClass({
  render: function() {
    return <RouteHandler {...this.props} />;
  }
});

