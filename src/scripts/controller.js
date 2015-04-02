var _             = require('lodash');
var Api           = require('api');
var Imm           = require('immutable');
var P             = require('bluebird');
var translator    = require('i18n/translator');
var page          = require('page');
var mapController = require('map-controller');
var status        = require('status-controller');
var stat          = require('stat-tracker');
var AddressModel  = require('models/AddressModel');

var imm = Imm.fromJS;
var {List, Map: _Map} = Imm;
var {Catalog}  = Api;
var {prepareSearchResults} = require('./models/SearchModel');
var {result} = Api;
var {withOrg} = stat;

var rootBinding;
var bSearch;
var bSearchQuery;
var bSearchResults;
var bSearchItem;

const LANGS = [
  {code: 'ru', name: 'Русский'},
  {code: 'az', name: 'Azərbaycan'},
  {code: 'en', name: 'English'}
];

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

function collectionResultsIndex (collection) {
  return bSearch.get('results').findIndex(r => r.get('collection') === collection);
}

function _hasNextPage (result, currentPage) {
  return result && (currentPage < result.data.page_count);
}

function detectLang () {
  return new P(resolve => {
    if (navigator.globalization) {
      navigator.globalization.getPreferredLanguage(
        ({value = ''}) => {
          value.toLowerCase().indexOf('ru') >= 0 ? resolve('ru') : resolve('en');
        },
        err => {
          resolve('ru');
        });
    } else {
      resolve('ru');
    }
  });

}

function blurSearchInput () {
  var input = document.getElementById('vmp-search-input');

  if (input) {
    input.blur();
  }
}

var Controller = {
  init (binding) {
    rootBinding    = binding;
    bSearch        = rootBinding.sub('search');
    bSearchQuery   = bSearch.sub('query');
    bSearchItem    = bSearch.sub('item');
    bSearchResults = bSearch.sub('results');

    this.attachListeners();

    page.redirect('/', `/city/${currentCity()}/view/map`);

    // fix: https://github.com/visionmedia/page.js/issues/18
    if (window.cordova) {
      page({ dispatch: false}); // turn off auto dispatching
      page('/'); // force trigger the initial root page
    }

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

      if (view !== 'search') {
        blurSearchInput();
      }

      setPageView(view);
      next();
    });

    // search by type: query, address, rubric
    page('/city/:city/view/search/:type/:queryOrItemId', ctx => {
      var {city, type, queryOrItemId} = ctx.params;

      console.log('search route', `/city/${city}/view/search/${type}/${queryOrItemId}`);

      this.search(type, queryOrItemId);

      if (type !== 'query') {
        blurSearchInput();
      }
    });

    page('/city/:city/view/search/item/:collection/:id', ctx => {
      var {city, collection, id} = ctx.params;

      console.log('item route', `/city/${city}/item/${collection}/${id}/`);

      this.loadItem(collection, id);
      blurSearchInput();
    });

    page.exit('/city/:city/view/search/query/:query?', (context, next) => {
      console.log(`exiting from 'search/query/:query?' route, saving search '${bSearch.get('query')}'`);
      this.saveSearchQuery();
      next();
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
    rootBinding.addListener('pageView', (changes) => {
      if (rootBinding.get('pageView') !== 'map') {
        rootBinding.set('map.popup.open', false);
      }
    });
  },

  onFirstLaunch () {
    if (rootBinding.get('firstLaunch')) {
      console.log('[First launch]');

      rootBinding.set('firstLaunch', false);

      detectLang().then(lang => {
        rootBinding.set('lang', lang);
        this.showCitySelectorModal();
      });
    }
  },

  start () {
    this.onFirstLaunch();
  },

  loadCityConfig (city) {
    if (city === rootBinding.get('cityConfig.city.alias')) {
      return;
    }

    return P.resolve(Api.getCityConfig(city))
      .then(config => {
        rootBinding.set('cityConfig', imm(config));
        rootBinding.set('currentCity', config.city.alias);
        mapController.updateMap();
      })
      .catch(status.error);
  },

  loadAllCityConfigs () {
    status.loading();

    P.resolve(Api.getAllCityConfigs()).then(cityConfigs => {
      rootBinding.set('allCityConfigs', imm(cityConfigs));
      status.clear();
    })
    .catch(status.error);
  },

  onSearchFocused () {
    this.tryToSetSearchHistoryView();

    // Navigate once to search route when search field got focus.
    // This is the fixed point to replace it with search/:query route
    // that gives the ability to travel back to previous route.
    if (!page.current.match(/city\/.*\/view\/search\/query.*/)) {
      console.log('Starting search [focus]');
      // var query = bSearch.get('query') || '';

      navigate(`/view/search/query`);
    }
  },

  onSearchEnter (event) {
    blurSearchInput();
    this.onSearchTyped(event);
  },

  onSearchTyped (event) {
    var query = event.target.value;

    this.searchByQuery(query);
  },

  searchByQuery (query) {
    navigateSilent(`/view/search/query/${query}`);

    if (!query) {
      bSearch.set('query', query);
      this.tryToSetSearchHistoryView();
    } else {
      this.search('query', query);
    }

  },

  clearSearchQuery () {
    bSearch.clear('query');
    this.onSearchFocused();
  },

  tryToSetSearchHistoryView () {
    if (!bSearch.get('query')) {
      setSearchView('history');
    }
  },

  search (searchType, queryOrItemId) {
    var searchPromise;

    if (SEARCH_TYPES.indexOf(searchType) < 0) {
      throw new Error(`controller.search: incorrect search type: ${searchType}. Should be in: ${SEARCH_TYPES}`);
    }

    // if (bSearch.get('type') === searchType &&
    //     (bSearch.get('query') === queryOrItemId || bSearch.get('itemId') === queryOrItemId)) {

    //   setSearchView('results');
    //   return;
    // }

    this.resetPages();
    status.loading();

    bSearch.set('type', searchType);

    if (searchType === 'query') {
      var query = queryOrItemId;

      stat.search.query('name', {name: query});

      bSearch.set('query', query);
      // standard search by query string
      searchPromise = Catalog.searchAll(currentCity(), query, {suggest: true});
    } else {
      // get organizations by rubric or address id
      var itemType = searchType;
      var itemId = queryOrItemId;

      bSearch.set('itemId', itemId);
      searchPromise = Catalog.getOrganizationsBy(currentCity(), itemType, itemId, {suggest: true});
    }

    return P.resolve(searchPromise).then(results => {
      results = prepareSearchResults(results);
      var firstResult = _.find(results, r => r.data.result_count > 0) || {};
      bSearchResults.set(imm(results));
      setSearchView(this.hasSearchResults() ? 'results' : 'noResults');
      bSearch.set('view.tab', firstResult.collection);
      status.clear();
    })
    .catch(status.error);
  },

  loadItem (collection, itemId) {
    status.loading();

    var itemPromise = Catalog.getFromCollection(currentCity(), collection, itemId, {coords: false});

    return P.resolve(itemPromise).then(item => {
      var _result = result(item)[0] || {};

      if (collection === 'organizations') {
        stat.card.open('org', withOrg(_result));
      }

      bSearch
        .set('item', imm(item))
        .set('type', 'item')
        .set('itemCollection', collection)
        .set('itemId', _result.int_id);

      setSearchView('item');
      status.clear();
    })
    .catch(status.error);
  },

  loadNextPage () {
    if (!this.hasNextPage()) {
      return;
    }

    status.loading();

    var searchType = bSearch.get('type');
    var searchPromise;
    var resultsBinding;
    var nextPage;
    var pageBinding;

    if (searchType === 'query') {
      var q = bSearch.get('query');
      var collection = bSearch.get('view.tab');
      var resultsIndex = collectionResultsIndex(collection);

      pageBinding = bSearch.sub(`pages.query.${collection}`);
      nextPage = pageBinding.get() + 1;
      resultsBinding = bSearch.sub(`results.${resultsIndex}.data.result`);
      searchPromise = Catalog.search(currentCity(), collection, q, {page: nextPage, suggest: true});
    } else {
      var itemType = searchType;
      var itemId = bSearch.get('itemId');

      pageBinding = bSearch.sub(`pages.byItemType`);
      resultsBinding = bSearch.sub('results.0.data.result');
      nextPage = pageBinding.get() + 1;
      searchPromise = Catalog.getOrganizationsBy(currentCity(), itemType, itemId, {page: nextPage, suggest: true});
    }

    P.resolve(searchPromise).then(nextResults => {
      [nextResults] = prepareSearchResults(nextResults);
      pageBinding.set(nextResults.data.page);

      resultsBinding.update(results => {
        return results.concat(imm(nextResults.data.result));
      });

      status.clear();
    })
    .catch(status.error);
  },

  hasNextPage () {
    var result;
    var currentPage;
    var results = bSearch.get('results');

    if (bSearch.get('type') === 'query') {
      var collection = bSearch.get('view.tab');

      currentPage = bSearch.get(`pages.query.${collection}`);
      result = results.find(r => r.get('collection') === collection);
    } else {
      currentPage = bSearch.get('pages.byItemType');
      result = results.get(0);
    }

    return _hasNextPage(result.toJS(), currentPage);
  },

  hasSearchResults () {
    var results = bSearch.get('results');
    var resultsCount = results && results.reduce(
      (count, result) => count + result.getIn(['data', 'result']).size, 0);

    return resultsCount > 0;
  },

  getCurrentSearchHistory () {
    return bSearch.get(`queryHistory.${currentCity()}`);
  },

  saveSearchQuery () {
    var query = (bSearch.get('query') || '').trim();

    if (!query) {
      return;
    }

    bSearch.update(`queryHistory.${currentCity()}`, history => {
      if (history) {
        var queryIndex = history.indexOf(query);

        // if query is already saved, remove it from its place
        if (queryIndex >= 0) {
          history = history.remove(queryIndex);
        }

        history = history.unshift(query);
      } else {
        history = List.of(query);
      }

      return history;
    });
  },

  setSearchQuery (query) {
    bSearch.set('query', query);
  },

  deleteHistoryItem (index) {
    bSearch.update(`queryHistory.${currentCity()}`, history => history.remove(index));
  },

  showCitySelectorModal () {
    rootBinding.set('modal', 'citySelector');
    this.loadAllCityConfigs();
  },

  switchCity (cityAlias) {
    // rootBinding.set('currentCity', cityAlias);
    this.reset();
    page(`/city/${cityAlias}/view/map`);
    page.len = 0;
    // page.callbacks = [];
  },

  reset () {
    mapController.reset();
    bSearch
      .clear('view.name')
      .clear('type');

    this.resetSearchData();
  },

  resetSearchData () {
    bSearch
      .clear('query')
      .clear('item')
      .clear('itemId')
      .clear('itemCollection')
      .set('results', Imm.List());

    this.resetPages();
  },

  resetPages () {
    bSearch.set('pages', imm({
      query: {
        organizations: 1,
        addresses: 1,
        rubrics: 1
      },
      byItemType: 1
    }));
  },

  setLang (langCode) {
    rootBinding.set('lang', langCode);
  },

  getLangs () {
    return LANGS;
  },

  getCurrentLang () {
    return rootBinding.get('lang');
  },

  getBookmarks () {
    return rootBinding.get(`bookmarks.${currentCity()}`);
  },

  addOrgToBookmarks (org) {
    if (!org) {
      return;
    }

    rootBinding.update(`bookmarks.${currentCity()}`, bookmarks => {
      bookmarks = bookmarks || List();

      return bookmarks.push(_Map({
        orgId: org.get('int_id'),
        orgTitle: org.get('title')
      }));
    });
  },

  removeOrgFromBookmarks (org) {
    if (!org) {
      return;
    }

    rootBinding.update(`bookmarks.${currentCity()}`, bookmarks => {
      var index = this.findOrgBookmarkIndex(org);

      return bookmarks.remove(index);
    });
  },

  findOrgBookmarkIndex (org) {
    if (org) {
      var bookmarks = rootBinding.get(`bookmarks.${currentCity()}`);

      return bookmarks && bookmarks.findIndex(
        b => b.get('orgId') === org.get('int_id'));
    }
  },

  isOrgInBookmarks (org) {
    return this.findOrgBookmarkIndex(org) >= 0;
  },

  getCityConfig () {
    return rootBinding.toJS('cityConfig');
  },

  getSession () {
    return rootBinding.toJS('session');
  },

  // router navigation ----------------------------------------------------------------------------

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
      var itemId = bSearch.get('itemId');
      var itemCollection = bSearch.get('itemCollection');

      if (searchType === 'item') {
        this.navToSearchByItem(itemCollection, itemId);
        return;
      }

      if (searchType) {
        route += `/${searchType}`;
      }

      if (searchType === 'query') {
        route += `/${query}`;
      } else {
        route += `/${itemId}`;
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

  navToMapWithPopup ({latlng, addressId, address, organization, marker}) {
    if (address && organization) {
      stat.card.clickAddress('address', withOrg(organization, {
        adr_id: address.int_id,
        address: AddressModel.formatAddress(address)
      }));
    }

    this.navToPage('map');
    mapController.showPopup({latlng, addressId, orgData: {address, organization}, marker});
  },

  navBack () {
    page.back();
  },

  hasNavHistory () {
    return page.len > 0;
  }

};

module.exports = Controller;
