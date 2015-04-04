var React         = require('react/addons');
var M             = require('morearty');
var mapController = require('map-controller');
var MapPopup      = require('./MapPopup');

var MapView = React.createClass({
  mixins: [M.Mixin],

  componentDidMount: function () {
    console.log('MapView componentDidMount');
    mapController.initMap(this.refs.map.getDOMNode());
  },

  render () {
    return (
      <div>
        <div ref="map" className="pane" />
        <MapPopup binding={this.getBinding().sub('popup')} />
      </div>
    );
  }
});

module.exports = MapView;
