var React = require('react');
var M = require('morearty');
var models = require('models');
var collections = require('models/collections');

var ItemsListView = React.createClass({
  mixins: [M.Mixin],

  renderItem (collection, _item) {
    var item = _item.toJS();
    var model = models.getByCollection(collection);
    var title = collections.formatTitle(collection, item);
    var subtitle = model.formatSearchSubtitle(item);

    return (
      <a className="item">
        <span>{title}</span>
        <span className="item-desc">{subtitle}</span>
      </a>
    );
  },

  render () {
    var collection = this.getBinding().get('collection');
    var result = this.getBinding().get('data.result');

    var list = result && result.map(item => this.renderItem(collection, item));

    return (
      <div className="list">
        {list.toJS()}
      </div>
    );
  }
});

module.exports = ItemsListView;
