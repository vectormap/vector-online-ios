var M          = require('morearty');
var React      = require('react/addons');
var controller = require('controller');
var status     = require('status-controller');
var {onTouch}  = require('utils');

var cx = React.addons.classSet;
var {
  onSearchTyped, onSearchFocused, navBack, hasNavHistory, t, clearSearchQuery, onSearchEnter
} = controller;

var SearchBar = React.createClass({
  mixins: [M.Mixin],

  render () {
    var binding = this.getBinding();
    var query = binding.get('search.query');
    var isLoading = status.is('loading');
    var searchIcon = cx({
      'ion-ios-search': !isLoading,
      'ion-load-b vmp-anim-spin': isLoading,
      'icon': true
    });

    return (
      <div className="">
        <div className="bar bar-header item-input-inset">
          {hasNavHistory() &&
            <a
              className="button icon-left ion-chevron-left button-clear button-positive vmp-back-button"
              onTouchTap={onTouch(navBack, controller)}
            />}
          <label className="item-input-wrapper">
            <i className={searchIcon}></i>
            <M.DOM.input type="search" name="search" id="vmp-search-input"
              placeholder={t('card.search')}
              value={query}
              onChange={onSearchTyped.bind(controller)}
              onKeyPress={M.Callback.onEnter(onSearchEnter.bind(controller))}
              onFocus={onSearchFocused.bind(controller)}
            />
            {query &&
              <i className="icon ion-close-round vmp-search-clear-btn"
                onTouchStart={clearSearchQuery.bind(controller)}></i>}
          </label>
        </div>
      </div>
    );
  }

});

module.exports = SearchBar;
