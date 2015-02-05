var React             = require('react');
var M                 = require('morearty');
var ItemView          = require('./ItemView');
var ErrorView         = require('./ErrorView');
var SearchResultsView = require('./SearchResultsView');
var NotFoundView      = require('./NotFoundView');
var {resolveView}     = require('utils');

var searchViews = {
  'results': SearchResultsView,
  'item': ItemView,
  'notFound': NotFoundView,
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
