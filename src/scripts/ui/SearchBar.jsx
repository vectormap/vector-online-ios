var M          = require('morearty');
var React      = require('react/addons');
var controller = require('controller');
var status     = require('status-controller');

var cx = React.addons.classSet;
var {
  onSearchTyped, onSearchFocused, navBack, hasNavHistory, t
} = controller;

var SearchBar = React.createClass({
  mixins: [M.Mixin],

  clearQuery () {
    this.getBinding().clear('search.query');
  },

  render () {
    var binding = this.getBinding();
    var query = binding.get('search.query');
    var isLoading = status.is('loading');
    var searchIcon = cx({
      'ion-ios-search': !isLoading,
      'ion-load-b vmp-anim-spin': isLoading,
      'icon': true
    });

    var _onSearchTyped = onSearchTyped.bind(controller);

    return (
      <div className="">
        <div className="bar bar-header item-input-inset">
          {hasNavHistory() &&
            <a
              className="button icon-left ion-chevron-left button-clear button-positive vmp-back-button"
              onClick={navBack.bind(controller)}
            />}
          <label className="item-input-wrapper">
            <i className={searchIcon}></i>
            <M.DOM.input type="search"
              placeholder={t('card.search')}
              value={query}
              onChange={_onSearchTyped}
              onKeyPress={M.Callback.onEnter(_onSearchTyped)}
              onFocus={onSearchFocused.bind(controller)}
            />
            {query && <i className="icon ion-close-round" onClick={this.clearQuery}></i>}
          </label>
        </div>
      </div>
    );
  }

});

module.exports = SearchBar;
