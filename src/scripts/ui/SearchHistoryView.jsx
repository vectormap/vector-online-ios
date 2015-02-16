var React = require('react');
var M = require('morearty');
var controller = require('controller');
var {setSearchQuery, deleteHistoryItem, searchByQuery} = controller;

var SearchHistoryView = React.createClass({
  mixins: [M.Mixin],


  fillSearchFieldWithHistoryItem (e, query) {
    e.stopPropagation();
    setSearchQuery(query);
  },

  deleteHistoryItem (e, index) {
    e.stopPropagation();
    deleteHistoryItem(index);
  },

  renderHistoryItem (query, i) {
    return (
      <div className="item item-icon-left item-icon-right" key={`search-history-${i}`} onClick={searchByQuery.bind(controller, query)}>
        <span className="icon ion-ios-close-empty" onClick={e => this.deleteHistoryItem(e, i)}></span>
        <span className="vmp-active-text">{query}</span>
        <span className="icon ion-ios-arrow-thin-up" onClick={e => this.fillSearchFieldWithHistoryItem(e, query)}></span>
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
    var history = this.getBinding().get('queryHistory');
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
