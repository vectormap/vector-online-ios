var React = require('react');
var {t} = require('controller');

var NotResultsView = React.createClass({

  render: function() {
    return (
      <div className="pane">
        <div className="card">
          <div className="item item-text-wrap vmp-center">
            <span className="vmp-title">{t('card.search.not_found')}</span>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = NotResultsView;
