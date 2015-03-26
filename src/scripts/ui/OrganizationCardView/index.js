var React = require('react/addons');
var M = require('morearty');
var ContactsView = require('./ContactsView');
var DepartmentsView = require('./DepartmentsView');
var controller = require('controller');
var {List} = require('immutable');
var {onTouch} = require('utils');

var {addOrgToBookmarks, removeOrgFromBookmarks, t, navToSearchByItem} = controller;
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

    var rubrics = this.renderRubrics(org.get('rubric'));

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
              onTouchTap={onTouch(favOnClick)}
            >
              <i className={starCls}></i>
              <span>{favText}</span>
            </div>

            <ContactsView binding={commonContactsBinding} />
            <DepartmentsView binding={orgBinding.sub('department')} organization={org.toJS()} />

            <div className="item item-text vmp-rubrics-item">
              {rubrics.toJS()}
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = OrganizationCard;
