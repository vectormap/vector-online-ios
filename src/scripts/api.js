var req = require('reqwest');
var Q   = require('bluebird');
var $   = require('jquery');

var city = 'surgut';

function _get (url, data) {
  return $.get(url, data);

  // return req({
  //   method: 'get',
  //   url,
  //   data
  // });
}

function get (cityRelativeApiUrl, data) {
  return _get(`http://api.vmp.ru/v1/city/${city}${cityRelativeApiUrl}`, data)
}

function getRoot (rootRelativeApiUrl, data) {
  return _get(`http://api.vmp.ru/v1{rootRelativeApiUrl}`, data)
}

var Api = {
  getCityConfig: city => get(`/city/${city}`),
  getAllCityConfigs: () => getRoot('/cities'),
  result: (apiObject = {}) => (apiObject.data || {}).result,

  GeoCoder: {

  },

  Catalog: {
    quickSearch: function (q, page = 0) {
      if (!q || q.length < 3) {
        return [];
      }

      var params = {q: q.trim(), page, suggest: true, per: 10};

      return Q.all([
        get('/search/organizations', params),
        get('/search/rubrics', params),
        get('/search/addresses', params)
      ]).spread((organizations, rubrics, addresses) => {
        return [organizations, rubrics, addresses];
      });
    },

    getFromCollection: function (collection, ids) {
      return get('/' + collection + '/' + ids.join(','));
    },

    getOrganization: function (orgId) {
      return get('/organization/' + orgId);
    },

    getOrganizations: function (orgIdsStr) {
      return get('/organizations/' + orgIdsStr);
    },

    getOrganizationsWithAddressBinding: function (orgIdsStr, addressCoords, zoomLevel) {
      return get('/organizations/' + [orgIdsStr, addressCoords.lat, addressCoords.lng, zoomLevel].join('/'));
    },

    getRubric: function (rubricId) {
      return get('/rubric/' + rubricId);
    },

    getAddress: function (addressId) {
      return get('/address/' + addressId);
    },

    getOrganizationsInAddress: function (addressId) {
      return get('/orgs_in_address/' + addressId);
    },

    getOrganizationsByRubric: function (rubricId) {
      return get('/orgs_by_rubric/' + rubricId);
    },

    search: function (query, collection, page) {
      return this._search('search', query, collection, page);
    },

    searchAll: function (query, pages) {
      return get(
        [
          '/search_all', Utils.escapeQuery(query),
          'orgs', pages.organizations,
          'addresses', pages.addresses,
          'rubrics', pages.rubrics
        ]
        .join('/'));
    },

    buildSearchUrl: function (searchPath, query, collection, _offset) {
      var offset = _offset || 0;

      return '/' + [searchPath, collection, Utils.escapeQuery(query), offset].join('/');
    },

    _search: function (path, query, collection, offset) {
      var url = this.buildSearchUrl(path, query, collection, offset);

      return get(url);
    },

    /*
      @data:
      {
        city: 'Сургут',
        orgTitle: 'Техноцентр',
        orgId: 12345,
        name: 'Иван',
        phone: 333344,
        email: some@mail.com
      }
    */
    sendCommercialOffer: function (data) {
      return post('/commercial_offer', {commercial_data: data});
    }

  }

};

module.exports = Api;
