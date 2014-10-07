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
    MenuItem = require('./components/menu-item'),
    NotificationActions = require('./actions/notification-actions'),
    md5 = require('blueimp-md5').md5;

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
  /**
   * Flash messages
   */
  notify: function(notification) {
    NotificationActions.notify(notification);
  },
  notificationMessages: {
    'waiting-for-modifications': i18n.gettext('Waiting for more modifications..'),
    persisting: i18n.gettext('Persiting..'),
    persisted: i18n.gettext('Persisted!')
  },
  storeDidChange: function(storeName, event) {
    if (['persisting', 'persisted', 'waiting-for-modifications'].indexOf(event) !== -1) {
      this.notify({
        message: this.notificationMessages[event],
        state: event === 'persisted' ? 'success' : 'info',
        id: storeName,
        ttl: event === 'persisted' ? 1000 : undefined
      })
    }
  },
  render: function() {
    var gravatarUrl = 'https://www.gravatar.com/avatar/' + md5(this.props.user.email) + '?s=45';
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
                  <this.props.activeRouteHandler
                    expenses={this.getStore('inboundInvoices')}
                    settings={this.getStore('settings')}
                  />
                </div>
                <div className={menuClass}>
                  <a className="navmenu-brand visible-md visible-lg" href="#">Nerve</a>
                  <ul className="nav navmenu-nav">
                    <MenuItem to="dashboard">{ i18n.gettext('Dashboard') }</MenuItem>
                    <MenuItem to="expenses">{ i18n.gettext('Expenses') }</MenuItem>
                    <MenuItem to="customers">{ i18n.gettext('Customers') }</MenuItem>
                    <MenuItem to="settings">{ i18n.gettext('Settings') }</MenuItem>
                  </ul>
                  <div className="account-info">
                    <div className="col-md-3">
                      <img className="img-rounded" title={ i18n.gettext('Change your profile image at gravatar.com') } src={ gravatarUrl }/>
                    </div>
                    <div className="col-md-9">
                      { this.props.user.name }
                      <br />
                      <a href="/logout">Logoff</a>
                    </div>
                  </div>
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

var RouteApp = React.createClass({
  render: function() {
    return (
      <Routes>
        <Route name="container" path="/" handler={App} user={this.props.user} bearerToken={this.props.bearerToken} dispatcher={this.props.dispatcher}>
          <DefaultRoute name="dashboard"  handler={Pages.Dashboard} />
          <Route name="expenses" handler={Pages.EmptyParent}>
            <Route name="expenses-history" path="/expenses/history" handler={Pages.Expenses} history={true} />
            <Route name="expenses-pending" path="/expenses" handler={Pages.Expenses} />
            <Route name="expense" path="/expenses/:id" handler={Pages.Expense}>
              <DefaultRoute name="expense-info" handler={Pages.ExpenseInfo} />
              <Route name="expense-attachments" path="attachments" handler={Pages.ExpenseAttachments} />
            </Route>
          </Route>
          <Route name="customers" path="/customers" handler={Pages.Customers}  />
          <Route name="settings" path="/settings" handler={Pages.Settings} />
          <NotFound handler={Pages.NotFound} />
        </Route>
      </Routes>
      );
  }
});

React.renderComponent(<RouteApp bearerToken={bearerToken} user={window.userInfo} dispatcher={require('./dispatchers/app-dispatcher')} />, document.body);
