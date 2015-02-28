var React = require('react/addons');
var M     = require('morearty');
var controller = require('controller');

var cx = React.addons.classSet;
var {toggle} = M.Callback;
var {t} = controller;
var {onTouch} = require('utils');

var CitySelectorModal = React.createClass({
  mixins: [M.Mixin],

  _switchCity (alias, toggleModal) {
    controller.switchCity(alias);
    toggleModal();
  },

  renderCityItem (cityConfig, currentCity, toggleModal) {
    var city = cityConfig.get('city');
    var name = city.get('name');
    var alias = city.get('alias');
    var cls = cx({
      'item vmp-list-item': true,
      'vmp-list-item-activated': alias === currentCity
    });

    return (
      <div className={cls} key={`city-${name}`}
        onTouchTap={onTouch(this._switchCity.bind(this, alias, toggleModal))}>
        {name}
      </div>
    );
  },

  render () {
    var configsBinding = this.getBinding().sub('allCityConfigs');
    var modalBinding = this.getBinding().sub('modal');
    var toggleModal = toggle(modalBinding);
    var configs = configsBinding.get();
    var currentCity = this.getBinding().get('currentCity');
    var cities = configs.map(config => this.renderCityItem(config, currentCity, toggleModal));

    return (
      <div>
        <div className="bar bar-header disable-user-behavior">
          <h1 className="title">{t('card.select_city')}</h1>
          <div className="buttons">
            <button className="button button-clear" onTouchEnd={toggleModal}>{t('cancel')}</button>
          </div>
        </div>
        <div className="has-header scroll-content vmp-scroll overflow-scroll">
          <div className="list">
            {cities && cities.toJS()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CitySelectorModal;
