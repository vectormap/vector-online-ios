var React = require('react');
var {div} = React.DOM;

module.exports = {
  resolveView (viewsMap, binding, path) {
    var viewKey = binding.get(path);
    return viewsMap[viewKey]; // || 'div';
  }
};
