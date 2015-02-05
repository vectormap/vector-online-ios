var Api        = require('api');
var imm        = require('immutable').fromJS;
var P          = require('bluebird');
var translator = require('i18n/translator');
var page       = require('page');
var _          = require('lodash');

var {Catalog}  = Api;
var {
  prepareSearchResults
} = require('./models/SearchModel');

var rootBinding;
var bCityConfig;
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

function setStatus (status) {
  rootBinding.set('status', status);
}

var status = {
  loading () {
    setStatus('loading');
  },

  error (err) {
    setStatus(imm(err));
  },

  clear () {
    setStatus(null);
  }
};

function navigate (route) {
  var city = bCityConfig.get('city.alias');

  page(`/city/${city}${route}`);
}

function navigateSilent (route) {
  var city = bCityConfig.get('city.alias');

  page.replace(`/city/${city}${route}`, null, null, false);
}

function city () {
  return bCityConfig.get('city.alias');
}

var Controller = {
  init (binding) {
    rootBinding    = binding;
    bCityConfig    = rootBinding.sub('cityConfig');
    bSearch        = rootBinding.sub('search');
    bSearchQuery   = bSearch.sub('query');
    bSearchItem    = bSearch.sub('item');
    bSearchResults = bSearch.sub('results');

    this.attachListeners();

    page.redirect('/', `/city/${rootBinding.get('currentCity')}`);

    // All routes will flow through the base '/city/:city/(.*)?' route
    page('/city/:city/(.*)?', (ctx, next) => {
      var {city} = ctx.params;
      var restRoute = ctx.params[0];

      console.log('city route', `/city/${city}`);

      if (!restRoute) {
        unsetSearchView();
      }

      P.resolve(this.loadCityConfig(city)).then(next);
    });

    page('/city/:city/view/:view/(.*)?', (ctx, next) => {
      var {view} = ctx.params;

      console.log('view route', `/city/:city/view/${view}/`);

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

  },

  start () {

  },

  loadCityConfig (city) {
    if (bCityConfig.get('city.alias') === city) {
      return;
    }

    return Api
      .getCityConfig(city)
      .then(config => {
        bCityConfig.set(imm(config));
      });
  },

  startSearch () {
    // Navigate once to search route when search field got focus.
    // This is the fixed point to replace it with search/:query route
    // that gives the ability to travel back to base previous route.
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

    bSearch.set('type', searchType);
    bSearch.set('query', query);

    status.loading();

    if (searchType === 'query') {
      // standard search by query string
      searchPromise = Catalog.search(city(), query, {suggest: true});
    } else {
      // get organizations by rubric or address id
      var itemType = searchType;
      var itemId = query;

      searchPromise = Catalog.getOrganizationsBy(city(), itemType, itemId, {suggest: true});
    }

    P.resolve(searchPromise).then(results => {
      results = prepareSearchResults(results);
      bSearchResults.set(imm(results));
      bSearch.set('view.tab', (_.first(results) || {}).collection);
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
      Catalog.getFromCollection(city(), collection, itemId, {coords: false})).then(item => {
        bSearch.set('item', imm(item));
        setSearchView('item');
        status.clear();
      }).error(status.error);
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

  navToMapAddress (addressId) {

  }

};

module.exports = Controller;
