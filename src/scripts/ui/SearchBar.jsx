var M          = require('morearty');
var React      = require('react/addons');
var controller = require('controller');

var cx = React.addons.classSet;
var {toggle, set: linkTo} = M.Callback;
var {onSearchTyped} = controller;

var SearchBar = React.createClass({
  mixins: [M.Mixin],

  render () {
    var binding = this.getBinding();
    var isLoading = this.getBinding().get('status') === 'loading';
    var searchIcon = cx({
      'ion-ios7-search': !isLoading,
      'ion-loading-b': isLoading
    });

    return (
      <div className="vmp-search-bar bar-stable">
        <div className="bar-stable bar bar-header item-input-inset">
          <button className="button button-icon button-clear ion-navicon" onClick={toggle(binding, 'menuOpen')} />
          <label className="item-input-wrapper">
            <input type="search" onChange={onSearchTyped.bind(controller)} />
            <i className={searchIcon}></i>
          </label>
        </div>
      </div>
    );
  }

});

module.exports = SearchBar;
