var M          = require('morearty');
var React      = require('react/addons');
var controller = require('controller');
var status     = require('status-controller');

var cx = React.addons.classSet;
var {
  onSearchTyped, onSearchFocused, navBack, hasNavHistory
} = controller;
var {onEnter} = M.Callback;

var SearchBar = React.createClass({
  mixins: [M.Mixin],

  render () {
    var binding = this.getBinding();
    var query = binding.get('search.query');
    var isLoading = status.is('loading');
    var searchIcon = cx({
      'ion-ios-search': !isLoading,
      'ion-load-b vmp-anim-spin': isLoading
    });

    var _onSearchTyped = onSearchTyped.bind(controller);

    return (
      <div className="vmp-search-bar bar-stable">
        <div className="bar item-input-inset">
          {hasNavHistory() &&
            <a
              className="button icon-left ion-chevron-left button-clear button-positive vmp-back-button"
              onClick={navBack.bind(controller)}
            />}
          <label className="item-input-wrapper">
            <M.DOM.input type="search"
              value={query}
              onChange={_onSearchTyped}
              onKeyPress={M.Callback.onEnter(_onSearchTyped)}
              onFocus={onSearchFocused.bind(controller)} />
            <i className={searchIcon}></i>
          </label>
        </div>
      </div>
    );
  }

});

module.exports = SearchBar;
