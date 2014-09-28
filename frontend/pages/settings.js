/**
 * @jsx React.DOM
 */

var React = require('react'),
    Flux = require('delorean.js').Flux,
    i18n = requirePo('../../locale/%s/LC_MESSAGES/messages.po'),
    _ = require('underscore'),
    SettinsActions = require('../actions/settings-actions');

module.exports = React.createClass({
  mixins: [Flux.mixins.storeListener],
  onValueChange: function(ev) {
    SettingsActions.changeSetting(ev.target.name, ev.target.value);
  },
  render: function() {
            return (
              <div>
                <h1>{ i18n.gettext('Settings') }</h1>
                <h2>Maventa</h2>
                <div className="form-group">
                  <label htmlFor="fe-settings-maventa-api-key">{ i18n.gettext('API-key') }</label>
                  <input type="text" className="form-control" id="fe-settings-maventa-api-key" name="maventa_api_key" onChange={this.onValueChange} value={this.getStore('settings').maventa_api_key} />
                </div>
              </div>
              );
          }
});

