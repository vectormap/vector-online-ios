var AddressModel = {
  isValidAddress: function (address) {
    return address &&
           address.pos &&
           address.pos.lat !== 0 &&
           address.pos.lng !== 0;
  },

  formatAddress: function (address) {
    if (address) {
      var formatted = address.street + ', ' + address.house;

      if (address.office) {
        formatted += ' - ' + address.office;
      }

      if (!address.current) {
        formatted += ', ' + address.city;
      }

      return formatted;
    }

    return '';
  }
};

module.exports = AddressModel;
