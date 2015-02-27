var React = require('react');
var M = require('morearty');
var Modal = require('ui/Modal');
var controller = require('controller');
var {tryToConnect} = require('network-monitor-controller');
var {t} = controller;

var NoConnectionModal = React.createClass({
  mixins: [M.Mixin],

  render () {
    var modalBinding = this.getBinding().sub('noConnection');

    return (
      <Modal
        binding={this.getBinding()}
        toggleBinding={modalBinding}
        header={false}
      >
        <div>
          <div className="bar bar-header disable-user-behavior">
            <h1 className="title">{t('connection_not_available')}</h1>
          </div>
          <div className="content has-header">
            <div className="card">
              <div className="item item-text-wrap vmp-center">
                <span className="vmp-title">Проверьте подключение к интернету</span>
              </div>
              <div className="item try-again vmp-center">
                <button className="button button-small button-outline button-positive" onTouchTap={tryToConnect}>
                  {t('try_again')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
});

module.exports = NoConnectionModal;
