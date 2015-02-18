var React = require('react/addons');
var M = require('morearty');
var controller = require('controller');
var {setLang, t} = controller;
var cx = React.addons.classSet;

var SettingsView = React.createClass({
  mixins: [M.Mixin],

  render () {
    var currentLang = this.getBinding().get('lang');
    var cityName = this.getBinding().get('cityConfig.city.name');

    var langs = controller.getLangs().map(l => {
      var langCls = cx({
        'item-content vmp-list-item lang-item': true,
        'vmp-list-item-activated': l.code === currentLang
      });

      return (
        <div className="item item-complex" onClick={setLang.bind(controller, l.code)}>
          <div className={langCls}>
            <span className="badge badge-positive vmp-uppercase-title">{l.code}</span>
            <span>{l.name}</span>
          </div>
        </div>
      );
    });

    return (
      <div className="pane">
        <div className="bar-stable bar bar-header disable-user-behavior">
          <h1 className="title">{t('settings')}</h1>
        </div>
        <div className="list has-header">
          <div className="item item-divider">
            <span>{t('city')}</span>
          </div>
          <div className="item vmp-list-item" onClick={controller.showCitySelectorModal}>
            <span>{cityName}</span>
            <span className="item-note">{t('select_city_imperative')}</span>
          </div>
          <div className="item item-divider">
            <span>{t('lang')}</span>
          </div>
          {langs}
        </div>
      </div>
    );
  }
});

module.exports = SettingsView;
