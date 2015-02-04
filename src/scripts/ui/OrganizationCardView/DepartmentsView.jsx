var React = require('react');
var M = require('morearty');

var DepartmentsView = React.createClass({
  mixins: [M.Mixin],

  renderDepartment (dep) {

  },

  render () {
    var departments = this.getBinding().get();

    if (!departments) {
      return null;
    }

    var departmentItems = departments.map(this.renderDepartment);

    return (
      <div />
    );
  }
});

module.exports = DepartmentsView;
