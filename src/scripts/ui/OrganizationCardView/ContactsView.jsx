var React = require('react');
var M = require('morearty');
var {contactHref} = require('models/ContactModel');

var iconsMap = {
  'email': 'email',
  'skype': 'skype',
  'fax': 'telephone',
  'phone': 'telephone',
  'www': 'world',
  'icq': 'flower' // TODO: need icq icon
};

var ContactsView = React.createClass({
  mixins: [M.Mixin],

  renderContact (contact) {
    contact = contact.toJS();
    var {int_id, type, alias, owner} = contact;
    var icon = iconsMap[type];
    var href = contactHref(contact, 'mobile');
    var key = `contact-${type}-${int_id}`;

    return (
      <a href={href} className="item item-icon-left vmp-list-item" key={key}>
        <i className={`icon ion-ios-${icon}-outline`}></i>
        <span>{alias}</span>
        {owner &&
          <span className="item-desc">{owner}</span>}
      </a>
    );
  },

  render () {
    var contacts = this.getBinding().get();

    if (!contacts) {
      return null;
    }

    var contactItems = contacts.map(this.renderContact);

    return (
      <div>
        {contactItems.toJS()}
      </div>
    );
  }
});

module.exports = ContactsView;
