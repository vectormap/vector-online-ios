var React = require('react');
var M = require('morearty');
var ContactsView = require('./ContactsView');
var controller = require('controller');
var {formatAddress, isValidAddress} = require('models/AddressModel');
var {navToMapWithPopup} = controller;

var DepartmentsView = React.createClass({
  mixins: [M.Mixin],

  renderDepartment (departmentBinding) {
    var department = departmentBinding.toJS();
    var {int_id, address, contact: contacts, schedule} = department;
    var addressLine = formatAddress(address, {withOffice: false});
    var {organization} = this.props;
    var onAddressClicked = null;

    if (isValidAddress(address)) {
      onAddressClicked = navToMapWithPopup.bind(controller, {address, organization, marker: true});
    }

    return (
      <div key={`department-${int_id}`}>
        <div
          className="item item-icon-left vmp-list-item vmp-item-divider"
          key={`address-${address.int_id}`}
          onClick={onAddressClicked}
        >
          <i className="icon ion-ios-home-outline"></i>
          <span>{addressLine}</span>
          <span className="item-desc">{address.office}</span>
        </div>

        <ContactsView binding={departmentBinding.sub('contact')} />
      </div>
    );
  },

  render () {
    var depsBinding = this.getBinding();
    var departments = depsBinding.get();

    if (!departments) {
      return null;
    }

    var departmentItems = departments.map(
      (department, i) => this.renderDepartment(depsBinding.sub(i)));

    return (
      <div>
        {departmentItems.toJS()}
      </div>
    );
  }
});

module.exports = DepartmentsView;
