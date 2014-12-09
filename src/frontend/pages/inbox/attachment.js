'use strict';
var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    _ = require('underscore'),
    State = require('react-router').State,
    InboxActions = require('frontend/actions/inbox-actions'),
    api = require('frontend/api'),
    RouteHandler = require('react-router').RouteHandler,
    PDF = require('react-pdf');

var InboxItem = React.createClass({
  mixins: [State],
  getInitialState: function() {
    var attId = this.getParams().attId;
    return {item: this.props.item,
      attachment: _.find(this.props.item.attachments, att => att.id = attId)
    };
  },
  componentWillReceiveProps: function(newProps) {
    var attId = this.getParams().attId;
    this.setState({
      item: newProps.item,
      attachment: _.find(this.props.item.attachments, att => att.id = attId)
    });
    this.fetchDownloadUrl();
  },
  componentDidMount: function() {
    this.fetchDownloadUrl();
  },
  fetchDownloadUrl: function() {
    var self = this;
    api().fileDownloadUrl({type: 'inbox_attachment', id: this.state.attachment.id}).then(function(resp) { //FIXME access token handling
      self.setState({
        downloadUrl: resp.url
      });
    });
  },
  render: function() {
    if (!this.state.downloadUrl) return null;
    if (this.state.attachment.mime_type === 'application/pdf') {
      return <PDF file={this.state.downloadUrl} />
    }
    return (
      <div className="row">
        <div className="col-md-12">
          Attachment here
        </div>
      </div>
    );
  }
});


module.exports = InboxItem;
