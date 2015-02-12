var React = require('react');
var M = require('morearty');
var {formatAddress} = require('models/AddressModel');

var OrganizationPopup = React.createClass({
  mixins: [M.Mixin],

  render () {
    var address = this.getBinding().toJS('address');
    var organization = this.getBinding().toJS('organization');

    if (!address && !organization) {
      return;
    }

    var addressLine = formatAddress(address, {withOffice: false});

    return (
      <div>
        <div className="bar bar-stable">
          <h1 className="title">
            <i className="ion-ios-home-outline vmp-map-popup-title-icon"></i>
            {addressLine}
          </h1>
        </div>

        <div className="content has-header">
          <div className="vmp-map-popup-content">
            <div className="vmp-map-popup-content-title vmp-table">
              <div className="ion-ios-briefcase-outline vmp-map-popup-icon vmp-cell"></div>
              <div className="vmp-cell">{organization.title}</div>
            </div>

            {address.office &&
              <div className="vmp-map-popup-row">
                <span>{address.office}</span>
              </div>}

          </div>
        </div>
      </div>
    );
  }
});

module.exports = OrganizationPopup;
