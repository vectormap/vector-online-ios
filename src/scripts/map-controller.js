var L          = require('leaflet');
var {GeoCoder} = require('api');
var AppConfig  = require('config');
var imm        = require('immutable').fromJS;
var P          = require('bluebird');
var status     = require('status-controller');

var {isValidCoords} = require('models/AddressModel');

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

  showPopup ({mapEvent, orgData}) {
    if (!mapEvent && !orgData) {
      return;
    }

    if (mapEvent) {
      if (status.is('loading')) {
        return;
      }

      var {latlng} = mapEvent;
      var city = rootBinding.get('currentCity');

      status.loading();

      P.resolve(GeoCoder.getInfo(city, latlng, map.getZoom())).then(geoData => {
        var result = geoData.data.result[0];

        // skip area and roads
        if (!result || result && result.layer === 'area' || result.layer === 'axis') {
          this.closePopup();
          return;
        }

        console.log('showPopup: map click', geoData);

        this.clearPopupData();
        popupBinding.set('geoData', imm(geoData));
        this.setMapView(result.pos);
        this.openPopup();
      })
      .finally(status.clear);
    } else if (orgData) {
      var {address = {}, organization = {}} = orgData;

      this.clearPopupData();
      popupBinding.set('orgData', imm(orgData));
      this.openPopup();
      this.setMapView(address.pos);
    }
  },

  openPopup () {
    popupBinding.set('open', true);
  },

  closePopup () {
    popupBinding.set('open', false);
  },

  isPopupOpen () {
    return popupBinding.get('open');
  },

  clearPopupData () {
    popupBinding.clear();
  },

  setMapView (latlng) {
    if (isValidCoords(latlng)) {
      map.setView(latlng);
    }
  }
};

module.exports = MapController;
