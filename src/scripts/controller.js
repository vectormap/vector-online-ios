var _             = require('lodash');
var Api           = require('api');
var imm           = require('immutable').fromJS;
var P             = require('bluebird');
var translator    = require('i18n/translator');
var page          = require('page');
var mapController = require('map-controller');
var status        = require('status-controller');

var {Catalog}  = Api;
var {
  prepareSearchResults
} = require('./models/SearchModel');

var rootBinding;
var bSearch;
var bSearchQuery;
var bSearchResults;
var bSearchItem;

var searchRouteTransitions = {
  'rubrics': 'rubric',
  'addresses': 'address'
};

const defaultLang = 'ru';
const SEARCH_TYPES = ['query', 'address', 'rubric'];

function setPageView (view) {
  rootBinding.set('pageView', view);
}

function setSearchView (view) {
  bSearch.set('view.name', view);
}

function unsetSearchView () {
  bSearch.clear('view.name');
}

function currentCity () {
  return rootBinding.get('currentCity');
}

function navigate (route) {
  page(`/city/${currentCity()}${route}`);
}

function navigateSilent (route) {
  page.replace(`/city/${currentCity()}${route}`, null, null, false);
}


var Controller = {
  init (binding) {
    rootBinding    = binding;
    bSearch        = rootBinding.sub('search');
    bSearchQuery   = bSearch.sub('query');
    bSearchItem    = bSearch.sub('item');
    bSearchResults = bSearch.sub('results');

    this.attachListeners();

    var currentCity = rootBinding.get('currentCity');

    page.redirect('/', `/city/${currentCity}/view/map`);

    // All routes will flow through the base '/city/:city/(.*)?' route
    page('/city/:city/(.*)?', (ctx, next) => {
      var {city} = ctx.params;
      var restRoute = ctx.params[0];

      console.log('city route', `/city/${city}`, '->');
      console.log('>>> rest route', restRoute);

      // if (!restRoute) {
      //   console.log('replacing view to map');
      //   page.replace(`/city/${city}/view/map`, null, null, false);
      // }

      P.resolve(this.loadCityConfig(city)).then(next);
    });

    page('/city/:city/view/:view/(.*)?', (ctx, next) => {
      var {view} = ctx.params;

      console.log('view route', `/city/:city/view/${view}/`, '->');

      setPageView(view);
      next();
    });

    // search by type: query, address, rubric
    page('/city/:city/view/search/:type/:query', ctx => {
      var {city, type, query} = ctx.params;

      console.log('search route', `/city/${city}/view/search/${type}/${query}`);

      this.processSearch(type, query);
    });

    page('/city/:city/view/search/item/:collection/:id', ctx => {
      var {city, collection, id} = ctx.params;

      console.log('item route', `/city/${city}/item/${collection}/${id}/`);

      this.loadItem(collection, id);
    });

    page('*', () => console.log('Route: *'));

    page.start({click: false});

    window.page = page;
  },

  t (key) {
    var lang = rootBinding.get('lang') || defaultLang;

    return translator.t(lang, key);
  },

  attachListeners () {
    rootBinding.addListener('pageView', () => {
      if (rootBinding.get('pageView') !== 'map') {
        rootBinding.set('map.popup.open', false);
      }
    });
  },

  start () {

  },

  loadCityConfig (city) {
    if (currentCity() === rootBinding.get('cityConfig.city.alias')) {
      return;
    }

    return Api
      .getCityConfig(city)
      .then(config => {
        rootBinding.set('cityConfig', imm(config));
        rootBinding.set('currentCity', config.city.alias);
        mapController.updateMap();
      }).catch((err, x) => {
        console.log('error >>>', err, x);
      });
  },

  startSearch () {
    // Navigate once to search route when search field got focus.
    // This is the fixed point to replace it with search/:query route
    // that gives the ability to travel back to previous route.
    if (!page.current.match(/city\/.*\/view\/search\/query.*/)) {
      console.log('Starting search [focus]');
      navigate('/view/search/query');
    }
  },

  onSearchTyped (event) {
    var query = event.target.value;

    navigateSilent(`/view/search/query/${query}`);
    this.processSearch('query', query);
  },

  processSearch (searchType, query) {
    return P.resolve(this.search(searchType, query))
      .then(() => setSearchView('results'));
  },

  search (searchType, query) {
    var searchPromise;

    if (SEARCH_TYPES.indexOf(searchType) < 0) {
      throw new Error(`controller.search: incorrect search type: ${searchType}. Should be in: ${SEARCH_TYPES}`);
    }

    if (bSearch.get('type') === searchType && bSearch.get('query') === query) {
      return;
    }

    bSearch.set('type', searchType);
    bSearch.set('query', query);

    status.loading();

    if (searchType === 'query') {
      // standard search by query string
      searchPromise = Catalog.search(currentCity(), query, {suggest: true});
    } else {
      // get organizations by rubric or address id
      var itemType = searchType;
      var itemId = query;

      searchPromise = Catalog.getOrganizationsBy(currentCity(), itemType, itemId, {suggest: true});
    }

    P.resolve(searchPromise).then(results => {
      results = prepareSearchResults(results);
      var firstResult = _.find(results, r => r.data.result_count > 0) || {};
      bSearchResults.set(imm(results));
      bSearch.set('view.tab', firstResult.collection);
      status.clear();
    })
    .catch(err => {
      status.error(err);
      console.error('search', err);
    });
  },

  loadItem (collection, itemId) {
    status.loading();

    return P.resolve(
      Catalog.getFromCollection(currentCity(), collection, itemId, {coords: false})).then(item => {
        bSearch.set('item', imm(item));
        setSearchView('item');
        status.clear();
      }).error(status.error);
  },

  navToPage (page) {
    if (page === rootBinding.get('pageView')) {
      return;
    }

    // Pass only 'map' and 'search' views through router.
    // Bookmarks and settings acts as "modal" views.
    if (page === 'map') {
      navigate('/view/map');
    } else if (page === 'search') {
      var route = '/view/search';
      var searchType = bSearch.get('type');
      var query = bSearch.get('query');

      if (searchType) {
        route += `/${searchType}`;
      }

      if (query) {
        route += `/${query}`;
      }

      navigate(route);
    } else {
      setPageView(page);
    }
  },

  navToSearchByItem (collection, itemId) {
    var route;

    if (collection === 'organizations') {
      route = `/view/search/item/organizations/${itemId}`;
    } else {
      var searchType = searchRouteTransitions[collection];
      route = `/view/search/${searchType}/${itemId}`;
    }

    navigate(route);
  },

  navToMapWithPopup ({address, organization}) {
    this.navToPage('map');
    mapController.showPopup({orgData: {address, organization}});
  },

  navBack () {
    page.back();
  },

  hasNavHistory () {
    return page.len > 0;
  }

};

module.exports = Controller;
