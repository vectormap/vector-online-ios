var React = require('react');
var M = require('morearty');

var OrganizationCard = React.createClass({
  mixins: [M.Mixin],

  render () {
    return (
      <div className="pane vmp-list" nav-view="active">
        <div className="list">
          <div className="item">
            <h3>Вектор, электронный справочник</h3>
          </div>

          <div className="item item-icon-left">
            <i className="icon ion-ios7-telephone"></i>
            44-22-44
            <span className="item-desc">телефон</span>
          </div>
          <div className="item item-icon-left">
            <i className="icon ion-ios7-world-outline"></i>
            Реквизиты организации
            <span className="item-desc">сайт</span>
          </div>
          <div className="item item-icon-left">
            <i className="icon ion-ios7-email-outline"></i>
            vmp.ru
            <span className="item-desc">сайт</span>
          </div>
          <div className="item item-icon-left">
            <i className="icon ion-ios7-email-outline"></i>
            info@vmp.ru
            <span className="item-desc">e-mail</span>
          </div>
          <div className="item item-text">
            Справочники, разработка программного обеспечения
          </div>

          <div className="item item-icon-left item-divider">
            <i className="icon ion-ios7-home"></i>
            30 лет победы, 19 - оф. 302a
            <span className="item-desc">адрес</span>
          </div>
          <div className="item item-icon-left">
            <i className="icon ion-ios7-telephone"></i>
            44-20-22
            <span className="item-desc">телефон</span>
          </div>
          <div className="item item-icon-left">
            <i className="icon ion-ios7-telephone"></i>
            44-20-22
            <span className="item-desc">телефон</span>
          </div>
          <div className="item item-icon-left">
            <i className="icon ion-ios7-telephone"></i>
            44-20-22
            <span className="item-desc">телефон</span>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OrganizationCard;
