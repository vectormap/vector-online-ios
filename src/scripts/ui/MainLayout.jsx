var M                 = require('morearty');
var React             = require('react/addons');
var SearchBar         = require('./SearchBar');
var MapView           = require('./map/MapView');
var SearchView        = require('./SearchView');
var BookmarksView     = require('./BookmarksView');
var SettingsView      = require('./SettingsView');
var ActiveModal       = require('./ActiveModal');
var NoConnectionModal = require('./modals/NoConnectionModal');
var LocationInfoModal = require('./modals/LocationInfoModal');
var DonwloadLinksModal = require('./modals/DonwloadLinksModal.jsx');

var cx = React.addons.classSet;
var pages = ['map', 'search', 'bookmarks', 'settings'];
var pageViews = {
  'map': {
    view: 'div',
    tabIcon: 'ion-map'
  },
  'search': {
    view: SearchView,
    tabIcon: 'ion-ios-search'
  },
  'bookmarks': {
    view: BookmarksView,
    tabIcon: 'ion-ios-star-outline'
  },
  'settings': {
    view: SettingsView,
    tabIcon: 'ion-ios-gear-outline'
  }
};
var controller = require('controller');

var MainLayout = React.createClass({
  mixins: [M.Mixin],

  renderTab (page, activePage) {
    var icon = pageViews[page].tabIcon;
    var cls = cx({
      'tab-item': true,
      'active': page === activePage
    });

    return (
      <a className={cls} key={`tab-page-${page}`} onTouchEnd={controller.navToPage.bind(controller, page)}>
        <i className={`icon ${icon}`}></i>
      </a>
    );
  },

  render () {
    var binding = this.getBinding();
    var currentPage = binding.get('pageView');
    var PageView = pageViews[currentPage].view;
    var showSearchBar = currentPage === 'map' || currentPage === 'search';
    var tabs = pages.map(page => this.renderTab(page, currentPage));
    var containerCls = cx({
      'pane': currentPage !== 'map'
    });
    var pageContainerCls = cx({
      'view-container': currentPage !== 'map'
    });

    return (
      <div>
        <MapView binding={binding.sub('map')} />
        <div className={containerCls} key={`lang-${binding.get('lang')}`}>
          {showSearchBar &&
            <SearchBar binding={binding} />}
          <div className={pageContainerCls}>
            <PageView binding={binding} />
          </div>

          <ActiveModal binding={binding} />
          <NoConnectionModal binding={binding} />
          <LocationInfoModal binding={binding.sub('location')} />
          {!window.cordova &&
            <DonwloadLinksModal binding={binding} />}

          <div className="tabs tabs-icon-only disable-user-behavior vmp-tabs">
            {tabs}
          </div>
        </div>
      </div>
    );
  }

});

module.exports = MainLayout;
