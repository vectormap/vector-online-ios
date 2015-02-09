var React = require('react/addons');
var M     = require('morearty');

var {CSSTransitionGroup} = React.addons;
var cx = React.addons.classSet;
var {toggle} = M.Callback;

var Modal = React.createClass({
  mixins: [M.Mixin],

  getDefaultProps() {
    return {
      title: '',
      className: '',
      transitionGroup: { // CSSTransitionGroup specific props
        transitionName: 'vmp-modal',
        component: 'div'
      }
    };
  },

  render () {
    var modalToggleBinding = this.getBinding();

    return (
      <CSSTransitionGroup {...this.props.transitionGroup}>
        {modalToggleBinding.get() &&
          <div className={cx('modal', this.props.className)} key="vmp-modal">
            <div className="bar">
              <h1 className="title">{this.props.title}</h1>
              <div className="buttons">
                <button className="button button-clear" onClick={toggle(modalToggleBinding)}>
                  <i className="ion-ios7-close-outline vmp-modal-close-button"></i>
                </button>
              </div>
            </div>
            <div className="vmp-modal-body">
              {this.props.children}
            </div>
          </div>}
      </CSSTransitionGroup>
    );
  }
});

module.exports = Modal;
