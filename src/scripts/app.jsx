var M = require('morearty');

// TODO: push to Morearty repo
M.Callback.toggle = function (binding, subpath) {
  var args = M.Util.resolveArgs(
    arguments,
    function (x) { return x instanceof M.Binding ? 'binding' : null; }, '?subpath'
  );

  return function () {
    var value = args.binding.get(args.subpath);
    args.binding.set(args.subpath, !value);
  };
};

var _                    = require('lodash');
var React                = require('react/addons');
var Imm                  = require('immutable');
var moment               = require('moment');
var L                    = require('leaflet');
var api                  = require('api');
var MainLayout           = require('./ui/MainLayout');
var controller           = require('./controller');
var mapController        = require('map-controller');
var statusController     = require('status-controller');
var Store                = require('store');
var injectTapEventPlugin = require("react-tap-event-plugin");

L.Icon.Default.imagePath = '/images';

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
      Store.set(key, rootBinding.get(key));
    });
  });
}

var AppState = {
  cityConfig: {},
  allCityConfigs: [],
  currentCity: '',
  lang: 'ru',
  pageView: 'map', // map, search, bookmarks, settings
  search: {
    view: {
      name: '', // history, results, item, noResults, error
      tab: '' // organizations, rubrics, addresses
    },
    type: '', // query, address, rubric
    query: '',
    itemId : '',
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
  modal: '' // citySelector, noConnection
};

AppState.currentCity = Store.get('currentCity') || 'surgut';
AppState.lang = Store.get('lang') || 'ru';
AppState.search.queryHistory = Store.get('search.queryHistory') || {};
AppState.firstLaunch = Store.get('firstLaunch') === undefined;


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

syncWithLocalStorage(rootBinding, ['firstLaunch', 'currentCity', 'lang', 'search.queryHistory']);

window.controller = controller;
window.mapController = mapController;


var App = React.createClass({
  mixins: [M.Mixin],

  render: function () {
    return (
      <MainLayout binding={this.getBinding()} />
    );
  }
});

var Bootstrap = Ctx.bootstrap(App);


module.exports = {
  start () {
    controller.init(rootBinding);
    mapController.init(rootBinding);
    statusController.init(rootBinding.sub('status'));
    controller.start();

    injectTapEventPlugin();
    React.initializeTouchEvents(true);
    React.render(<Bootstrap />, document.getElementById('root'));
  }
};
