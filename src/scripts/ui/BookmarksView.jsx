var React = require('react/addons');
var M = require('morearty');
var controller = require('controller');
var {t, getBookmarks, navToSearchByItem, removeOrgFromBookmarks} = controller;
var {List, Map: _Map} = require('immutable');
var {onTouch} = require('utils');

var SettingsView = React.createClass({
  mixins: [M.Mixin],

  renderBookmark (bookmark) {
    var orgId = bookmark.get('orgId');

    return (
      <div
        className="item item-icon-left item-icon-right"
        key={orgId}
        onTouchTap={onTouch(navToSearchByItem, controller, 'organizations', orgId)}
      >
        <span className="icon inactive ion-ios-star vmp-fav-highlight"></span>
        <span className="vmp-active-text vmp-list-item">
          {bookmark.get('orgTitle')}
        </span>
        <span
          className="icon ion-ios-close-empty"
          onTouchTap={onTouch(removeOrgFromBookmarks, controller, _Map({int_id: orgId}))}></span>
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
          {bookmarks.toJS()}
        </div>
      </div>
    );
  }
});

module.exports = SettingsView;
