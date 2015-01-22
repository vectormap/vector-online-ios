var React = require('react');
var M = require('morearty');

var SearchHistoryView = React.createClass({
  mixins: [M.Mixin],

  render: function() {
    var history = this.getBinding().get();

    var historyItems = history.map(item =>
      <a className="item">
        {item.get('title')}
      </a>
    ).toJS();

    return (
      <div className="list">
        {historyItems}
      </div>
    );
  }

});

module.exports = SearchHistoryView;
