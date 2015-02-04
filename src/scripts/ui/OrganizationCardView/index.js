var React = require('react');
var M = require('morearty');
var ContactsView = require('./ContactsView');

var OrganizationCard = React.createClass({
  mixins: [M.Mixin],

  render () {
    var orgBinding = this.getBinding().sub('data.result.0');
    var org = orgBinding.get();

    if (!org) {
      return null;
    }

    var commonContactsBinding = orgBinding.sub('contact');

    console.log('>>>', orgBinding.toJS());

    // for context ads
    // <div dangerouslySetInnerHTML={{__html: 'First &middot; Second'}} />

    return (
      <div className="pane vmp-list" nav-view="active">
        <div className="list">
          <div className="item">
            <h3>{org.get('title')}</h3>
          </div>

          <ContactsView binding={commonContactsBinding} />

          <div className="item item-text">
            Справочники, разработка программного обеспечения
          </div>

          <div className="item item-icon-left item-divider">
            <i className="icon ion-ios7-home"></i>
            30 лет победы, 19 - оф. 302a
          </div>
          <div className="item item-icon-left">
            <i className="icon ion-ios7-telephone"></i>
            44-20-22
          </div>
          <div className="item item-icon-left">
            <i className="icon ion-ios7-telephone"></i>
            44-20-22
          </div>
          <div className="item item-icon-left">
            <i className="icon ion-ios7-telephone"></i>
            44-20-22
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OrganizationCard;
