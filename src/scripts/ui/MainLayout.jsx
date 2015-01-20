var M         = require('morearty');
var React     = require('react/addons');
var SearchBar = require('./SearchBar');
var cx        = React.addons.classSet;

var MainLayout = React.createClass({
  mixins: [M.Mixin],

  render: function() {
    var binding = this.getBinding();
    var menuOpenCls = cx({'vmp-menu-open': binding.get('menuOpen')})

    return (
      <div className={'menu-content pane menu-animated ' + menuOpenCls}>
        <SearchBar binding={binding} />
        <div id="map" className="view-container" nav-view-transition="ios" nav-view-direction="none">
        </div>
      </div>
    );
  }

});

module.exports = MainLayout;
