var React = require('react');

var SearchHistoryView = React.createClass({

  render: function() {
    return (
      <div className="list">
        <a className="item">
          История поиска
        </a>
        <a className="item">
          Вектор
        </a>
        <a className="item">
          кино
        </a>
        <a className="item">
          бары
        </a>
      </div>
    );
  }

});

module.exports = SearchHistoryView;
