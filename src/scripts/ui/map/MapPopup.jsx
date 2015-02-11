var React         = require('react/addons');
var M             = require('morearty');
var Modal         = require('ui/Modal');
var AddressPopup  = require('./popups/AddressPopup');
var BuildingPopup = require('./popups/BuildingPopup');
var StationPopup  = require('./popups/StationPopup');
var AreaPopup     = require('./popups/AreaPopup');
var RoadPopup     = require('./popups/RoadPopup');

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
    var bAddress = popupBinding.sub('address');
    var modalSizeCls = '';

    if (bGeoData.get()) {
      var resultBinding = bGeoData.sub('data.result.0');

      if (bGeoData.get('collection') === 'addresses') {
        PopupContentView = <AddressPopup binding={resultBinding} />;
      }

      if (bGeoData.get('collection') === 'geometries') {
        var LayerPopup = layerPopups[resultBinding.get('layer')];

        PopupContentView = LayerPopup && <LayerPopup binding={resultBinding} />;
        modalSizeCls = 'popup-small';
      }
    } else if (bAddress.get()) {
      PopupContentView = <AddressPopup binding={bAddress} />;
    }

    return {PopupContentView, modalSizeCls};
  },

  render () {
    var popupBinding = this.getBinding();
    var popupToggleBinding = popupBinding.sub('open');
    var {PopupContentView, modalSizeCls} = this.popupContentView();

    return (
      <Modal
        binding={popupBinding}
        toggleBinding={popupToggleBinding}
        className={cx('vmp-map-popup-modal', modalSizeCls)} title="Modal title">
        {PopupContentView}
      </Modal>
    );
  }
});

module.exports = MapPopup;