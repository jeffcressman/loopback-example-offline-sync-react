'use strict';

// load lbclient via browserify's require
var client = (function() {
  /*global require:true*/
  return require('lbclient');
})();

var Todo = client.models.LocalTodo;
var RemoteTodo = client.models.Todo;
var sync = client.sync;
var network = client.network;
