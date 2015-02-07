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

var _          = require('lodash');
var React      = require('react/addons');
var Imm        = require('immutable');
var moment     = require('moment');
var L          = require('leaflet');
var controller = require('./controller');
var mapController = require('map-controller');
var api        = require('api');
var MainLayout = require('./ui/MainLayout');

L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images';

require('moment/locale/ru');

moment.locale('ru');

window._      = _;
window.Imm    = Imm;
window.React  = React;
window.moment = moment;
window.api    = api;

// TODO: load saved settings to state from localStorage

var AppState = {
  cityConfig: {},
  currentCity: 'surgut',
  lang: 'ru',
  pageView: 'map', // default view is map
  search: {
    view: {
      name: '', // results, item, notFound, error
      tab: '' // organizations, rubrics, addresses
    },
    type: '', // query, address, rubric
    query: '', // query string or item id
    results: [],
    item: null
  },
  map: {
    popup: {
      address: {},
      organization: {} // show selected organization info with address
    }
  },
  status: ''
};

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

controller.init(rootBinding);
mapController.init(rootBinding);

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

React.initializeTouchEvents(true);
React.render(<Bootstrap />, document.getElementById('root'));

