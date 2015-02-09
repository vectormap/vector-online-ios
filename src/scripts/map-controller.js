var L          = require('leaflet');
var {GeoCoder} = require('api');
var AppConfig  = require('config');
var imm        = require('immutable').fromJS;
var P          = require('bluebird');

var map;
var rootBinding;
var mapBinding;

var MapController = {
  init (_rootBinding) {
    rootBinding = _rootBinding;
    mapBinding = rootBinding.sub('map');
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
    map.on('click', e => this.loadGeoDataAndShowPopup({mapEvent: e}));
  },

  updateMap () {
    var mapConfig = rootBinding.toJS('cityConfig.map');
    var {lat, lng, zoom} = mapConfig.center;
    var {bounds} = mapConfig;

    map.setMaxBounds(L.latLngBounds(bounds.southWest, bounds.northEast));
    map.setView([lat, lng], zoom);
  },

  loadGeoDataAndShowPopup ({mapEvent, address, organization}) {
    if (mapEvent) {
      var {latlng} = mapEvent;
      var city = rootBinding.get('currentCity');

      if (this.isPopupOpen()) {
        mapBinding.set('popup.loading', true);
      }

      P.resolve(GeoCoder.getInfo(city, latlng, map.getZoom())).then(geoData => {
        console.log('loadGeoDataAndShowPopup: map click', geoData);
        mapBinding.set('popup.geoData', imm(geoData));
        mapBinding.set('popup.loading', false);
        this.openPopup();
      });
    } else if (address) {

    }
  },

  openPopup () {
    mapBinding.set('popup.open', true);
  },

  closePopup () {

  },

  isPopupOpen () {
    return mapBinding.get('popup.open');
  }
};

module.exports = MapController;
