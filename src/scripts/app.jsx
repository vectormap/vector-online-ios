var _            = require('lodash');
var B            = require('backbone');
var $            = require('jquery');
var M            = require('morearty');
var MoreartySync = require ('morearty-sync');
var React        = require('react');
var Imm          = require('immutable');
var moment       = require('moment');

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
    stopOnRenderError: true
  }
});

window.Ctx      = Ctx; // for debug
var rootBinding = Ctx.getBinding();

var App = React.createClass({
  displayName: 'App',
  mixins: [M.Mixin],

  render: function () {
    var binding = this.getBinding();

    return (
      <div></div>
    );
  }
});

var Bootstrap = Ctx.bootstrap(App);

React.render(<Bootstrap />, document.getElementById('root'));

