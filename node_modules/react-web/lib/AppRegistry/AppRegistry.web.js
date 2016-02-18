/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactAppRegistry
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ReactRenderApplication = require('ReactRenderApplication');

var _ReactRenderApplication2 = _interopRequireDefault(_ReactRenderApplication);

var runnables = {};

/**
 * `AppRegistry` is the JS entry point to running all React Native apps.  App
 * root components should register themselves with
 * `AppRegistry.registerComponent`, then the native system can load the bundle
 * for the app and then actually run the app when it's ready by invoking
 * `AppRegistry.runApplication`.
 *
 * `AppRegistry` should be `require`d early in the `require` sequence to make
 * sure the JS execution environment is setup before other modules are
 * `require`d.
 */
var AppRegistry = {
  registerConfig: function registerConfig(config) {
    for (var i = 0; i < config.length; ++i) {
      var appConfig = config[i];
      if (appConfig.run) {
        AppRegistry.registerRunnable(appConfig.appKey, appConfig.run);
      } else {
        AppRegistry.registerComponent(appConfig.appKey, appConfig.component);
      }
    }
  },

  registerComponent: function registerComponent(appKey, getComponentFunc) {
    runnables[appKey] = {
      run: function run(appParameters) {
        return (0, _ReactRenderApplication2['default'])(getComponentFunc(), appParameters.initialProps, appParameters.rootTag);
      }
    };
    return appKey;
  },

  registerRunnable: function registerRunnable(appKey, func) {
    runnables[appKey] = {
      run: func
    };
    return appKey;
  },

  getAppKeys: function getAppKeys() {
    return Object.keys(runnables);
  },

  runApplication: function runApplication(appKey, appParameters) {
    runnables[appKey].run(appParameters);
  }
};

module.exports = AppRegistry;