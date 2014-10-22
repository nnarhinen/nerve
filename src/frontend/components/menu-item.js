/**
 * @jsx React.DOM
 */

var React = require('react'),
    ReactRouter = require('react-router'),
    ActiveState = ReactRouter.ActiveState,
    Link = ReactRouter.Link;

var MenuItem = module.exports = React.createClass({
  mixins: [ActiveState],
  render: function() {
    var className = this.isActive(this.props.to, this.props.params, this.props.query) ? 'active' : '';
    var link = Link(this.props);
    return <li className={className}>{link}</li>;
  }
});


