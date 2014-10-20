/**
 * @jsx React.DOM
 */

var React = require('react'),
    i18n = requirePo('../../../locale/%s/LC_MESSAGES/messages.po');

module.exports = React.createClass({
  render: function() {
            return (
              <div>
                <h2>{ i18n.gettext('User information') }</h2>
              </div>
              );
          }
});

