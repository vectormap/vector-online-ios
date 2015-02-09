var React = require('react/addons');
var M     = require('morearty');
var mapController = require('map-controller');
var {CSSTransitionGroup} = React.addons;

var MapView = React.createClass({
  mixins: [M.Mixin],

  componentDidMount: function () {
    mapController.initMap(this.refs.map.getDOMNode());
  },

  render () {
    return (
      <div>
        <div ref="map" className="pane" />
          <CSSTransitionGroup transitionName="vmp-modal" component="div">
            {this.getBinding().get('modal') &&
              <div className="modal vmp-modal" key={`modal-${Date.now()}`}>
                <div className="bar bar-header disable-user-behavior">
                  <h1 className="title">Geo popup [test]</h1>
                  <div className="buttons">
                    <button className="button button-clear" ng-click="closeLogin()">Отмена</button>
                  </div>
                </div>
              </div>}
          </CSSTransitionGroup>
      </div>
    );
  }
});

module.exports = MapView;
