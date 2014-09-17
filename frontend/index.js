/**
 * @jsx React.DOM
 */

var React = require('react'),
    ReactRouter = require('react-router'),
    Routes = ReactRouter.Routes,
    Route = ReactRouter.Route,
    NotFound = ReactRouter.NotFoundRoute,
    Link = ReactRouter.Link,
    Pages = require('./pages'),
    i18n = requirePo('../locale/%s/LC_MESSAGES/messages.po');

var App = React.createClass({
  render: function() {
            return (
              <div>
                <Routes>
                  <Route name="dashboard" path="/" handler={Pages.Dashboard} />
                  <Route name="customers" path="/customers" handler={Pages.Customers} />
                  <NotFound handler={Pages.NotFound} />
                </Routes>
                <div className="navmenu navmenu-default navmenu-fixed-left offcanvas-sm">
                  <a className="navmenu-brand visible-md visible-lg" href="#">Nerve</a>
                  <ul className="nav navmenu-nav">
                    <li className="active"><Link to="dashboard">{ i18n.gettext('Dashboard') }</Link></li>
                    <li><Link to="customers">{ i18n.gettext('Customers') }</Link></li>
                  </ul>
                </div>
                <div className="navbar navbar-default navbar-fixed-top hidden-md hidden-lg">
                  <button type="button" className="pull-left navbar-toggle visible-sm visible-xs" style={ {'margin-left': '20px'} } data-toggle="offcanvas" data-target=".navmenu">
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

React.renderComponent(<App />, document.body);
