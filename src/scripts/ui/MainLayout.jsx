var M             = require('morearty');
var React         = require('react/addons');
var SearchBar     = require('./SearchBar');
var MapView       = require('./MapView');
var SearchView    = require('./SearchView');
var BookmarksView = require('./BookmarksView');
var SettingsView  = require('./SettingsView');

var cx = React.addons.classSet;
var pages = ['map', 'search', 'bookmarks', 'settings'];
var pageViews = {
  'map': {
    view: MapView,
    tabIcon: 'ion-map'
  },
  'search': {
    view: SearchView,
    tabIcon: 'ion-ios7-search-strong'
  },
  'bookmarks': {
    view: BookmarksView,
    tabIcon: 'ion-ios7-star-outline'
  },
  'settings': {
    view: SettingsView,
    tabIcon: 'ion-ios7-gear-outline'
  }
};

var MainLayout = React.createClass({
  mixins: [M.Mixin],

  onTabClicked (page) {
    this.getBinding().set('pageView', page);
  },

  renderTab (page, activePage) {
    var icon = pageViews[page].tabIcon;
    var cls = cx({
      'tab-item': true,
      'active': page === activePage
    });

    return (
      <a className={cls} key={`tab-page-${page}`} onClick={this.onTabClicked.bind(this, page)}>
        <i className={`icon ${icon}`}></i>
      </a>
    );
  },

  render () {
    var binding = this.getBinding();
    var currentPage = binding.get('pageView');
    var PageView = pageViews[currentPage].view;
    var pageBinding = binding.sub(currentPage);
    var showSearchBar = currentPage === 'map' || currentPage === 'search';

    var tabs = pages.map(page => this.renderTab(page, currentPage));

    return (
      <div className="view-container" nav-view-transition="ios" nav-view-direction="none">
        {showSearchBar &&
          <SearchBar binding={binding} />}
        <div id="map" className="view-container" />
        <div className="view-container" nav-view-transition="ios" nav-view-direction="none">
          <PageView binding={pageBinding} />
        </div>

        <div className="tabs tabs-icon-only">
          {tabs}
        </div>
      </div>
    );
  }

});

module.exports = MainLayout;
