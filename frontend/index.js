/**
 * @jsx React.DOM
 */

var React = require('react'),
    ReactRouter = require('react-router'),
    Routes = ReactRouter.Routes,
    Route = ReactRouter.Route,
    NotFound = ReactRouter.NotFoundRoute,
    Link = ReactRouter.Link,
    ActiveState = ReactRouter.ActiveState,
    DefaultRoute = ReactRouter.DefaultRoute,
    Pages = require('./pages'),
    axios = require('axios'),
    i18n = requirePo('../locale/%s/LC_MESSAGES/messages.po'),
    Flux = require('delorean.js').Flux,
    api = require('./api'),
    SettingsActions = require('./actions/settings-actions'),
    Promise = require('bluebird'),
    MenuItem = require('./components/menu-item');

Promise.onPossiblyUnhandledRejection(function(e, promise) {
  throw e;
});

var Notification = React.createClass({
  render: function() {
    var className = "alert alert-" + this.props.state;
    return <div className={className}>{this.props.message}</div>
  }
});

var App = React.createClass({
  mixins: [Flux.mixins.storeListener],
  onNavButtonClick: function() {
    this.setState({menuVisible: !this.state.menuVisible});
  },
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    this.props.dispatcher.bearerToken = this.props.bearerToken;
    SettingsActions.fetch();
  },
  render: function() {
            if (this.getStore('settings').loading) {
              return (
                <div className="app-loading">
                  <i className="fa fa-5x fa-spin fa-circle-o-notch"></i>
                  <br />
                  Loading settings
                </div>
                );
            }
            var menuClass = 'navmenu navmenu-default navmenu-fixed-left offcanvas-sm';
            if (this.state.menuVisible) menuClass += ' show';
            return (
              <div>
                <div className="horizontal-spacer hidden-sm hidden-xs">
                </div>
                <div className="clearfix vertical-spacer hidden-md hidden-lg">
                </div>
                <div className="route-container">
                  <Routes>
                    <Route name="dashboard" path="/" handler={Pages.Dashboard} dispatcher={this.props.dispatcher} />
                    <Route name="expenses" path="/expenses" handler={Pages.Expenses}>
                      <Route name="expenses-history" path="/expenses/history" handler={Pages.Expenses} history={true} />
                      <Route name="expenses-pending" path="/expenses" handler={Pages.Expenses} />
                    </Route>
                    <Route name="customers" path="/customers" handler={Pages.Customers} dispatcher={this.props.dispatcher} />
                    <Route name="settings" path="/settings" handler={Pages.Settings} dispatcher={this.props.dispatcher} />
                    <NotFound handler={Pages.NotFound} />
                  </Routes>
                </div>
                <div className={menuClass}>
                  <a className="navmenu-brand visible-md visible-lg" href="#">Nerve</a>
                  <ul className="nav navmenu-nav">
                    <MenuItem to="dashboard">{ i18n.gettext('Dashboard') }</MenuItem>
                    <MenuItem to="expenses">{ i18n.gettext('Expenses') }</MenuItem>
                    <MenuItem to="customers">{ i18n.gettext('Customers') }</MenuItem>
                    <MenuItem to="settings">{ i18n.gettext('Settings') }</MenuItem>
                  </ul>
                </div>
                <div className="navbar navbar-default navbar-fixed-top hidden-md hidden-lg">
                  <button onClick={this.onNavButtonClick} type="button" className="pull-left navbar-toggle visible-sm visible-xs" style={ {'margin-left': '20px'} } data-toggle="offcanvas" data-target=".navmenu">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="#">Nerve</a>
                </div>
                <div className="notification-area">
                  {this.getStore('notifications').notifications.map(function(notification) {
                    return <Notification key={notification.id} state={notification.state} message={notification.message} />
                  })}
                </div>
              </div>
              );
          }
});

var bearerToken = oauthAccessToken;

React.renderComponent(<App bearerToken={bearerToken} dispatcher={require('./dispatchers/app-dispatcher')} />, document.body);
