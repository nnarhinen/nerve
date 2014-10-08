/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../../locale/%s/LC_MESSAGES/messages.po'),
    Link = require('react-router').Link;

module.exports = React.createClass({
  render: function() {
    var expense = this.props.expense;
    return expense.attachments.length ? (
      <table className="table">
        <thead>
          <tr>
            <th>{ i18n.gettext('Type') }</th>
            <th>{ i18n.gettext('Filename') }</th>
            <th>{ i18n.gettext('Filetype') }</th>
          </tr>
        </thead>
        <tbody>
          {this.props.expense.attachments.map(function(att) {
            return <tr key={att.id}><td>{att.type}</td><td><Link to="expense-attachment" params={ {id: expense.id, attachmentId: att.id} }>{att.s3path}</Link></td><td>{att.mime_type}</td></tr>;
          }) }
        </tbody>
      </table> ) : <div className="row"><div className="col-md-6">No attachments</div></div>;

  }
});

