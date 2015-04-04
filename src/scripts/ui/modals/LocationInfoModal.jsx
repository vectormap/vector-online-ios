var React = require('react/addons');
var Modal = require('ui/Modal');
var M     = require('morearty');

var cx    = React.addons.classSet;

var LocationInfoModal = React.createClass({
  mixins: [M.Mixin],

  render () {
    var text = this.getBinding().get('error') || this.getBinding().get('content');

    return (
      <Modal
        backdrop={false}
        header={false}
        hideAfter={3000}
        className={'vmp-location-modal vmp-center'}
        binding={this.getBinding()}
        toggleBinding={this.getBinding().sub('infoModal')}
      >
        <div className="location-info">{text}</div>
      </Modal>
    );
  }

});

module.exports = LocationInfoModal;
