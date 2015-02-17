var React = require('react');
var M = require('morearty');
var Modal = require('./Modal');
var CitySelectorModal = require('./modals/CitySelectorModal');
var NoConnectionModal = require('./modals/NoConnectionModal');

var modals = {
  'citySelector': CitySelectorModal,
  'noConnection': NoConnectionModal
};

var ActiveModal = React.createClass({
  mixins: [M.Mixin],

  render () {
    var modalBinding = this.getBinding().sub('modal');
    var ModalContent = modals[modalBinding.get()] || 'div';

    return (
      <Modal
        binding={this.getBinding()}
        toggleBinding={modalBinding}
        header={false}>
        <ModalContent binding={this.getBinding()} />
      </Modal>
    );
  }
});

module.exports = ActiveModal;
