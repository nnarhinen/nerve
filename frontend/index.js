/**
 * @jsx React.DOM
 */

var React = require('react'),
    ReactRouter = require('react-router'),
    Routes = ReactRouter.Routes,
    Route = ReactRouter.Route
    NotFound = ReactRouter.NotFoundRoute,
    Link = ReactRouter.Link,
    ActiveState = ReactRouter.ActiveState,
    Pages = require('./pages'),
    axios = require('axios'),
    i18n = requirePo('../locale/%s/LC_MESSAGES/messages.po'),
    Flux = require('delorean.js').Flux;

var MenuItem = React.createClass({
  mixins: [ActiveState],
  getInitialState: function () {
    return { isActive: false };
  },
  updateActiveState: function () {
    this.setState({
      isActive: MenuItem.isActive(this.props.to, this.props.params, this.props.query)
    })
  },
  render: function() {
    var className = this.state.isActive ? 'active' : '';
    var link = Link(this.props);
    return <li className={className}>{link}</li>;
  }
});

var SettingsStore = Flux.createStore({
  actions: {
  },
  loading: true,
  getState: function() {
    return {
      loading: this.loading
    };
  }
});

var settingsStore = new SettingsStore();

var AppDispatcher = Flux.createDispatcher({
  getStores: function() {
    return {
      settings: settingsStore
    };
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
                    <Route name="dashboard" path="/" handler={Pages.Dashboard} />
                    <Route name="customers" path="/customers" handler={Pages.Customers} />
                    <NotFound handler={Pages.NotFound} />
                  </Routes>
                </div>
                <div className={menuClass}>
                  <a className="navmenu-brand visible-md visible-lg" href="#">Nerve</a>
                  <ul className="nav navmenu-nav">
                    <MenuItem to="dashboard">{ i18n.gettext('Dashboard') }</MenuItem>
                    <MenuItem to="customers">{ i18n.gettext('Customers') }</MenuItem>
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
              </div>
              );
          }
});

var bearerToken = oauthAccessToken;

React.renderComponent(<App bearerToken={bearerToken} dispatcher={AppDispatcher} />, document.body);
