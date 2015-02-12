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

    return (
      <div className="pane vmp-list" nav-view="active">
        <div className="list">
          <div className="item">
            <h3>{org.get('title')}</h3>
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
