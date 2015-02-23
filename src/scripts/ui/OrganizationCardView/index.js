var React = require('react');
var M = require('morearty');
var ContactsView = require('./ContactsView');
var DepartmentsView = require('./DepartmentsView');

var OrganizationCard = React.createClass({
  mixins: [M.Mixin],

  render () {
    var orgBinding = this.getBinding().sub('data.result.0');
    var org = orgBinding.get();

    if (!org) {
      return null;
    }

    var commonContactsBinding = orgBinding.sub('contact');

    // for context ads
    // <div dangerouslySetInnerHTML={{__html: 'First &middot; Second'}} />

    // <div className="bar">
    //   <div className="title">
    //     <span>{org.get('title')}</span>
    //   </div>
    // </div>

    return (
      <div className="pane vmp-list overflow-scroll" nav-view="active">
        <div className="list">
          <div className="item vmp-list-item vmp-title">
            <span>{org.get('title')}</span>
          </div>

          <ContactsView binding={commonContactsBinding} />

          <div className="item item-text">
            [TODO] Справочники, разработка программного обеспечения
          </div>

          <DepartmentsView binding={orgBinding.sub('department')} organization={org.toJS()} />
        </div>
      </div>
    );
  }
});

module.exports = OrganizationCard;
