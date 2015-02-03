var OrgModel     = require('./OrgModel');
var AddressModel = require('./AddressModel');
var RubricModel  = require('./RubricModel');

var byCollection = {
  'organizations': OrgModel,
  'rubrics': RubricModel,
  'addresses': AddressModel
};

module.exports = {
  OrgModel,
  AddressModel,

  getByCollection (collection) {
    return byCollection[collection];
  }
};
