var Link = ReactRouter.Link;

(typeof exports !== 'undefined' ? exports : window).WelcomeView = React.createClass({
  render: function() {
    return <div>

<h2>Welcome</h2>

This is the welcome view. <Link to="todos">View your todo list.</Link>

    </div>
  }
});
