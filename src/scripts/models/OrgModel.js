var _ = require('lodash');
var U = require('utils');
var AddressModel = require('./AddressModel');

var OrgModel = {

  // Организация стоит на рекламе, если ее приоритет больше 1000
  isOrgWithAd: function (org) {
    return Number(org.priority) > 1000;
  },

  randomizeOrgsInOneLevel: function (orgs = []) {
    var after1000 = [], other = [];

    orgs.forEach(function (org) {
      (OrgModel.isOrgWithAd(org) ? after1000 : other).push(org);
    });

    var grouped =
      _.sortBy(
        _.values( // не гарантирует порядок ключей, поэтому надо сортировать
          _.groupBy(after1000, function (org) { return org.priority; })
        ),

        function (g) { return g[0].priority; }
      ).reverse();

    var shuffled =
      _.flatten(
        grouped.map(function (g) { return U.shuffle(g); })
      );

    var randomizedOrgs = shuffled.concat(other);

    return randomizedOrgs;
  },

  findDepartment: function (org, depId) {
    return _.find(org.department, function (dep) {
      return dep.int_id === depId;
    });
  },

  // @options: {departmentId: 12525 | addressId: 3252}
  pushDepartmentUp: function (org, options) {
    var byDepartmentId = function (dep) {
      return dep.int_id === options.departmentId;
    };

    var byAddressId = function (dep) {
      return dep.int_id === options.addressId;
    };

    var searchFn;

    if (options.departmentId) {
      searchFn = byDepartmentId;
    }

    if (options.addressId) {
      searchFn = byAddressId;
    }

    var removed = _.remove(org.department, searchFn)[0];

    if (removed) {
      org.department.unshift(removed);
    }


    return org;
  },

  findContact: function (org, type) {
    return _.find(org.contact, {type: type});
  },

  findAddress: function (org, addressId) {
    var department = _.find(org.department, function (dep) {
      return dep.address.int_id === addressId;
    });

    return department ? department.address : null;
  },

  findRubric: function (org, rubricId) {
    return _.find(org.rubric, {int_id: rubricId});
  },

  stat: function (org, params) {
    return _.extend({
      adv: OrgModel.isOrgWithAd(org),
      org: org.title,
      org_id: org.int_id
    }, params);
  },

  formatSearchSubtitle: function (org) {
    if (org && org.department) {
      var firstAddress = (org.department[0] || {}).address;
      var addressLine = AddressModel.formatAddress(firstAddress);

      return addressLine; // TODO: Ленина 45 (+3 филиала/адреса)
    }

    return '';
  },

  getSibling: function (org) {
    var siblingIndex = 0;
    var sibling = {};

    if (org.sibling && org.sibling.length > 0) {
      siblingIndex = _.random(0, org.sibling.length - 1);
      sibling = org.sibling[siblingIndex];

      return {
        orgId: sibling.id,
        orgTitle: sibling.title,
        text: sibling.text
      };
    }

  }

};

module.exports = OrgModel;
