var imm = require('immutable').fromJS;

var statusBinding;

function setStatus (status) {
  statusBinding.set(status);
}

var StatusController = {
  init (_statusBinding) {
    statusBinding = _statusBinding;
  },

  loading () {
    setStatus('loading');
  },

  error (err) {
    setStatus(imm(err));
  },

  clear () {
    setStatus(null);
  },

  is (status) {
    return status === this.getStatus();
  },

  getStatus () {
    return statusBinding.get();
  }
};

module.exports = StatusController;
