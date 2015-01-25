(typeof exports !== 'undefined' ? exports : window).Actions = Reflux.createActions([
  'addTodo',
  'removeTodo',
  'todoEdited',
  'toggleCompleted',
  'markAll',
  'clearCompletedTodos',

  'sync',
  'connect',
  'disconnect',
  'resolveUsingSource',
  'resolveUsingTarget',
  'resolveManually',

  'clearLocalStorage'
]);
