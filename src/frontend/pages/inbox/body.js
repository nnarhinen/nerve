/**
 * @jsx React.DOM
 */

'use strict';
var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    _ = require('underscore'),
    State = require('react-router').State,
    InboxActions = require('frontend/actions/inbox-actions'),
    RouteHandler = require('react-router').RouteHandler;

var InboxItem = React.createClass({
  mixins: [State],
  componentDidMount: function() {
    this.setEmailBody();
  },
  getInitialState: function() {
    return {item: this.props.item};
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({item: newProps.item});
  },
  setEmailBody: function() {
    if (!this.refs.frame) return;
    var elem = this.refs.frame.getDOMNode();
    elem.contentDocument.body.innerHTML = (this.state.item.body_html || this.state.item.body_text).replace(/ class=/g, ' className=');
  },
  componentDidUpdate: function() {
    this.setEmailBody();
  },
  render: function() {
    var itm = this.props.item;
    return (
      <div className="row">
        <div className="col-md-12">
          <iframe width="100%" frameBorder="0" sandbox="allow-same-origin" ref="frame"></iframe>
        </div>
      </div>
    );
  }
});


module.exports = InboxItem;
