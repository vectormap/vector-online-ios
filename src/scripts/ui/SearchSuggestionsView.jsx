var React = require('react');
var M = require('morearty');

var SearchSuggestionsView = React.createClass({
  mixins: [M.Mixin],

  render: function() {
    return (
      <div className="list">
        <a className="item">
          Ленина проспект 45
          <span className="item-desc">Адрес</span>
        </a>
        <a className="item">
          Вектор, ООО
          <span className="item-desc">Адрес</span>
        </a>
        <a className="item">
          Рога и Копыта, ООО
          <span className="item-desc">Адрес</span>
        </a>
        <a className="item">
          Одиннадцатиклассница Одиннадцатиклассница Одиннадцатиклассница
          <span className="item-desc">Адрес</span>
        </a>
      </div>
    );
  }

});

module.exports = SearchSuggestionsView;
