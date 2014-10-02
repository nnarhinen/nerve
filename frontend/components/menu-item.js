/**
 * @jsx React.DOM
 */

var React = require('react'),
    ReactRouter = require('react-router'),
    ActiveState = ReactRouter.ActiveState,
    Link = ReactRouter.Link;

var MenuItem = module.exports = React.createClass({
  mixins: [ActiveState],
  getInitialState: function () {
    return { isActive: false };
  },
  updateActiveState: function () {
    this.setState({
      isActive: MenuItem.isActive(this.props.to, this.props.params, this.props.query)
    })
  },
  render: function() {
    var className = this.state.isActive ? 'active' : '';
    var link = Link(this.props);
    return <li className={className}>{link}</li>;
  }
});


