var {t} = require('controller');
var controller = require('controller')

var noop = () => {};

function defaultAdditionalFormatter (collectionObj, doc) {
  return {
    type: collectionObj.translation.singular + ':',
    describe: collectionObj.formatTitle(doc)
  };
}

var Collections = {
  all: {
    formatTitle: () => '',
    formatAdditionalInfo: noop,

    translation: {
      plural: () => t('card.all'),
      singular: () => t('card.all')
    }
  },

  organizations: {
    formatTitle: (org) => org.title || '',

    formatAdditionalInfo: (org) => defaultAdditionalFormatter(this, org),

    translation: {
      singular: () => t('card.organization'),
      plural: () => t('card.organizations')
    }
  },

  rubrics: {
    formatTitle: (rubric) => rubric.name || '',

    formatAdditionalInfo: (rubric) => defaultAdditionalFormatter(this, rubric),

    translation: {
      singular: () => t('card.rubric'),
      plural: () => t('card.rubrics')
    }
  },

  addresses: {
    formatTitle: (address) => `${address.street}, ${address.house}`,

    formatAdditionalInfo (address) {
      return {
        type: t('card.orgs_by_address'),
        describe: this.formatTitle(address)
      };
    },

    translation: {
      singular: () => t('card.address'),
      plural: () => t('card.addresses')
    }
  }

};

module.exports = {
  formatTitle (collection, doc) {
    return Collections[collection].formatTitle(doc);
  },

  formatAdditionalInfo (collection, doc) {
    return Collections[collection].formatAdditionalInfo(doc);
  },

  translate (collection) {
    return Collections[collection].translation;
  },

  uniqId (collection, doc) {
    return `${collection}_${doc.int_id}`;
  }
};
