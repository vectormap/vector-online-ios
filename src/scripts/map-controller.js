var L = require('leaflet');
var {GeoCoder} = require('api');
var AppConfig = require('config');

var map;
var rootBinding;
var mapBinding;

var MapController = {
  init (_rootBinding) {
    rootBinding = _rootBinding;
    mapBinding = rootBinding.sub('map');
  },

  initMap (mapContainer) {
    window.map = map = L.map(mapContainer, {
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer(AppConfig.map.tilesUrl, {
      minZoom: AppConfig.map.minZoom,
      maxZoom: AppConfig.map.maxZoom,
      detectRetina: true,
      updateWhenIdle: false
    }).addTo(map);

    this.bindEvents();
  },

  bindEvents () {
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
    if (mapEvent) {
      var {latlng} = mapEvent;
      var city = rootBinding.get('currentCity');

      GeoCoder.getInfo(city, latlng, map.getZoom()).then(geoInfo => {
        console.log('showPopup', geoInfo);
      });
    } else if (address) {

    }
  },

  closePopup () {

  }
};

module.exports = MapController;
