/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('locale/%s/LC_MESSAGES/messages.po'),
    _ = require('underscore'),
    SettingsActions = require('../../actions/settings-actions');

module.exports = React.createClass({
  onValueChange: function(ev) {
    SettingsActions.changeSetting(ev.target.name, ev.target.value);
  },
  render: function() {
            return (
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fe-settings-maventa-api-key">{ i18n.gettext('API-key') }</label>
                      <input type="text" className="form-control" id="fe-settings-maventa-api-key" name="maventa_api_key" onChange={this.onValueChange} value={this.props.settings.maventa_api_key} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fe-settings-maventa-customer-uuid">{ i18n.gettext('Company UUID') }</label>
                      <input type="text" className="form-control" id="fe-settings-maventa-customer-uuid" name="maventa_company_uuid" onChange={this.onValueChange} value={this.props.settings.maventa_company_uuid} />
                    </div>
                  </div>
                </div>
              </div>
              );
          }
});

