'use strict';

var React = require('react'),
    ReactRouter = require('react-router'),
    ActiveState = ReactRouter.State,
    Link = ReactRouter.Link;

var MenuItem = module.exports = React.createClass({
  mixins: [ActiveState],
  render: function() {
    var className = this.isActive(this.props.to, this.props.params, this.props.query) ? 'active' : '';
    return <li className={className}><Link {...this.props} /></li>;
  }
});


