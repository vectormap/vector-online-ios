var {
  randomizeOrgsInOneLevel
} = require('./OrgModel');

var SearchModel = {
  prepareSearch () {

  },

  prepareQuickSearch ({organizations, rubrics, addresses}) {
    organizations = randomizeOrgsInOneLevel(organizations);
    return {organizations, rubrics, addresses};
  },
};

module.exports = SearchModel;
