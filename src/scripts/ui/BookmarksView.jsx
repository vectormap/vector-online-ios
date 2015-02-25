var React = require('react/addons');
var M = require('morearty');
var controller = require('controller');
var {t, getBookmarks, navToSearchByItem, removeOrgFromBookmarks} = controller;
var {List, Map} = require('immutable');

var SettingsView = React.createClass({
  mixins: [M.Mixin],

  renderBookmark (bookmark) {
    var orgId = bookmark.get('orgId');

    return (
      <div className="item item-icon-left item-icon-right" key={orgId}>
        <span className="icon ion-ios-star vmp-fav-highlight"></span>
        <span
          className="vmp-active-text vmp-list-item"
          onTouchTap={navToSearchByItem.bind(controller, 'organizations', orgId)}
        >
          {bookmark.get('orgTitle')}
        </span>
        <span
          className="icon ion-ios-close-empty"
          onTouchTap={removeOrgFromBookmarks.bind(controller, Map({int_id: orgId}))}></span>
      </div>
    );
  },

  render () {
    var bookmarks = (getBookmarks() || List()).map(this.renderBookmark);

    return (
      <div className="pane vmp-list overflow-scroll">
        <div className="bar-stable bar bar-header disable-user-behavior">
          <h1 className="title">{t('favorites')}</h1>
        </div>
        <div className="list has-header">
          {bookmarks && bookmarks.toJS()}
        </div>
      </div>
    );
  }
});

module.exports = SettingsView;
