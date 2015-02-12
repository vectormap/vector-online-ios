var React = require('react/addons');
var M = require('morearty');
var {formatAddress} = require('models/AddressModel');
var controller = require('controller');
var {t, navToSearchByItem} = controller;

var AddressPopup = React.createClass({
  mixins: [M.Mixin],

  render () {
    var address = this.getBinding().toJS();

    console.log('address', address);

    if (!address) {
      return null;
    }

    var title = formatAddress(address);
    var {semantic} = address;

    return (
      <div>
        <div className="bar bar-stable">
          <h1 className="title">
            <i className="ion-ios-home-outline vmp-map-popup-title-icon"></i>
            {title}
          </h1>
        </div>
        <div className="content has-header">
          <div className="vmp-map-popup-content">
            {semantic &&
              <div>
                {semantic.name &&
                  <div className="vmp-map-popup-content-title vmp-table">
                    <div className="ion-ios-information-outline vmp-map-popup-icon vmp-cell"></div>
                    <div className="vmp-cell">{semantic.name}</div>
                  </div>}

                {semantic.purpose &&
                  <div className="vmp-map-popup-row">
                    <span className="vmp-map-popup-description">{t('geo.purpose')}: </span>
                    <span>{semantic.purpose}</span>
                  </div>}

                {semantic.area &&
                  <div className="vmp-map-popup-row">
                    <span className="vmp-map-popup-description">{t('geo.area')}: </span>
                    <span>{semantic.area}</span>
                  </div>}

                {semantic.postindex &&
                  <div className="vmp-map-popup-row">
                    <span className="vmp-map-popup-description">{t('geo.postal_index')}: </span>
                    <span>{semantic.postindex}</span>
                  </div>}
              </div>}
          </div>

        </div>
        <div className="content has-header">
          {address.orgs_count > 0 &&
            <div className="vmp-center vmp-map-popup-row vmp-map-popup-button">
              <button
                className="button button-small button-outline button-positive"
                onClick={navToSearchByItem.bind(controller, 'addresses', address.int_id)}
                >
                {`${t('geo.show_orgs')} (${address.orgs_count})`}
              </button>
            </div>}
        </div>
      </div>
    );
  }
});

module.exports = AddressPopup;
