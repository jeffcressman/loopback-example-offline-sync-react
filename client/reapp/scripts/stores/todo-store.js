(typeof exports !== 'undefined' ? exports : window).TodoStore = function() {

  var $scope;

  function error(err) {
    //TODO error handling
    throw err;
  }

  function errorCallback(err) {
    if(err) error(err);
  }

  function onChange() {
    Todo.stats(function(err, stats) {
      if(err) return error(err);
      $scope.stats = stats;
    });
    Todo.find({
      where: $scope.statusFilter,
      sort: 'order DESC'
    }, function(err, todos) {
      $scope.todos = todos;
      $scope.trigger();
    });
  }

  function refreshConflicts() {
    $scope.localConflicts = [];
    $scope.trigger();
    sync();
  }

  return Reflux.createStore({
    listenables: Actions,

    init: function() {
      $scope = this;

      this.todos = [];
      this.stats = [];
      this.localConflicts = [];

      // sync the initial data
      sync(onChange);

      Todo.on('changed', onChange);
      Todo.on('deleted', onChange);

      Todo.on('conflicts', function(conflicts) {
        $scope.localConflicts = conflicts;
        conflicts.forEach(function(conflict) {
          conflict.type(function(err, type) {
            conflict.type = type;
            conflict.models(function(err, source, target) {
              conflict.source = source;
              conflict.target = target;
              conflict.manual = new conflict.SourceModel(source || target);
              conflict.changes(function(err, source, target) {
                source.modelId = getReadableModelId(source.modelId);
                conflict.sourceChange = source;
                target.modelId = getReadableModelId(target.modelId);
                conflict.targetChange = target;
                $scope.trigger();
              });
            });
          });
        });
      });
    },

    onAddTodo: function(title) {
      var todo = new Todo({title: title});
      todo.save();
    },

    onToggleCompleted: function(todo, completed) {
      todo.completed = completed;
      todo.save();
    },

    onTodoEdited: function (todo, title) {
      todo.title = title.trim();

      if (!todo.title) {
        this.onRemoveTodo(todo);
      } else {
        todo.save();
      }
    },

    onRemoveTodo: function (todo) {
      todo.remove(errorCallback);
    },

    onClearCompletedTodos: function () {
      Todo.destroyAll({completed: true}, onChange);
    },

    onMarkAll: function (completed) {
      Todo.find(function(err, todos) {
        if(err) return errorCallback(err);
        todos.forEach(function(todo) {
          todo.completed = completed;
          todo.save(errorCallback);
        });
      });
    },

    connected: function() {
      return network.isConnected;
    },

    onSync: function() {
      sync();
    },

    onConnect: function() {
      network.isConnected = true;
      this.trigger();
      sync();
    },

    onDisconnect: function() {
      network.isConnected = false;
      this.trigger();
    },

    onResolveUsingSource: function(conflict) {
      conflict.resolve(refreshConflicts);
    },

    onResolveUsingTarget: function(conflict) {
      if(conflict.targetChange.type() === 'delete') {
        conflict.SourceModel.deleteById(conflict.modelId, refreshConflicts);
      } else {
        var m = new conflict.SourceModel(conflict.target);
        m.save(refreshConflicts);
      }
    },

    onResolveManually: function(conflict) {
      conflict.manual.save(function(err) {
        if(err) return errorCallback(err);
        conflict.resolve(refreshConflicts);
      });
    }

  });
}();
