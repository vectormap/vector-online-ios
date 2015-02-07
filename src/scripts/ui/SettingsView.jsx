var React = require('react');
var M = require('morearty');

var SettingsView = React.createClass({
  mixins: [M.Mixin],

  render () {
    return (
      <div className="pane">
        <h1>SettingsView</h1>
      </div>
    );
  }
});

module.exports = SettingsView;
