var M        = require('morearty');
var React    = require('react');
var {toggle} = M.Callback;

var SearchBar = React.createClass({
  mixins: [M.Mixin],

  render () {
    var binding = this.getBinding();

    return (
      <div className="bar-stable">
        <div className="bar-stable bar bar-header item-input-inset">
          <button className="button button-icon button-clear ion-navicon" onClick={toggle(binding, 'menuOpen')} />
          <label className="item-input-wrapper">
            <input type="search" placeholder="Search" />
            <i className="icon ion-ios7-search placeholder-icon"></i>
          </label>
        </div>
      </div>
    );
  }

});

module.exports = SearchBar;
