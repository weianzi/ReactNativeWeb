/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactInteractionManager
 */
'use strict';

module.exports = {
  createInteractionHandle: function createInteractionHandle() {},
  clearInteractionHandle: function clearInteractionHandle() {},
  runAfterInteractions: function runAfterInteractions(cb) {
    cb();
  }
};