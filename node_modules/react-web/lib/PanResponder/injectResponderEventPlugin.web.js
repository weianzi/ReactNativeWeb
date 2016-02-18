/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactLibEventPluginRegistry = require('react/lib/EventPluginRegistry');

var _reactLibEventPluginRegistry2 = _interopRequireDefault(_reactLibEventPluginRegistry);

var _reactLibResponderEventPlugin = require('react/lib/ResponderEventPlugin');

var _reactLibResponderEventPlugin2 = _interopRequireDefault(_reactLibResponderEventPlugin);

var _reactLibEventConstants = require('react/lib/EventConstants');

var _reactLibEventConstants2 = _interopRequireDefault(_reactLibEventConstants);

var _reactLibResponderTouchHistoryStore = require('react/lib/ResponderTouchHistoryStore');

var _reactLibResponderTouchHistoryStore2 = _interopRequireDefault(_reactLibResponderTouchHistoryStore);

var topLevelTypes = _reactLibEventConstants2['default'].topLevelTypes;
var dependencies;

if ('ontouchstart' in window) {
  dependencies = [topLevelTypes.topTouchStart, topLevelTypes.topTouchCancel, topLevelTypes.topTouchEnd, topLevelTypes.topTouchMove];
} else {
  // TODO: support move event
  dependencies = [topLevelTypes.topMouseDown, topLevelTypes.topMouseUp];
}

for (var eventType in _reactLibResponderEventPlugin2['default'].eventTypes) {
  _reactLibResponderEventPlugin2['default'].eventTypes[eventType].dependencies = dependencies;
}

function toArray(collection) {
  return collection && Array.prototype.slice.call(collection);
}

var argumentTimestamp = function argumentTimestamp(timestamp, touch) {
  touch.timestamp = timestamp;
};

var originRecordTouchTrack = _reactLibResponderTouchHistoryStore2['default'].recordTouchTrack;
_reactLibResponderTouchHistoryStore2['default'].recordTouchTrack = function (topLevelType, nativeEvent) {
  var timestamp = nativeEvent.timestamp || nativeEvent.timeStamp;

  if (nativeEvent.changedTouches) {
    var changedTouches = toArray(nativeEvent.changedTouches);
    changedTouches.forEach(argumentTimestamp.bind(null, timestamp));
  }

  originRecordTouchTrack.call(_reactLibResponderTouchHistoryStore2['default'], topLevelType, {
    changedTouches: changedTouches || [],
    touches: toArray(nativeEvent.touches) || []
  });
};

_reactLibEventPluginRegistry2['default'].injectEventPluginsByName({
  ResponderEventPlugin: _reactLibResponderEventPlugin2['default']
});