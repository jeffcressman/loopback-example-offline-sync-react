'use strict';

module.exports = function(app) {
  var routes = require('../../client/reapp/config/routes');
  Object
    .keys(routes)
    .forEach(function(route) {
      app.get(route, function(req, res) {
        res.sendFile(app.get('indexFile'));
      });
    });
};
