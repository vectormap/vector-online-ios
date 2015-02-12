var AddressModel = {
  isValidAddress: function (address) {
    return address &&
           address.pos &&
           AddressModel.isValidCoords(address.pos);
  },

  isValidCoords: function ({lat, lng}) {
    return lat !== 0 &&
           lng !== 0;
  },

  formatAddress: function (address, {withOffice = true} = {}) {
    if (address) {
      var formatted = address.street + ', ' + address.house;

      if (withOffice && address.office) {
        formatted += ' - ' + address.office;
      }

      if (!address.current) {
        formatted += ', ' + address.city;
      }

      return formatted;
    }

    return '';
  },

  formatSearchSubtitle: function (address) {
    // TODO: need inflections: 'организация, организаций, организации'
    // if (address) {

    // }

    return '';
  }
};

module.exports = AddressModel;
