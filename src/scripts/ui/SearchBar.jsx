var React = require('react');

var SearchBar = React.createClass({

  render: function() {
    return (
      <div className="bar-stable">
        <div className="bar-stable bar bar-header item-input-inset">
          <button className="button button-icon button-clear ion-navicon" menu-toggle="left" />
          <label className="item-input-wrapper">
            <input type="search" placeholder="Search" />
            <i className="icon ion-ios7-search placeholder-icon"></i>
          </label>
        </div>
      </div>
    );
  }

});

module.exports = SearchBar;
