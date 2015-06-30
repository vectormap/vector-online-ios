var React = require('react/addons');
var Modal = require('ui/Modal');
var M     = require('morearty');
var {t}   = require('controller');
var cx    = React.addons.classSet;

var DonwloadLinksModal = React.createClass({
  mixins: [M.Mixin],

  render () {
    var toggleBinding = this.getBinding().sub('downloadLinksModal');

    return (
      <Modal
        backdrop={false}
        header={false}
        className={'vmp-download-links-modal vmp-center'}
        binding={this.getBinding()}
        toggleBinding={toggleBinding}
      >
        <div className="links vmp-table">
          <a href={t('vmp_url') + '/ios'} target="_" className="link vmp-cell">
            <div className="icon ios"></div>
            <div className="title">iOS</div>
          </a>
          <a href={t('vmp_url') + '/android'} target="_" className="link vmp-cell">
            <div className="icon android"></div>
            <div className="title">Android</div>
          </a>
          <a href={t('vmp_url') + '/wp'} target="_" className="link vmp-cell">
            <div className="icon windows"></div>
            <div className="title">Win Phone</div>
          </a>
          <button className="close-btn button button-clear vmp-modal-close-button" onClick={M.Callback.toggle(toggleBinding)}>
            <i className="ion-ios-close-outline vmp-modal-close-button-icon"></i>
          </button>
        </div>
      </Modal>
    );
  }

});

module.exports = DonwloadLinksModal;
