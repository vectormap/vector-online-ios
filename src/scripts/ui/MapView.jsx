var React = require('react');
var M     = require('morearty');
var mapController = require('map-controller');

var MapView = React.createClass({
  mixins: [M.Mixin],

  componentDidMount: function () {
    mapController.initMap(this.refs.map.getDOMNode());
  },

  render () {
    return (
      <div ref="map" className="pane" />
    );
  }
});

module.exports = MapView;
