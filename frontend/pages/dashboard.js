/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../locale/%s/LC_MESSAGES/messages.po');

module.exports = React.createClass({
  render: function() {
            return (
              <div className="container-fluid">
                <h1>{ i18n.gettext('Dashboard') }</h1>
                <div className="row">
                  <div className="col-md-8">What</div>
                  <div className="col-md-4">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">{ i18n.gettext('Pending invoices') }</h4>
                      </div>
                      <div className="panel-body">
                        <i className="fa fa-spin fa-circle-o-notch"></i>
                      </div>
                    </div>
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">{ i18n.gettext('E-Mail inbox') }</h4>
                      </div>
                      <div className="panel-body">
                        <i className="fa fa-spin fa-circle-o-notch"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
          }
});

