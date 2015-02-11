var React = require('react/addons');
var M     = require('morearty');

var {CSSTransitionGroup} = React.addons;
var cx = React.addons.classSet;
var {toggle} = M.Callback;

var Modal = React.createClass({
  mixins: [M.Mixin],

  propTypes: {
    binding: React.PropTypes.instanceOf(M.Binding).isRequired,
    toggleBinding: React.PropTypes.instanceOf(M.Binding).isRequired
  },

  getDefaultProps() {
    return {
      title: '',
      className: '',
      key: 'vmp-modal',
      transitionGroup: { // CSSTransitionGroup specific props
        transitionName: 'vmp-modal',
        component: 'div'
      }
    };
  },

  render () {
    var {toggleBinding} = this.props;

    return (
      <CSSTransitionGroup {...this.props.transitionGroup}>
        {toggleBinding.get() &&
          <div className={cx('modal', this.props.className)} key={this.props.key}>
            <button className="button button-clear vmp-modal-close-button" onClick={toggle(toggleBinding)}>
              <i className="ion-ios-close-outline vmp-modal-close-button-icon"></i>
            </button>
            <div className="vmp-modal-body">
              {this.props.children}
            </div>
          </div>}
      </CSSTransitionGroup>
    );
  }
});

module.exports = Modal;
