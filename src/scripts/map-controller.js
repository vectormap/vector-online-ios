var L          = require('leaflet');
var {GeoCoder} = require('api');
var AppConfig  = require('config');
var imm        = require('immutable').fromJS;
var P          = require('bluebird');

var map;
var rootBinding;
var mapBinding;
var popupBinding;

var MapController = {
  init (_rootBinding) {
    rootBinding  = _rootBinding;
    mapBinding   = rootBinding.sub('map');
    popupBinding = mapBinding.sub('popup');
  },

  initMap (mapContainer) {
    map = L.map(mapContainer, {
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer(AppConfig.map.tilesUrl, {
      minZoom: AppConfig.map.minZoom,
      maxZoom: AppConfig.map.maxZoom,
      detectRetina: true,
      updateWhenIdle: false
    }).addTo(map);

    this.bindMapEvents();
  },

  bindMapEvents () {
    map.on('click', e => this.showPopup({mapEvent: e}));
  },

  updateMap () {
    var mapConfig = rootBinding.toJS('cityConfig.map');
    var {lat, lng, zoom} = mapConfig.center;
    var {bounds} = mapConfig;

    map.setMaxBounds(L.latLngBounds(bounds.southWest, bounds.northEast));
    map.setView([lat, lng], zoom);
  },

  showPopup ({mapEvent, address, organization}) {
    this.clearPopupData();

    if (mapEvent) {
      var {latlng} = mapEvent;
      var city = rootBinding.get('currentCity');

      if (this.isPopupOpen()) {
        popupBinding.set('loading', true);
      }

      P.resolve(GeoCoder.getInfo(city, latlng, map.getZoom())).then(geoData => {
        // alert(geoData.collection + ' ' + geoData.data.result[0]);

        console.log('showPopup: map click', geoData);
        popupBinding.set('geoData', imm(geoData));
        popupBinding.set('loading', false);
        this.openPopup();
      });
    } else if (address) {

    }
  },

  openPopup () {
    popupBinding.set('open', true);
  },

  closePopup () {

  },

  isPopupOpen () {
    return popupBinding.get('open');
  },

  clearPopupData () {
    popupBinding
      .clear('geoData')
      .clear('address')
      .clear('organization');
  }
};

module.exports = MapController;
