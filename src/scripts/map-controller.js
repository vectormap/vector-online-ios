var _          = require('lodash');
var L          = require('leaflet');
var {GeoCoder} = require('api');
var AppConfig  = require('config');
var imm        = require('immutable').fromJS;
var P          = require('bluebird');
var status     = require('status-controller');

var {isValidCoords} = require('models/AddressModel');
var {Catalog} = require('api');

var map;
var rootBinding;
var mapBinding;
var popupBinding;

const PRETTY_ZOOM = 16;

var markerIcon = L.divIcon({
  iconSize: [40, 53],
  iconAnchor: [21, 48],
  className: 'vmp-map-marker'
});

var markerIconPremium = L.divIcon({
  iconSize: [40, 53],
  iconAnchor: [21, 48],
  className: 'vmp-map-marker-premium'
});

var markersLayer = L.layerGroup();

var MapController = {
  init (_rootBinding) {
    rootBinding  = _rootBinding;
    mapBinding   = rootBinding.sub('map');
    popupBinding = mapBinding.sub('popup');
  },

  initMap (mapContainer) {
    map = L.map(mapContainer, {
      zoomControl: false,
      attributionControl: false,
      // inertiaDeceleration: 10000,
      inertiaMaxSpeed: 6000,
      // zoomAnimation: false,
      markerZoomAnimation: false
    });

    map.addControl(new L.Control.Zoom({
      zoomInTitle: '',
      zoomOutTitle: '',
      position: 'topright'
    }));

    L.tileLayer(AppConfig.map.tilesUrl, {
      minZoom: AppConfig.map.minZoom,
      maxZoom: AppConfig.map.maxZoom,
      detectRetina: true,
      updateWhenIdle: false
    }).addTo(map);

    markersLayer.addTo(map);

    this.bindMapEvents();
  },

  bindMapEvents () {
    map.on('click', e => this.showPopup({latlng: e.latlng}));
  },

  updateMap () {
    var mapConfig = rootBinding.toJS('cityConfig.map');
    var {lat, lng, zoom} = mapConfig.center;
    var {bounds} = mapConfig;

    map.setMaxBounds(L.latLngBounds(bounds.southWest, bounds.northEast));
    map.setView([lat, lng], zoom);
  },

  showPopup ({latlng, addressId, orgData, marker = false, zoomToLocation = false}) {
    if (!latlng && !orgData && !addressId) {
      return;
    }

    if (latlng || addressId) {
      if (status.is('loading')) {
        return;
      }

      var city = rootBinding.get('currentCity');
      var geoDataPromise;

      status.loading();

      if (latlng) {
        geoDataPromise = GeoCoder.getInfo(city, latlng, map.getZoom());
      } else {
        geoDataPromise = Catalog.getFromCollection(city, 'addresses', addressId);
        zoomToLocation = true;
      }

      P.resolve(geoDataPromise).then(geoData => {
        var result = geoData.data.result[0];

        // skip area and roads
        if (!result || result && (result.layer === 'area' || result.layer === 'axis')) {
          this.closePopup();
          return;
        }

        console.log('showPopup: map click', geoData);

        this.clearPopupData();
        popupBinding.set('geoData', imm(geoData));

        if (marker) {
          this.showMarker({
            latlng: result.pos,
            onClick: () => (this.showPopup({latlng, addressId, zoomToLocation: true}))
          });
        }

        this.setMapView(result.pos, zoomToLocation);
        this.openPopup();
      })
      .finally(status.clear);
    } else if (orgData) {
      var {address, organization} = orgData;

      if (!address && !organization) {
        return;
      }

      zoomToLocation = true;

      this.clearPopupData();
      popupBinding.set('orgData', imm(orgData));

      if (marker) {
        this.showMarker({
          latlng: address.pos,
          onClick: () => (this.showPopup({orgData, zoomToLocation: true})),
          premium: organization.adv
        });
      }

      this.setMapView(address.pos, zoomToLocation);
      this.openPopup();
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

  setMapView (latlng, zoomToLocation) {
    if (isValidCoords(latlng)) {
      map.setView(latlng, zoomToLocation ? PRETTY_ZOOM : undefined);
    }
  },

  showMarker ({latlng, premium = false, onClick = _.noop}) {
    var marker = L
      .marker(latlng, {icon: premium ? markerIconPremium : markerIcon})
      .on('click', onClick.bind(marker));

    markersLayer.clearLayers();
    markersLayer.addLayer(marker);
  },

  reset () {
    this.closePopup();
    this.clearPopupData();
    markersLayer.clearLayers();
  }
};

module.exports = MapController;
