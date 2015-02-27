// #!/usr/bin/env node

/**
 * Install all plugins listed in package.json
 */

var exec = require('child_process').exec;
var path = require('path');
var sys = require('sys');

var packageJSON = require('../../../package.json');

// var cmd = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
// var script = path.resolve(__dirname, '../../node_modules/cordova/bin', cmd);

packageJSON.cordovaPlugins = packageJSON.cordovaPlugins || [];

console.log('Removing plugins (%s):', packageJSON.cordovaPlugins.length, packageJSON.cordovaPlugins);

packageJSON.cordovaPlugins.forEach(function (plugin) {
  exec('cordova plugin rm ' + plugin, function (error, stdout, stderr) {
    sys.puts(error, stdout, stderr);
  });
});


