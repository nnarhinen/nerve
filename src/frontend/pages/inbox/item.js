/**
 * @jsx React.DOM
 */

'use strict';
var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    _ = require('underscore'),
    State = require('react-router').State,
    InboxActions = require('frontend/actions/inbox-actions'),
    RouteHandler = require('react-router').RouteHandler,
    MenuItem = require('frontend/components/menu-item');

var InboxItem = React.createClass({
  mixins: [State],
  componentDidMount: function() {
    InboxActions.fetchOne(this.getParams().id);
  },
  getInitialState: function() {
    return this.getStateFromProps(this.props);
  },
  componentWillReceiveProps: function(newProps) {
    this.setState(this.getStateFromProps(newProps));
  },
  getStateFromProps: function(props) {
    if (props.inbox.loading) return { loading: true };
    var id = Number(this.getParams().id),
        itm = _.find(props.inbox.items, function(one) { return one.id === id; }),
        html = (itm.body_html || itm.body_text).replace(/ class=/g, ' className=');
    return {
      item: itm,
      html: html,
      loading: false
    };
  },
  render: function() {
    if (this.state.loading) {
      return <i className="fa fa-spin fa-spinner"></i>;
    }
    var itm = this.state.item;
    return (
      <div>
        <h1>{ i18n.gettext('Inbox') } <small>{itm.subject}</small></h1>
        <p>From <i>{itm.from}</i></p>
        <RouteHandler item={itm} />
        <h2>Attachments</h2>
        <ul className="nav nav-pills">
        { itm.attachments.map(function(att) {
          var iconClass = 'fa fa-3x ';
          if (att.mime_type === 'application/pdf') iconClass += 'fa-file-pdf-o';
          else iconClass += 'fa-file-o';
          return (
            <MenuItem to="inbox-attachment" params={{id: itm.id, attId: att.id}} key={att.id} className="text-center">
              <span className="text-center">
                <i className={iconClass}></i><br />
                <span>{ att.filename }</span>
              </span>
            </MenuItem>
          );
        }) }
        </ul>
      </div>
    );
  }
});


module.exports = InboxItem;
