var _ = require('lodash');

// concat strings with space
function concat () {
  var args = _.toArray(arguments);

  return args.join(' ');
}

module.exports = concat;
