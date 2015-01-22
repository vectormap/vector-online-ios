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
var B          = require('backbone');
var $          = require('jquery');
var React      = require('react/addons');
var Imm        = require('immutable');
var moment     = require('moment');
var MainLayout = require('./ui/MainLayout');
var MenuLayout = require('./ui/MenuLayout');
var L          = require('leaflet');
var controller = require('./controller');
var api        = require('api');
var cx         = React.addons.classSet;

L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images'

require('moment/locale/ru');

moment.locale('ru');

B.$           = $;
window._      = _;
window.Imm    = Imm;
window.React  = React;
window.$      = $;
window.B      = window.Backbone = B;
window.moment = moment;
window.api    = api;

var AppState = {
  cityConfig: {
    status: 'loading' // waiting for config by default
  },
  menuOpen: false,
  search: {
    view: '', // history, suggestions, results
    term: '',
    history: [{title: 'история поиска [stub]'}, {title: 'ленина 45 [stub]'}, {title: 'аура [stub]'}],
    suggestions: [{title: 'Вектор'}, {title: 'Аврора'}, {title: 'Сити Молл'}],
    results: [],
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

var App = React.createClass({
  mixins: [M.Mixin],

  componentDidMount: function () {
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([61.253983635981406, 73.39646100997925], 16);

    L.tileLayer('http://tiles.{s}.st.vmp.ru/{z}/{x}/{y}.png', {
      minZoom: 10,
      maxZoom: 18,
      detectRetina: true
    }).addTo(map);
  },

  render: function () {
    var binding = this.getBinding();
    var menuOpenCls = cx({'vmp-menu-open': binding.get('menuOpen')})

    return (
      <div className="view-container" nav-view-transition="ios" nav-view-direction="none">
        <div className="pane view" nav-view="active">
          <div className="menu menu-left">
            <MenuLayout />
          </div>

          <div className={'menu-content pane menu-animated ' + menuOpenCls}>
            <MainLayout binding={binding} />
          </div>
        </div>
      </div>
    );
  }
});

var Bootstrap = Ctx.bootstrap(App);

React.render(<Bootstrap />, document.getElementById('root'));

