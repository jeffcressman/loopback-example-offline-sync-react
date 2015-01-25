(typeof exports !== 'undefined' ? exports : window).ChangeView = React.createClass({
  mixins: [
    Reflux.listenTo(TodoStore, 'update')
  ],
  render: function() {
    var changes = ChangeStore.changes;
    var todos = ChangeStore.todos;
    var diff = ChangeStore.diff;

    return <div>
<h1>Local Change List</h1>
<p>
  A list of all changes made to models in local storage.
</p>
{changes.length === 0 && <strong>
  No local changes have been made.
</strong>}
{changes.length > 0 && <table>
  <tr>
    <th>Model ID</th>
    <th>Type</th>
    <th>Checkpoint</th>
    <th>Revision</th>
    <th>Prev Revision</th>
  </tr>
  {changes.map(function(change) {
    return <tr>
      <td>{change.modelId}</td>
      <td>{change.type()}</td>
      <td>{change.checkpoint}</td>
      <td>{change.rev}</td>
      <td>{change.prev}</td>
    </tr>
  })}
</table>}

<h1>Local to Server Deltas</h1>
<p>
  Below is list of changes required to replicate local data to the server.
</p>
{diff.deltas.length === 0 && <strong>No changes required to replicate the local data to the server.</strong>}
{diff.deltas.length > 0 && <table>
  <tr>
    <th>Model ID</th>
    <th>Revision</th>
    <th>Prev Revision</th>
  </tr>
  {diff.deltas.map(function(delta) {
    return <tr>
      <td>{delta.modelId}</td>
      <td>{delta.rev}</td>
      <td>{delta.prev}</td>
    </tr>
  })}
</table>}

<h1>Local Storage Data</h1>
<p>
  <a href="#" onClick={Actions.clearLocalStorage}>Clear Local Storage</a>
</p>
{todos.length === 0 && <strong>
  There is no data in local storage.
</strong>}
{todos.length > 0 && <table>
  <tr>
    <th>Todo ID</th>
    <th>Title</th>
    <th>Completed</th>
  </tr>
  {todos.map(function(todo) {
    return <tr>
      <td>{todo.getId()}</td>
      <td>{todo.title}</td>
      <td>{todo.completed}</td>
    </tr>
  })}
</table>}

<h1>Local to Server Conflicts</h1>
<p>
  Below is list of changes that cannot be replicated to the server.
</p>
{diff.conflicts.length === 0 && <strong>No conflicts...</strong>}
{diff.conflicts.length > 0 && <table>
  <tr>
    <th>Model ID</th>
    <th>Revision</th>
    <th>Prev Revision</th>
  </tr>
  {diff.conflicts.map(function(conflict) {
    return <tr>
      <td>{conflict.modelId}</td>
      <td>{conflict.rev}</td>
      <td>{conflict.prev}</td>
    </tr>
  })}
</table>}

    </div>
  },
  update: function() {
    this.forceUpdate();
  }
});
