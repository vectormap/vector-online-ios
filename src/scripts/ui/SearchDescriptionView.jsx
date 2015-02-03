var React = require('react');
var M = require('morearty');
var {formatTitle, translate} = require('models/collections');

var SearchDescriptionView = React.createClass({
  mixins: [M.Mixin],

  render () {
    var count = this.getBinding().get('data.result_count');
    var criteria = this.getBinding().toJS('search_criteria') || {};
    var {collection, doc} = criteria;
    var title = doc && formatTitle(collection, doc);

    return (
      <div className="bar">
        <div className="title">
          <span>{title}</span>
          <span className="badge header">{count}</span>
        </div>
      </div>
    );
  }
});

module.exports = SearchDescriptionView;









