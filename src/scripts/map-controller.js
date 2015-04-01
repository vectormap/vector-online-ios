var _             = require('lodash');
var L             = require('leaflet');
var {GeoCoder}    = require('api');
var AppConfig     = require('config');
var imm           = require('immutable').fromJS;
var P             = require('bluebird');
var status        = require('status-controller');

require('leaflet.locatecontrol');

var {isValidCoords} = require('models/AddressModel');
var {Catalog} = require('api');

var map;
var rootBinding;
var mapBinding;
var popupBinding;
var locationControl;
var compassWatchId;

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

var setLocationView = function ({latlng}) {
  map.setView(latlng, PRETTY_ZOOM);
};

var CompassMarker = L.Marker.extend({
  initialize (latlng, options) {
    options = _.extend(options, {
      icon: L.divIcon({
        className: 'vmp-compass-marker',
        iconAnchor: [23, 26]
      })
    });

    L.Marker.prototype.initialize.call(this, latlng, options);
    this.on('click', setLocationView);
  }
});

var CircleMarker = L.CircleMarker.extend({
  initialize (latlng, options) {
    L.CircleMarker.prototype.initialize.call(this, latlng, options);
    this.on('click', setLocationView);
  }
});

var compassMarker = function (latlng, options) {
  return navigator.compass ?
      new CompassMarker(latlng, options) : new CircleMarker(latlng, options);
};

var markersLayer = L.layerGroup();

function setRotationToTransform (transform = '', angle, measure) {
  angle = Math.round(angle);
  var rotation = `rotate(${angle}${measure})`;

  if (transform.indexOf('rotate') < 0) {
    transform += ' ' + rotation;
  } else {
    transform = transform.replace(/rotate\(.*\)/, rotation);
  }

  return transform;
}

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
      zoomInText: '',
      zoomOutText: '',
      position: 'topright'
    }));

    L.tileLayer(AppConfig.map.tilesUrl, {
      minZoom: AppConfig.map.minZoom,
      maxZoom: AppConfig.map.maxZoom,
      detectRetina: true,
      updateWhenIdle: false
    }).addTo(map);

    markersLayer.addTo(map);

    locationControl = L.control.locate({
      position: 'topright',
      follow: true,
      keepCurrentZoomLevel: true,
      stopFollowingOnDrag: true,
      remainActive: true,
      showPopup: false,
      // icon: '',
      iconLoading: 'ion-load-b vmp-anim-spin',
      markerStyle: {
        radius: 15
      },
      markerClass: compassMarker,

      onLocationError: err => {
        console.log('location error:', err);
      },

      onLocationOutsideMapBounds: control => {
        control.stop();
        console.log('location error: Location Outside Map Bounds');
      }
    }).addTo(map);

    // window.locationControl = locationControl;
    // window.setRotationToTransform = setRotationToTransform;

    this.bindMapEvents();
  },

  bindMapEvents () {
    map.on('click', e => this.showPopup({latlng: e.latlng, marker: true}));

    map.on('startfollowing', () => {
      console.log('startfollowing');
      this.watchCompass();
    });

    map.on('stopfollowing', () => {
      console.log('stopfollowing');
      L.DomUtil.removeClass(locationControl._container, 'following');

      if (navigator.compass) {
        navigator.compass.clearWatch(compassWatchId);
        console.log('clearWatch', compassWatchId);
      }
    });
  },

  watchCompass () {
    if (!navigator.compass) {
      return;
    }

    compassWatchId = navigator.compass.watchHeading(
      heading => {
        if (locationControl && locationControl._marker) {
          var magneticHeading = heading.magneticHeading - 45;

          locationControl._marker._icon.style.webkitTransform = setRotationToTransform(
            locationControl._marker._icon.style.webkitTransform, magneticHeading, 'deg');
        }
      },
      compassError => {
        console.log('compass error', compassError);
      },
      {
        frequency: 100
      }
    );

    console.log('compassWatchId', compassWatchId);
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
      locationControl._stopFollowing();
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
