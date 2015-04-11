var React             = require('react/addons');
var M                 = require('morearty');
var Modal             = require('ui/Modal');
var AddressPopup      = require('./popups/AddressPopup');
var OrganizationPopup = require('./popups/OrganizationPopup');
var BuildingPopup     = require('./popups/BuildingPopup');
var StationPopup      = require('./popups/StationPopup');
var AreaPopup         = require('./popups/AreaPopup');
var RoadPopup         = require('./popups/RoadPopup');

var cx = React.addons.classSet;
var layerPopups = {
  'buildings': BuildingPopup,
  'station': StationPopup,
  'station_tram': StationPopup,
  'area': AreaPopup,
  'axis': RoadPopup
};

var MapPopup = React.createClass({
  mixins: [M.Mixin],

  popupContentView () {
    var popupBinding = this.getBinding();
    var PopupContentView = null;
    var bGeoData = popupBinding.sub('geoData');
    var bOrgData = popupBinding.sub('orgData');
    var modalSizeCls = '';

    if (bGeoData.get() && bGeoData.get().size > 0) {
      var resultBinding = bGeoData.sub('data.result.0');

      if (bGeoData.get('collection') === 'addresses') {
        PopupContentView = <AddressPopup binding={resultBinding} />;
      }

      if (bGeoData.get('collection') === 'geometries') {
        var LayerPopup = layerPopups[resultBinding.get('layer')];
        var geometry = resultBinding.toJS();

        PopupContentView = LayerPopup && <LayerPopup binding={resultBinding} />;

        if (geometry && geometry.layer === 'area' && geometry.semantic && !geometry.semantic.area) {
          PopupContentView = null;
        }

        modalSizeCls = 'popup-small';
      }
    } else if (bOrgData.get() && bOrgData.get().size > 0) {
      PopupContentView = <OrganizationPopup binding={bOrgData} />;
      // modalSizeCls = 'popup-small';
    }

    return {PopupContentView, modalSizeCls};
  },

  render () {
    var popupBinding = this.getBinding();
    var popupToggleBinding = popupBinding.sub('open');
    var {PopupContentView, modalSizeCls} = this.popupContentView();

    return (
      <div>
        {PopupContentView &&
          <Modal
            binding={popupBinding}
            toggleBinding={popupToggleBinding}
            backdrop={false}
            className={cx('vmp-map-popup-modal', modalSizeCls)}>
            {PopupContentView}
          </Modal>}
      </div>
    );
  }
});

module.exports = MapPopup;
