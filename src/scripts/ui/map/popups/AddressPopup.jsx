var React = require('react/addons');
var M = require('morearty');
var {formatAddress} = require('models/AddressModel');
var controller = require('controller');
var {t, navToSearchByItem} = controller;
var {toggle} = M.Callback;
var cx = React.addons.classSet;

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
    var orgBtnMeta = this.getBinding().meta().sub('orgsButtonToggle');
    var activeCls = cx({'active': orgBtnMeta.get()});
    var orgsButtonToggle = toggle(orgBtnMeta);

    return (
      <div>
        <div className="bar bar-stable">
          <h1 className="title">
            <i className="ion-ios7-home-outline vmp-map-popup-title-icon"></i>
            {title}
          </h1>
        </div>
        <div className="content has-header">
          <div className="vmp-map-popup-content">
            {semantic &&
              <div>
                {semantic.name &&
                  <div className="vmp-address-popup-semantic-name">
                    <div className="ion-ios7-information-outline vmp-map-popup-icon vmp-cell"></div>
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
                className={"button button-small button-outline button-positive " + activeCls}
                onTouchStart={orgsButtonToggle}
                onTouchEnd={orgsButtonToggle}
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
