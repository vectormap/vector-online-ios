var React = require('react');
var M = require('morearty');

var BookmarksView = React.createClass({
  mixins: [M.Mixin],

  render () {
    return (
      <h1>BookmarksView</h1>
    );
  }
});

module.exports = BookmarksView;
