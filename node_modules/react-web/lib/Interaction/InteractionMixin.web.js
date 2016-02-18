/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @providesModule ReactInteractionMixin
 * 
 */
'use strict';

/**
 * This mixin provides safe versions of InteractionManager start/end methods
 * that ensures `clearInteractionHandle` is always called
 * once per start, even if the component is unmounted.
 */
var InteractionMixin = {
  componentWillUnmount: function componentWillUnmount() {},

  _interactionMixinHandles: [],

  createInteractionHandle: function createInteractionHandle() {},

  clearInteractionHandle: function clearInteractionHandle(clearHandle) {},

  /**
   * Schedule work for after all interactions have completed.
   *
   * @param {function} callback
   */
  runAfterInteractions: function runAfterInteractions(callback) {}
};

module.exports = InteractionMixin;