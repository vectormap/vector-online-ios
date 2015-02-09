var React         = require('react/addons');
var M             = require('morearty');
var Modal         = require('./Modal');
var mapController = require('map-controller');

var MapView = React.createClass({
  mixins: [M.Mixin],

  componentDidMount: function () {
    mapController.initMap(this.refs.map.getDOMNode());
  },

  render () {
    var popupToggleBinding = this.getBinding().sub('popup.open');

    return (
      <div>
        <div ref="map" className="pane" />
        <Modal binding={popupToggleBinding} className="vmp-map-popup-modal" title="Modal title">

        </Modal>
      </div>
    );
  }
});

module.exports = MapView;
