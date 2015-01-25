'use strict';

var Router = ReactRouter;
var Route = Router.Route;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

var App = React.createClass({
  render: function() {
    return <div>
      <h1>Welcome to the Todo App</h1>

      <div className="header">
        <ul className="navigation">
          <li> <Link to="home">Home</Link> </li>
          <li> <Link to="login">Login</Link> </li>
          <li> <Link to="register">Register</Link> </li>
        </ul>
      </div>

      <RouteHandler/>
    </div>
  }
});

var routes = (
  <Route handler={App} path="/">
  {Object.keys(window.CONFIG.routes)
    .map(function(route) {
      var routeDef = window.CONFIG.routes[route];
      var R = routeDef.default ? DefaultRoute : Route;
      return <R name={routeDef.name} path={route} handler={window[routeDef.handler]} />
    })}
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('loopbackExampleFullStackApp'));
});
