var React = require('react');
var M     = require('morearty');
var {t}   = require('controller');

var AreaPopup = React.createClass({
  mixins: [M.Mixin],

  render () {
    var area = this.getBinding().toJS();

    if (!area || (area && !area.semantic)) {
      return null;
    }

    area = area.semantic.area || t('geo.unknown2');

    return (
      <div>
        <div className="bar bar-stable">
          <h1 className="title">
            <i className="ion-map vmp-map-popup-title-icon"></i>
            {t('geo.area')}
          </h1>
        </div>

        <div className="content has-header vmp-map-popup-content vmp-map-popup-content-title">
          {area}
        </div>
      </div>
    );
  }
});

module.exports = AreaPopup;
