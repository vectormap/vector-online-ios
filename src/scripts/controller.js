var Api        = require('api');
var imm        = require('immutable').fromJS;
var P          = require('bluebird');
var translator = require('i18n/translator');
var page       = require('page');

var {Catalog}  = Api;

var {
  prepareSearchResults
} = require('./models/SearchModel');

var rootBinding;
var bCityConfig;
var bSearch;
var bSearchTerm;
var bSearchResults;
var bSearchItem;

const defaultLang = 'ru';

function setSearchView (view) {
  bSearch.set('view', view);
}

function unsetSearchView () {
  bSearch.clear('view');
}

function setStatus (status) {
  rootBinding.set('status', status);
}

var status = {
  loading () {
    setStatus('loading');
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

  page.show(`/city/${city}${route}`, null, false);
}

function city () {
  return bCityConfig.get('city.alias');
}

var Controller = {
  init (binding) {
    rootBinding    = binding;
    bCityConfig    = rootBinding.sub('cityConfig');
    bSearch        = rootBinding.sub('search');
    bSearchTerm    = bSearch.sub('term');
    bSearchItem    = bSearch.sub('item');
    bSearchResults = bSearch.sub('results');

    this.attachListeners();

    // All routes will flow through the base '/city/:city/(.*)?' route

    page.redirect('/', `/city/${rootBinding.get('currentCity')}`);

    page('/city/:city/(.*)?', (ctx, next) => {
      var {city} = ctx.params;
      var restRoute = ctx.params[0];

      console.log('city route', `/city/${city}`);

      if (!restRoute) {
        unsetSearchView();
      }

      P.resolve(this.loadCityConfig(city)).then(next);
    });

    page('/city/:city/card/search/:query', ctx => {
      var {city, query} = ctx.params;

      console.log('search route', `/city/${city}/card/search/${query}`);

      this.processSearch(query);
    });

    page('/city/:city/card/item/:collection/:id', ctx => {
      var {city, collection, id} = ctx.params;

      console.log('item route', `/city/${city}/card/show/${collection}/${id}/`);

      // setSearchView()
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

  toggleSearchResultsView () {
    if (bSearchTerm.get()) {
      setSearchView('results');
    } else {
      unsetSearchView();
    }
  },

  loadCityConfig (city) {
    if (bCityConfig.get('city.alias') === city) {
      return;
    }

    return Api
      .getCityConfig(city)
      .then(config => {
        console.log('>>', config);

        bCityConfig.set(imm(config));
      });
  },

  onSearchTyped (event) {
    var query = event.target.value;

    // bSearchTerm.set(query);
    navigateSilent(`/card/search/${query}`);
    this.processSearch(query);
  },

  processSearch (query) {
    // var query = bSearchTerm.get();

    P.resolve(this.search(query))
      .then(() => setSearchView('results'))
      .error(() => setSearchView('error'));
  },

  search (query) {
    status.loading();

    P.resolve(Catalog.search(city(), query, {suggest: true})).then((results) => {
      results = prepareSearchResults(results);
      bSearchResults.set(imm(results));
    })
    .error(err => console.error('search', err))
    .finally(status.clear);
  },


};

module.exports = Controller;
