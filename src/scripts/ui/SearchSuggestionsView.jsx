var React = require('react');
var M = require('morearty');
var collections = require('models/collections');

var SearchSuggestionsView = React.createClass({
  mixins: [M.Mixin],

  renderSuggestionItem (collection, suggestion) {
    var s     = suggestion.toJS();
    var title = collections.formatTitle(collection, s);
    var type  = collections.translate(collection).singular();
    var id    = collections.uniqId(collection, s);

    return (
      <a className="item" key={id}>
        {title}
        <span className="item-desc">{type}</span>
      </a>
    );
  },

  render () {
    var bSuggestions = this.getBinding();
    var list = bSuggestions.get().map((suggestions, collection) => {
      return suggestions.map(s => this.renderSuggestionItem(collection, s));
    }).flatten().toJS();

    console.log('>>', list);

    return (
      <div className="SearchSuggestions list">
        {list}
      </div>
    );
  }

});

module.exports = SearchSuggestionsView;
