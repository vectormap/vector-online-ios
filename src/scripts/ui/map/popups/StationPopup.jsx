var React = require('react');
var M = require('morearty');
var {t} = require('controller');

var StationPopup = React.createClass({
  mixins: [M.Mixin],

  render () {
    var station = this.getBinding().toJS();

    console.log('station', station);

    if (!station) {
      return null;
    }

    var routes = [].concat(station.semantic.route).join(', ');

    return (
      <div>
        <div className="bar bar-stable">
          <h1 className="title">
            <i className="ion-android-bus vmp-map-popup-title-icon"></i>
            {station.semantic.name}
          </h1>
        </div>

        <div className="content has-header vmp-map-popup-content">
          <div className="vmp-map-popup-row">
            <span className="vmp-map-popup-description">{t('geo.routes')}: </span>
            <span className="">{routes}</span>
          </div>

        </div>
      </div>
    );
  }
});

module.exports = StationPopup;
