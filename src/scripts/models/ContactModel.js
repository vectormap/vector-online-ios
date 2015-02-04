var _ = require('lodash');

var contactHrefs = {
  desktop: {
    'email' : 'mailto:%s',
    'skype' : 'skype:%s?chat',
    'fax'   : 'callto:%s',
    'phone' : 'callto:%s',
    'www'   : 'http://%s',
    'icq'   : '%s'
  },

  mobile: {
    'email' : 'mailto:%s',
    'skype' : 'skype:%s?chat',
    'fax'   : 'tel:%s',
    'phone' : 'tel:%s',
    'www'   : 'http://%s',
    'icq'   : '%s'
  }
};

var ContactModel = {
  contactHref (contact, platform = 'desktop') {
    var hrefValue = (contact.value || '').replace('http://', '');
    var href = contactHrefs[platform][contact.type].replace('%s', hrefValue);

    return href;
  }
};

module.exports = ContactModel;
