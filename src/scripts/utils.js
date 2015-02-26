var React = require('react');
var {div} = React.DOM;

module.exports = {
  resolveView (viewsMap, binding, path) {
    var viewKey = binding.get(path);
    return viewsMap[viewKey]; // || 'div';
  },

  shuffle (o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

    return o;
  },

  UUID () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return '{' + uuid + '}';
  },

  openUrl (href) {
    window.open(href, '_system', '');
  },

  onTouch (callback, context, ...args) {
    return e => {
      e.preventDefault();
      e.stopPropagation();
      callback.apply(context, args);
    };
  }
};
