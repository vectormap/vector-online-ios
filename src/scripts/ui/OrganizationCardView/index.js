var React           = require('react/addons');
var M               = require('morearty');
var ContactsView    = require('./ContactsView');
var DepartmentsView = require('./DepartmentsView');
var controller      = require('controller');
var {List}          = require('immutable');
var {onTouch}       = require('utils');
var {getSibling}    = require('models/OrgModel');

var {
  addOrgToBookmarks, removeOrgFromBookmarks, t, navToSearchByItem
} = controller;
var cx = React.addons.classSet;

var OrganizationCard = React.createClass({
  mixins: [M.Mixin],

  renderRubrics (rubrics = List()) {
    return rubrics.map((r, i) => {
      var id = r.get('int_id');
      var isLast = i === rubrics.size - 1;

      return (
        <span
          className="positive vmp-active-text vmp-list-item"
          onTouchTap={onTouch(navToSearchByItem, controller, 'rubrics', id)}
          key={`rubric-${id}`}
        >
          {r.get('name')}
          {!isLast && <span>, </span>}
        </span>
      );
    });
  },

  render () {
    var orgBinding = this.getBinding('item').sub('data.result.0');
    var org = orgBinding.get();
    var orgRaw = org.toJS();

    if (!org) {
      return null;
    }

    var sibling = getSibling(orgRaw);
    var commonContactsBinding = orgBinding.sub('contact');
    var favOnClick;
    var starCls;
    var favText;

    if (controller.isOrgInBookmarks(org)) {
      favText = t('card.remove_from_favorites');
      starCls = 'icon ion-ios-star vmp-fav-highlight';
      favOnClick = removeOrgFromBookmarks.bind(controller, org);
    } else {
      favText = t('card.add_to_favorites');
      starCls = 'icon ion-ios-star-outline';
      favOnClick = addOrgToBookmarks.bind(controller, org);
    }

    var rubrics = this.renderRubrics(org.get('rubric'));

    // TODO: put extra div wrapper to be able to set key property (WTF !?!?!?)
    return (
      <div>
        <div key={`organization-${org.get('int_id')}`}>
          <div className="bar">
            <h1 className="title vmp-org-title">{org.get('title')}</h1>
          </div>

          <div className="pane vmp-list overflow-scroll">
            <div className="list has-header">
              <div
                className="item item-icon-left vmp-list-item vmp-active-text"
                onTouchTap={onTouch(favOnClick)}
              >
                <i className={starCls}></i>
                <span>{favText}</span>
              </div>

              <ContactsView binding={commonContactsBinding} />
              <DepartmentsView binding={orgBinding.sub('department')} organization={orgRaw} />

              <div className="item item-text vmp-rubrics-item">
                {rubrics.toJS()}
              </div>

              {sibling &&
                <div
                  className="vmp-org-sibling vmp-list-item"
                  onTouchTap={onTouch(navToSearchByItem, controller, 'organizations', sibling.orgId)}
                >
                  <div className="hint">{t('card.sibling.hint')}</div>
                  <div className="vmp-sibling-text" dangerouslySetInnerHTML={{__html: sibling.text}} />
                  <div className="vmp-org-title">{sibling.orgTitle}</div>
                </div>}

            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OrganizationCard;
