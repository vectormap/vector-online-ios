var React = require('react');
var M = require('morearty');
var OrganizationCardView = require('./OrganizationCardView');

var itemVeiws = {
  'organizations': OrganizationCardView
};

var ItemView = React.createClass({
  mixins: [M.Mixin],

  render: function() {
    var collection = this.getBinding('item').get('collection');
    var View = itemVeiws[collection];

    return (
      <View binding={this.getBinding()} />
    );
  }

});

module.exports = ItemView;
