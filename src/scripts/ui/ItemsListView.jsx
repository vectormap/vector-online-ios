var React = require('react');
var M = require('morearty');
var models = require('models');
var collections = require('models/collections');

var controller = require('controller');
var {navToSearchByItem} = controller;

var ItemsListView = React.createClass({
  mixins: [M.Mixin],

  renderItem (collection, _item) {
    var item = _item.toJS();
    var model = models.getByCollection(collection);
    var title = collections.formatTitle(collection, item);
    var subtitle = model.formatSearchSubtitle(item);
    var key = `item-${collection}-${item.int_id}`;

    return (
      <a className="item vmp-list-item" key={key}
        onClick={navToSearchByItem.bind(controller, collection, item.int_id)}>
        <span>{title}</span>
        <span className="item-desc">{subtitle}</span>
      </a>
    );
  },

  render () {
    var collection = this.getBinding().get('collection');
    var result = this.getBinding().get('data.result');

    var list = result && result.map(item => this.renderItem(collection, item));

    // set key to wrapper div to prevent scroll position saving after dom diff
    return (
      <div className="pane vmp-list" key={`${collection}-list`}>
        <div className="list has-header">
          {list && list.toJS()}
        </div>
      </div>
    );
  }
});

module.exports = ItemsListView;