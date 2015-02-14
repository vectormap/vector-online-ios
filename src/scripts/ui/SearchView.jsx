var React             = require('react');
var M                 = require('morearty');
var ItemView          = require('./ItemView');
var ErrorView         = require('./ErrorView');
var SearchResultsView = require('./SearchResultsView');
var SearchHistoryView = require('./SearchHistoryView');
var NoResultsView      = require('./NoResultsView');
var {resolveView}     = require('utils');

var searchViews = {
  'history': SearchHistoryView,
  'results': SearchResultsView,
  'item': ItemView,
  'noResults': NoResultsView,
  'error': ErrorView
};

var SearchView = React.createClass({
  mixins: [M.Mixin],

  resolveSearchView () {
    var searchBinding = this.getBinding();
    var View = resolveView(searchViews, searchBinding, 'view.name');

    return View;
  },

  render () {
    var View = this.resolveSearchView();
    var searchBinding = this.getBinding();

    if (!View) {
      return null;
    }

    return (
      <View binding={searchBinding} />
    );
  }
});

module.exports = SearchView;
