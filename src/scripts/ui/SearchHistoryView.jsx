var React = require('react');
var M = require('morearty');

var SearchHistoryView = React.createClass({
  mixins: [M.Mixin],

  render () {
    return (
      <div className="pane">
        <h1>SearchHistoryView</h1>
      </div>
    );
  }
});

module.exports = SearchHistoryView;
