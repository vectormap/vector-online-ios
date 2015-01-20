var React     = require('react');
var SearchBar = require('./SearchBar');

var MainLayout = React.createClass({

  render: function() {
    // menu content
    return (
      <div id="map" className="view-container" nav-view-transition="ios" nav-view-direction="none">
        <SearchBar />
      </div>
    );
  }

});

module.exports = MainLayout;
