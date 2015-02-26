var React = require('react');
var M = require('morearty');
var models = require('models');
var collections = require('models/collections');
var status = require('status-controller');
var {onTouch} = require('utils');

var controller = require('controller');
var {
  navToSearchByItem, hasNextPage, loadNextPage, t, navToMapWithPopup
} = controller;

var ItemsListView = React.createClass({
  mixins: [M.Mixin],

  renderItem (collection, _item) {
    var item = _item.toJS();
    var model = models.getByCollection(collection);
    var title = collections.formatTitle(collection, item);
    var subtitle = model.formatSearchSubtitle(item);
    var key = `item-${collection}-${item.int_id}`;
    var onItemClicked;

    if (collection === 'addresses') {
      onItemClicked = navToMapWithPopup.bind(controller, {addressId: item.int_id, marker: true});
    } else {
      onItemClicked = navToSearchByItem.bind(controller, collection, item.int_id);
    }

    return (
      <div className="item vmp-list-item" key={key} onTouchTap={onTouch(onItemClicked)}>
        <span>{title}</span>
        <span className="item-desc">{subtitle}</span>
      </div>
    );
  },

  render () {
    var collection = this.getBinding().get('collection');
    var result = this.getBinding().get('data.result');
    var list = result && result.map(item => this.renderItem(collection, item));

    // set key to wrapper div to prevent scroll position saving after dom diff
    return (
      <div className="pane vmp-list scroll overflow-scroll" key={`${collection}-list`}>
        <div className="list has-header">
          {list && list.toJS()}

          {hasNextPage() &&
            <a className="item vmp-center">
              <button
                className="button button-small button-outline button-positive"
                onTouchTap={loadNextPage.bind(controller)}
              >
                {t('card.load_more')}
              </button>
            </a>}

        </div>
      </div>
    );
  }
});

module.exports = ItemsListView;
