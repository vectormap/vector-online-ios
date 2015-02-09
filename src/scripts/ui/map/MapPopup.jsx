var React = require('react');
var M = require('morearty');
var Modal  = require('ui/Modal');

var MapPopup = React.createClass({
  mixins: [M.Mixin],

  render () {
    var popupBinding = this.getBinding();
    var popupToggleBinding = popupBinding.sub('open');

    return (
      <Modal binding={popupToggleBinding} className="vmp-map-popup-modal" title="Modal title">
        <div className="bar">
          <h1 className="title">Title title title</h1>
        </div>
      </Modal>
    );
  }
});

module.exports = MapPopup;
