var _ = require('lodash');
var {randomizeOrgsInOneLevel} = require('./OrgModel');
var {result} = require('api');

var SearchModel = {
  prepareSearch () {

  },

  prepareQuickSearch (data) {
    var [organizations = [], rubrics = [], addresses = []] = data.map(result);
    organizations = randomizeOrgsInOneLevel(organizations);

    return {organizations, rubrics, addresses};
  },
};

module.exports = SearchModel;
