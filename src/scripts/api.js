var qwest = require('qwest');
var P   = require('bluebird');

var PAGE_LIMIT = 25;

function _get (url, data) {
  return qwest.get(url, data, {responseType: 'json'});
}

function get (city, cityRelativeApiUrl, data) {
  if (!city) {
    throw new Error('City must be defined');
  }

  return _get(`http://api.vmp.ru/v1/city/${city}${cityRelativeApiUrl}`, data)
}

function getRoot (rootRelativeApiUrl, data) {
  return _get(`http://api.vmp.ru/v1${rootRelativeApiUrl}`, data)
}

var Api = {
  getCityConfig: city => getRoot(`/city/${city}`),
  getAllCityConfigs: () => getRoot('/cities'),
  result: (apiObject = {}) => (apiObject.data || {}).result,

  GeoCoder: {
    getInfo (city, {lat, lng}, zoom = '') {
      return get(city, `/geo/${lat}/${lng}/${zoom}`)
    }
  },

  Catalog: {
    searchAll: function (city, q, {page = 0, suggest} = {}) {
      if (!q || q.length < 3) {
        return [];
      }

      var params = {q: q.trim(), page, suggest, per: PAGE_LIMIT, coords: false};

      return P.all([
        get(city, '/search/organizations', params),
        get(city, '/search/rubrics', params),
        get(city, '/search/addresses', params)
      ]).spread((organizations, rubrics, addresses) => {
        return [organizations, rubrics, addresses];
      });
    },

    search: function (city, collection, q, {page = 0, suggest}) {
      var params = {q: q.trim(), page, suggest, per: PAGE_LIMIT, coords: false};

      return get(city, `/search/${collection}`, params);
    },

    // @itemType: address, rubric
    getOrganizationsBy: function (city, itemType, itemId, {page = 0, suggest} = {}) {
      if (itemType !== 'address' && itemType !== 'rubric') {
        throw new Error(`getOrganizationsBy: incorrect item type: ${itemType}. Should be in: [address, rubric]`);
      }

      var params = {[itemType]: itemId, page, suggest, per: PAGE_LIMIT, coords: false};

      return get(city, `/organizations`, params);
    },

    getFromCollection: function (city, collection, id, {coords, page = 0} = {}) {
      return get(city, `/${collection}`, {ids: id, coords})
    },

    getOrganizationsInAddress: function (addressId) {

    },

    getOrganizationsByRubric: function (rubricId) {

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
