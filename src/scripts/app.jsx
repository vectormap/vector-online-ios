var M = require('morearty');

M.Util.toggleBinding = function (binding, subpath) {
  var args = M.Util.resolveArgs(
    arguments,
    function (x) { return x instanceof M.Binding ? 'binding' : null; }, '?subpath'
  );

  var value = args.binding.get(args.subpath);
  args.binding.set(args.subpath, !value);
};

// TODO: push to Morearty repo
M.Callback.toggle = function (binding, subpath) {
  return function () {
    M.Util.toggleBinding(binding, subpath);
  };
};

var _                        = require('lodash');
var React                    = require('react/addons');
var Imm                      = require('immutable');
var moment                   = require('moment');
var L                        = require('leaflet');
var api                      = require('api');
var MainLayout               = require('./ui/MainLayout');
var controller               = require('./controller');
var mapController            = require('map-controller');
var statusController         = require('status-controller');
var networkMonitorController = require('network-monitor-controller');
var Store                    = require('store');
var injectTapEventPlugin     = require('react-tap-event-plugin');
var U                        = require('utils');
var analytics                = require('analytics');

L.Icon.Default.imagePath = 'images';

require('moment/locale/ru');

moment.locale('ru');

window._      = _;
window.Imm    = Imm;
window.React  = React;
window.moment = moment;
window.api    = api;

function syncWithLocalStorage (binding, keys) {
  [].concat(keys).forEach(key => {
    binding.addListener(key, () => {
      Store.set(key, rootBinding.toJS(key));
    });
  });
}

function initUserSession () {
  var userId = Store.get('user-id');
  var sessionId = U.UUID();

  if (!userId) {
    userId = U.UUID();
    Store.set('user-id', userId);
  }

  Store.set('session-id', sessionId);

  return {userId, sessionId};
}

var AppState = {
  cityConfig: {},
  allCityConfigs: [],
  currentCity: '',
  lang: 'ru',
  pageView: 'map', // map, search, bookmarks, settings
  bookmarks: {}, // {surgut: [{orgId: '', orgTitle: ''}, ...]}
  search: {
    view: {
      name: '', // history, results, item, noResults, error
      tab: '' // organizations, rubrics, addresses
    },
    type: '', // query, address, rubric
    query: '',
    itemId : '',
    itemCollection: '',
    results: [],
    item: null,
    queryHistory: {}, // save search history by city: {surgut: [...], ...}
    pages: {
      query: {
        organizations: 1,
        addresses: 1,
        rubrics: 1
      },
      byItemType: 1
    }
  },
  map: {
    popup: {
      open: false,
      loading: false,
      geoData: {},
      orgData: {
        address: {},
        organization: {} // show selected organization info with address
      }
    }
  },
  status: '',
  noConnection: false, // show NoConnectionModal if connection is absent
  modal: '', // citySelector
  location: {
    infoModal: false,
    content: '',
    error: ''
  }
};

AppState.session             = initUserSession();
AppState.firstLaunch         = Store.get('firstLaunch') === undefined;
AppState.currentCity         = Store.get('currentCity') || 'surgut';
AppState.lang                = Store.get('lang') || 'ru';
AppState.search.queryHistory = Store.get('search.queryHistory') || {};
AppState.bookmarks           = Store.get('bookmarks') || {};

var Ctx = M.createContext({
  initialState: AppState,
  initialMetaState: {},
  configuration: {
    requestAnimationFrameEnabled: true,
    stopOnRenderError: false
  }
});

window.Ctx = Ctx; // for debug
var rootBinding = window.rootBinding = Ctx.getBinding();

syncWithLocalStorage(rootBinding, [
  'firstLaunch', 'currentCity', 'lang', 'search.queryHistory', 'bookmarks'
]);

window.controller = controller;
window.mapController = mapController;


var App = React.createClass({
  mixins: [M.Mixin],

  componentDidMount () {
    console.log('App componentDidMount');
    controller.start();
  },

  render: function () {
    return (
      <MainLayout binding={this.getBinding()} />
    );
  }
});

var Bootstrap = Ctx.bootstrap(App);


module.exports = {
  start () {
    analytics.startTrackerWithId('UA-25890037-3');
    analytics.trackView('Vector Online iOS start');

    controller.init(rootBinding);
    mapController.init(rootBinding);
    statusController.init(rootBinding.sub('status'));
    networkMonitorController.init(rootBinding);

    injectTapEventPlugin();
    React.initializeTouchEvents(true);
    React.render(<Bootstrap />, document.getElementById('root'));
  }
};
