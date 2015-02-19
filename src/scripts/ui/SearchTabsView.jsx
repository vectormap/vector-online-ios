var React       = require('react/addons');
var M           = require('morearty');
var collections = require('models/collections');

var cx = React.addons.classSet;

var SearchTabsView = React.createClass({
  mixins: [M.Mixin],

  onTabClicked (collection) {
    this.getBinding().set('view.tab', collection);
  },

  renderTab () {

  },

  render: function() {
    var searchBinding = this.getBinding();
    var results = searchBinding.get('results');

    var activeTab = searchBinding.get('view.tab');

    var tabs = results.map(r => {
      var collection = r.get('collection');
      var resultsCount = r.getIn(['data', 'result_count']);

      if (resultsCount > 0) {
        var collectionName = collections.translate(collection).plural();
        var cls = cx({
          'tab-item': true,
          'has-badge': true,
          'active': collection === activeTab
        });
        var key = `tab-${collection}`;

        return(
          <span className={cls} key={key} onTouchEnd={this.onTabClicked.bind(this, collection)}>
            <span>{collectionName}</span>
            <span className="badge">{resultsCount}</span>
          </span>
        );
      }
    });

    return (
      <div className="tabs tabs-text-only vmp-search-tabs has-header">
        {tabs.toJS()}
      </div>
    );
  }

});

module.exports = SearchTabsView;
