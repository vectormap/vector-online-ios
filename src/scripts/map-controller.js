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

var compassIcon = L.divIcon({
  className: 'vmp-compass-marker',
  iconAnchor: [23, 26]
});

var locationPointIcon = L.divIcon({
  className: 'vmp-gps-location-point-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

var setLocationView = function ({latlng}) {
  map.setView(latlng, PRETTY_ZOOM);
};

var LocationMarker = L.Marker.extend({
  initialize (latlng, options = {}) {
    options = _.extend(options, {
      icon: options.compass ? compassIcon : locationPointIcon
    });

    L.Marker.prototype.initialize.call(this, latlng, options);
    this.on('click', setLocationView);
  },

  setCompassIcon () {
    this.setIcon(compassIcon);
  },

  setPointIcon () {
    this.setIcon(locationPointIcon);
  }
});

var locationMarker = function (latlng, options) {
  return new LocationMarker(
    latlng, _.extend(options, {compass: !!navigator.compass})
  );
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

function showLocationModal ({status, error}) {
  var content = '';
  var errorText = '';
  var {PositionError} = window;
  var {t} = require('controller');

  if (status === 'startfollowing') {
    content = t('map.control.location.map_is_tracking_your_location');
  }

  if (status === 'stopfollowing') {
    content = t('map.control.location.location_tracking_disabled');
  }

  if (error) {
    if (PositionError) {
      switch (error.code) {
        case PositionError.PERMISSION_DENIED:
          errorText = t('map.control.location.enable_location_in_settings');
          break;

        case PositionError.TIMEOUT:
        case PositionError.POSITION_UNAVAILABLE:
          errorText = t('map.control.location.we_cant_find_you');
          break;

        default:
          errorText = error.message || error;
      }
    } else {
      errorText = error;
    }

  }

  rootBinding.sub('location')
    .set('content', content)
    .set('error', errorText);

  rootBinding.set('location.infoModal', true);
}

var MapController = {
  init (_rootBinding) {
    rootBinding  = _rootBinding;
    mapBinding   = rootBinding.sub('map');
    popupBinding = mapBinding.sub('popup');
  },

  initMap (mapContainer) {
    var {t} = require('controller');

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
      markerClass: locationMarker,

      onLocationError: error => {
        showLocationModal({error});
      },

      onLocationOutsideMapBounds: control => {
        control.stop();
        showLocationModal({error: t('map.control.location.location_out_of_city')});
      }
    }).addTo(map);

    this.bindMapEvents();
  },

  bindMapEvents () {
    map.on('click', e => this.showPopup({latlng: e.latlng, marker: true}));

    map.on('startfollowing', () => {
      console.log('startfollowing');

      if (locationControl._marker) {
        locationControl._marker.setCompassIcon();
      }

      showLocationModal({status: 'startfollowing'});
      this.watchCompass();
    });

    map.on('stopfollowing', () => {
      console.log('stopfollowing');

      if (locationControl._marker) {
        locationControl._marker.setPointIcon();
      }

      showLocationModal({status: 'stopfollowing'});
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
          var magneticHeading = heading.magneticHeading - 45; // icon angle correction

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
    var mapConfig        = rootBinding.toJS('cityConfig.map');
    var {lat, lng, zoom} = mapConfig.center;
    var {bounds}         = mapConfig;

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
      if (locationControl._following) {
        locationControl._stopFollowing();
      }

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
