module.exports = function(app) {
  var routes = require('../../client/reapp/config/routes');
  Object
    .keys(routes)
    .forEach(function(route) {
      app.get(route, function(req, res) {
        res.sendfile(app.get('indexFile'));
      });
    });
};
