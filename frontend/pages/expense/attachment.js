/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../../locale/%s/LC_MESSAGES/messages.po'),
    _ = require('underscore'),
    api = require('../../api'),
    PDF = require('react-pdf');

module.exports = React.createClass({
  getInitialState: function() {
    var attachmentId = Number(this.props.params.attachmentId);
    var attachment = _.find(this.props.expense.attachments, function(att) {
      return att.id === attachmentId;
    });
    return {attachment: attachment, downloadUrl: null};
  },
  componentDidMount: function() {
    var self = this;
    api(oauthAccessToken).fileDownloadUrl({type: 'expense_attachment', id: this.state.attachment.id}).then(function(resp) { //FIXME access token handling
      self.setState({
        downloadUrl: resp.url
      });
    }).catch(function(err) { console.error(err); alert('Unable to fetch file download URL'); });
  },

  render: function() {
    if (!this.state.downloadUrl) {
      return <i className="fa fa-spin fa-spinner"></i>;
    }
    if (this.state.attachment && this.state.attachment.mime_type === 'application/pdf') {
      return <PDF file={this.state.downloadUrl} />;
    }
    return <div>Foodsaf</div>;
  }
});

