(typeof exports !== 'undefined' ? exports : window).TodoView = React.createClass({
  mixins: [
    Reflux.listenTo(TodoStore, 'update'),
    React.addons.LinkedStateMixin,
    ReactRouter.State
  ],
  getInitialState: function() {
    return {
      newTodo: '',
      editedTodo: null
    };
  },
  render: function() {
    var todos = TodoStore.todos;
    var stats = TodoStore.stats;
    var allChecked = todos.length === stats.completed;
    var status = this.getParams().status;
    var visibleTodos = todos.filter(function(todo) {
      return !status
        || (status === 'active' && !todo.completed)
        || (status === 'completed' && todo.completed);
    });
    var localConflicts = TodoStore.localConflicts;

    return <div>

{localConflicts.length > 0 && <section id="local-conflicts" className="conflicts">
  <h1>Local Conflicts</h1>
  {localConflicts.map(function(conflict) {
    var sourceChangeType = conflict.sourceChange && conflict.sourceChange.type && conflict.sourceChange.type();
    var targetChangeType = conflict.targetChange && conflict.targetChange.type && conflict.targetChange.type();

    return <div>

    <table>
      <tr>
        <th>Local Data</th>
        <th>Remote Data</th>
      </tr>
      <tr>
        <td>
          {sourceChangeType === 'delete' && <div>
            <strong>Deleted</strong>
          </div>}
          {sourceChangeType !== 'delete' && <table>
            <tr>
              <th>id</th>
              <th>change</th>
              <th>title</th>
            </tr>
            <tr>
              <td>{conflict.sourceChange.modelId}</td>
              <td>{sourceChangeType}</td>
              <td>
                {conflict.source && conflict.source.title}
              </td>
            </tr>
          </table>}
          <button onClick={Actions.resolveUsingSource.bind(null, conflict)}>Use Local Version</button>
        </td>
        <td>
          {targetChangeType === 'delete' && <div>
            <strong>Deleted</strong>
          </div>}
          {targetChangeType !== 'delete' && <table>
            <tr>
              <th>id</th>
              <th>change</th>
              <th>title</th>
            </tr>
            <tr>
              <td>{conflict.targetChange.modelId}</td>
              <td>{targetChangeType}</td>
              <td>
                {conflict.target && conflict.target.title}
              </td>
            </tr>
          </table>}
          <button onClick={Actions.resolveUsingTarget.bind(null, conflict)}>Use Server Version</button>
        </td>
      </tr>
    </table>
    <ManualMerge conflict={conflict.manual} onResolve={Actions.resolveManually.bind(null, conflict)} />

    </div>
  })}
</section>}

<section id="todoapp">
  <header id="header">
    <h1>todos</h1>
    <form id="todo-form" onSubmit={this.addTodo}>
      <input id="new-todo" placeholder="What needs to be done?"  autoFocus={true} valueLink={this.linkState('newTodo')} />
    </form>
  </header>
  <section id="main" style={{display: todos.length ? 'block' : 'none'}}>
    <input id="toggle-all" type="checkbox" checked={allChecked} onChange={this.markAll} />
    <label htmlFor="toggle-all">Mark all as complete</label>
    <ul id="todo-list">
      {visibleTodos.map(function(todo) {
        return <TodoItem todo={todo} onRemoveTodo={Actions.removeTodo} onToggleCompleted={Actions.toggleCompleted} onTodoEdited={Actions.todoEdited} />
      }.bind(this))}
    </ul>
  </section>
  <footer id="footer" style={{display: todos.length ? 'block' : 'none'}}>
    <span id="todo-count"><strong>{stats.remaining}</strong> {stats.remaining === 1 ? 'item left' : 'items left'}
    </span>
    <ul id="filters">
      <li>
        <Link activeClassName="selected" to="/my/todos">All</Link>
      </li>
      <li>
        <Link activeClassName="selected" to="/my/todos/active">Active</Link>
      </li>
      <li>
        <Link activeClassName="selected" to="/my/todos/completed">Completed</Link>
      </li>
    </ul>
    <button id="clear-completed" onClick={Actions.clearCompletedTodos} style={{display: stats.remaining < todos.length ? 'inline' : 'none'}}>Clear completed ({stats.completed})</button>
  </footer>
</section>
<footer id="info">
  <p>Double-click to edit a todo</p>
</footer>
<footer className="debug">
  <button onClick={Actions.sync}>Sync</button> {' '}
  <button onClick={Actions.connect}>Connect</button> {' '}
  <button onClick={Actions.disconnect}>Disconnect</button> {' '}
  <a href="/debug" target="_blank">Debug</a> {' '}
  <strong> connected: {String(TodoStore.connected())} </strong>
</footer>

    </div>
  },
  update: function() {
    this.forceUpdate();
  },
  addTodo: function(ev) {
    ev.preventDefault();
    Actions.addTodo(this.state.newTodo);
    this.setState({
      newTodo: ''
    });
  },
  markAll: function(ev) {
    var checked = ev.target.checked;
    Actions.markAll(checked);
  }
});


var TodoItem = React.createClass({
  getInitialState: function() {
    return {
      editing: false,
      newValue: null
    };
  },
  render: function() {
    var todo = this.props.todo;
    var title = this.state.newValue !== null ? this.state.newValue : todo.title;

    return <li className={React.addons.classSet({completed: todo.completed, editing: this.state.editing})}>
      <div className="view">
        <input className="toggle" type="checkbox" value={todo.completed} onChange={this.toggleCompleted} />
        <label onDoubleClick={this.editTodo}>{title}</label>
        <button className="destroy" onClick={this.removeTodo}></button>
      </div>
      {this.state.editing && <form onSubmit={this.todoEdited}>
        <input className="edit" value={title} onChange={this.changeTodo} onBlur={this.todoEdited} autoFocus={true}/>
      </form>}
    </li>
  },
  editTodo: function() {
    this.setState({
      editing: true
    });
  },
  changeTodo: function(ev) {
    this.setState({
      newValue: ev.target.value
    });
  },
  removeTodo: function() {
    this.props.onRemoveTodo(this.props.todo);
  },
  toggleCompleted: function(ev) {
    this.props.onToggleCompleted(this.props.todo, ev.target.checked);
  },
  todoEdited: function(ev) {
    ev.preventDefault();
    if (this.state.newValue !== null) {
      this.props.onTodoEdited(this.props.todo, this.state.newValue);
    }
    this.setState({
      newValue: null,
      editing: false
    });
  }
});


var ManualMerge = React.createClass({
  render: function() {
    var conflict = this.props.conflict;
    return <div className="manual-merge">
      <h4>Merge Manually</h4>
      <input className="toggle" type="checkbox" checked={conflict.completed} onChange={this.changeCompleted} />
      <input className="edit" value={conflict.title} onChange={this.changeTitle} />
      <button onClick={this.props.onResolve}>Use This Version</button>
    </div>
  },
  changeCompleted: function(ev) {
    this.props.conflict.completed = ev.target.checked;
    this.forceUpdate();
  },
  changeTitle: function(ev) {
    this.props.conflict.title = ev.target.value;
    this.forceUpdate();
  }
});
