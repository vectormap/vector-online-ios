var React = require('react');
var M = require('morearty');

var SettingsView = React.createClass({
  mixins: [M.Mixin],

  render () {
    return (
      <h1>SettingsView</h1>
    );
  }
});

module.exports = SettingsView;
