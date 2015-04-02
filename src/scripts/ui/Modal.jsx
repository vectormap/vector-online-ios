var React = require('react/addons');
var M     = require('morearty');

var {CSSTransitionGroup} = React.addons;
var cx = React.addons.classSet;
var {onTouch} = require('utils');
var {toggle} = M.Callback;

var Modal = React.createClass({
  mixins: [M.Mixin],

  propTypes: {
    toggleBinding: React.PropTypes.instanceOf(M.Binding).isRequired
  },

  getDefaultProps() {
    return {
      className: '',
      key: 'vmp-modal',
      header: true,
      backdrop: true,
      hideAfter: null,
      transitionGroup: { // CSSTransitionGroup specific props
        transitionName: 'vmp-modal',
        component: 'div'
      }
    };
  },

  getInitialState () {
    return {};
  },

  componentDidUpdate () {
    var {hideAfter, toggleBinding} = this.props;
    var isActive = toggleBinding.get();

    if (isActive) {
      if (hideAfter && hideAfter > 0 && !this.state.timerId) {
        this.state.timerId = setTimeout(toggle(toggleBinding), hideAfter);
      }
    } else {
      this.state.timerId = null;
    }
  },

  render () {
    var {toggleBinding: modalTriggerBinding, header} = this.props;
    var isActive = modalTriggerBinding.get();
    var backdropCls = cx({
      'modal-backdrop active': isActive && this.props.backdrop
    });

    return (
      <div className={backdropCls}>
        <CSSTransitionGroup {...this.props.transitionGroup}>
          {isActive &&
            <div className={cx('modal', this.props.className)} key={this.props.key}>
              {header &&
                <button
                  className="button button-clear vmp-modal-close-button"
                  onTouchEnd={onTouch(toggle(modalTriggerBinding))}
                >
                  <i className="ion-ios-close-outline vmp-modal-close-button-icon"></i>
                </button>}
              <div className="vmp-modal-body">
                {this.props.children}
              </div>
            </div>}
        </CSSTransitionGroup>
      </div>
    );
  }
});

module.exports = Modal;
