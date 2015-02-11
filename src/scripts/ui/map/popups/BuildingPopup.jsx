var React = require('react');
var M = require('morearty');
var {t} = require('controller');

var BuildingPopup = React.createClass({
  mixins: [M.Mixin],

  render () {
    var building = this.getBinding().toJS();

    console.log('building', building);

    if (!building) {
      return null;
    }

    return (
      <div>
        <div className="bar bar-stable">
          <h1 className="title">
            <i className="ion-ios-home-outline vmp-map-popup-title-icon"></i>
            {building.semantic.name || t('geo.building')}
          </h1>
        </div>

        <div className="content has-header vmp-map-popup-content">
          <div className="vmp-map-popup-row">
            <span className="vmp-map-popup-description">{t('geo.area')}: </span>
            <span>{building.semantic.area || t('geo.unknown2')}</span>
          </div>

          <div className="vmp-map-popup-row">
            <span className="vmp-map-popup-description">{t('geo.purpose')}: </span>
            <span>{building.semantic.purpose}</span>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BuildingPopup;
