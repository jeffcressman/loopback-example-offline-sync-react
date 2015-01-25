(typeof exports !== 'undefined' ? exports : window).ChangeStore = function() {

  var $scope;

  return Reflux.createStore({
    listenables: Actions,

    init: function() {
      $scope = this;

      this.changes = [];
      this.todos = [];
      this.diff = {
        deltas: [],
        conflicts: []
      }

      Todo.getChangeModel().find(function(err, changes) {
        $scope.changes = changes;
        $scope.trigger();

        RemoteTodo.diff(0, changes, function(err, diff) {
          $scope.diff = diff;
          $scope.trigger();
        });
      });

      Todo.find(function(err, todos) {
        $scope.todos = todos;
        $scope.trigger();
      });
    },

    onClearLocalStorage: function() {
      localStorage.removeItem('todo-db');
    }

  });
}();
