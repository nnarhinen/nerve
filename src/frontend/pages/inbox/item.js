/**
 * @jsx React.DOM
 */

'use strict';
var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    _ = require('underscore'),
    InboxActions = require('frontend/actions/inbox-actions');

var InboxItem = React.createClass({
  componentDidMount: function() {
    InboxActions.fetchOne(this.props.params.id);
    this.setEmailBody();
  },
  getInitialState: function() {
    return this.getStateFromProps(this.props);
  },
  componentWillReceiveProps: function(newProps) {
    this.setState(this.getStateFromProps(newProps));
  },
  getStateFromProps: function(props) {
    if (props.inbox.loading) return { loading: true };
    var id = Number(props.params.id),
        itm = _.find(props.inbox.items, function(one) { return one.id === id; }),
        html = (itm.body_html || itm.body_text).replace(/ class=/g, ' className=');
    return {
      item: itm,
      html: html,
      loading: false
    };
  },
  setEmailBody: function() {
    if (!this.refs.frame) return;
    var elem = this.refs.frame.getDOMNode();
    elem.contentDocument.body.innerHTML = this.state.html;
  },
  componentDidUpdate: function() {
    this.setEmailBody();
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
        <div className="row">
          <div className="col-md-12">
            <iframe width="100%" frameBorder="0" sandbox="allow-same-origin" ref="frame"></iframe>
          </div>
        </div>
        <h2>Attachments</h2>
        <div className="row">
        { itm.attachments.map(function(att) {
          var iconClass = 'fa fa-3x ';
          if (att.mime_type === 'application/pdf') iconClass += 'fa-file-pdf-o';
          else iconClass += 'fa-file-o';
          return (
            <div className="col-md-3 text-center" key={att.id}>
              <div className="well">
                <i className={iconClass}></i>
                <p>{ att.filename }</p>
              </div>
            </div>
          );
        }) }
        </div>
      </div>
    );
  }
});


module.exports = InboxItem;
