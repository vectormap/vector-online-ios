var React = require('react');
var M = require('morearty');

var BookmarksView = React.createClass({
  mixins: [M.Mixin],

  render () {
    return (
      <div className="pane">
        <h1>BookmarksView</h1>
      </div>
    );
  }
});

module.exports = BookmarksView;
