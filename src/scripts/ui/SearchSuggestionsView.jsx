var React       = require('react');
var M           = require('morearty');
var collections = require('models/collections');
var controller  = require('controller');

var SearchSuggestionsView = React.createClass({
  mixins: [M.Mixin],

  onSuggestionClick (suggestionBinding) {
    controller.loadSelectedSuggestionItem(suggestionBinding.toJS());
  },

  renderSuggestionItem (suggestionBinding) {
    var suggestion   = suggestionBinding.toJS();
    var {collection} = suggestion;
    var title        = collections.formatTitle(collection, suggestion);
    var type         = collections.translate(collection).singular();
    var id           = collections.uniqId(collection, suggestion);

    return (
      <a className="item" key={id} onTouchEnd={this.onSuggestionClick.bind(this, suggestionBinding)}>
        {title}
        <span className="item-desc">{type}</span>
      </a>
    );
  },

  render () {
    var bSuggestions = this.getBinding();
    var list = bSuggestions.get().map(
      (suggestion, i) => this.renderSuggestionItem(bSuggestions.sub(i))
    ).toJS();

    return (
      <div className="SearchSuggestions list">
        {list}
      </div>
    );
  }

});

module.exports = SearchSuggestionsView;
