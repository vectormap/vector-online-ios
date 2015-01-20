var _            = require('lodash');
var B            = require('backbone');
var $            = require('jquery');
var M            = require('morearty');
var MoreartySync = require ('morearty-sync');
var React        = require('react');
var Imm          = require('immutable');
var moment       = require('moment');
var MainLayout   = require('./ui/MainLayout');
var MenuLayout   = require('./ui/MenuLayout');
var L            = require('leaflet');

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

var AppState = {

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

var App = React.createClass({
  displayName: 'App',
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

    return (
      <div className="view-container" nav-view-transition="ios" nav-view-direction="none">
        <div className="pane view" nav-view="active">
          <div className="menu menu-left">
          </div>
          <div className="menu-content pane menu-animated">
            <MainLayout />
          </div>
        </div>
      </div>
    );
  }
});

var Bootstrap = Ctx.bootstrap(App);

React.render(<Bootstrap />, document.getElementById('root'));

