var React = require('react');
var M = require('morearty');
var controller = require('controller');
var {
  setSearchQuery, deleteHistoryItem, searchByQuery, getCurrentSearchHistory
} = controller;
var {onTouch} = require('utils');

var SearchHistoryView = React.createClass({
  mixins: [M.Mixin],

  renderHistoryItem (query, i) {
    return (
      <div
        className="item item-icon-left item-icon-right"
        key={`search-history-${i}`}
        onTouchTap={onTouch(searchByQuery, controller, query)}
      >
        <span className="icon ion-ios-arrow-thin-up" onTouchTap={onTouch(setSearchQuery, controller, query)}></span>
        <span className="vmp-active-text vmp-list-item">{query}</span>
        <span className="icon ion-ios-close-empty" onTouchTap={onTouch(deleteHistoryItem, controller, i)}></span>
      </div>
    );
  },

  renderInfoSplash () {
    return (
      <div className="card">
        <div className="item item-text-wrap vmp-center">
          <span className="vmp-title">Здесь будет храниться ваша история поиска</span>
        </div>
      </div>
    );
  },

  render () {
    var history = getCurrentSearchHistory();
    var hasHistory = history && history.size > 0;
    var historyView;

    if (hasHistory) {
      historyView =
        <div className="list vmp-list scroll overflow-scroll">
          {history.map(this.renderHistoryItem).toJS()}
        </div>;
    } else {
      historyView = this.renderInfoSplash();
    }

    return (
      <div className="pane">
        {historyView}
      </div>
    );
  }
});

module.exports = SearchHistoryView;
