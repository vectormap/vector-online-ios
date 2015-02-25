var React = require('react/addons');
var M = require('morearty');
var ContactsView = require('./ContactsView');
var DepartmentsView = require('./DepartmentsView');
var controller = require('controller');

var {addOrgToBookmarks, isOrgInBookmarks, removeOrgFromBookmarks, t} = controller;
var cx = React.addons.classSet;

var OrganizationCard = React.createClass({
  mixins: [M.Mixin],

  render () {
    var orgBinding = this.getBinding('item').sub('data.result.0');
    var org = orgBinding.get();

    if (!org) {
      return null;
    }

    var commonContactsBinding = orgBinding.sub('contact');
    var favOnClick;
    var starCls;
    var favText;

    if (controller.isOrgInBookmarks(org)) {
      favText = t('card.remove_from_favorites');
      starCls = cx('icon ion-ios-star', 'vmp-fav-highlight');
      favOnClick = removeOrgFromBookmarks.bind(controller, org);
    } else {
      favText = t('card.add_to_favorites');
      starCls = 'icon ion-ios-star-outline';
      favOnClick = addOrgToBookmarks.bind(controller, org);
    }

    // for context ads
    // <div dangerouslySetInnerHTML={{__html: 'First &middot; Second'}} />

    return (
      <div>
        <div className="bar">
          <h1 className="title vmp-org-title">{org.get('title')}</h1>
        </div>

        <div className="pane vmp-list overflow-scroll">
          <div className="list has-header">
            <div
              className="item item-icon-left vmp-list-item vmp-active-text"
              onTouchTap={favOnClick}
            >
              <i className={starCls}></i>
              <span>{favText}</span>
            </div>

            <ContactsView binding={commonContactsBinding} />

            <div className="item item-text">
              [TODO] Справочники, разработка программного обеспечения
            </div>

            <DepartmentsView binding={orgBinding.sub('department')} organization={org.toJS()} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OrganizationCard;
