/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactTouchableBounce
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ReactAnimated = require('ReactAnimated');

var _ReactAnimated2 = _interopRequireDefault(_ReactAnimated);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactTouchable = require('ReactTouchable');

/**
 * When the scroll view is disabled, this defines how far your touch may move
 * off of the button, before deactivating the button. Once deactivated, try
 * moving it back and you'll see that the button is once again reactivated!
 * Move it back and forth several times while the scroll view is disabled.
 */
var PRESS_RECT_OFFSET = { top: 20, left: 20, right: 20, bottom: 30 };
/**
 * Example of using the `TouchableMixin` to play well with other responder
 * locking views including `ScrollView`. `TouchableMixin` provides touchable
 * hooks (`this.touchableHandle*`) that we forward events to. In turn,
 * `TouchableMixin` expects us to implement some abstract methods to handle
 * interesting interactions such as `handleTouchablePress`.
 */
var TouchableBounce = _react2['default'].createClass({
  displayName: 'TouchableBounce',

  mixins: [_ReactTouchable.Mixin],

  propTypes: {
    onPress: _react2['default'].PropTypes.func,
    onPressIn: _react2['default'].PropTypes.func,
    onPressOut: _react2['default'].PropTypes.func,
    // The function passed takes a callback to start the animation which should
    // be run after this onPress handler is done. You can use this (for example)
    // to update UI before starting the animation.
    onPressWithCompletion: _react2['default'].PropTypes.func,
    // the function passed is called after the animation is complete
    onPressAnimationComplete: _react2['default'].PropTypes.func
  },

  getInitialState: function getInitialState() {
    return _extends({}, this.touchableGetInitialState(), {
      scale: new _ReactAnimated2['default'].Value(1)
    });
  },

  bounceTo: function bounceTo(value, velocity, bounciness, callback) {
    _ReactAnimated2['default'].spring(this.state.scale, {
      toValue: value,
      velocity: velocity,
      bounciness: bounciness
    }).start(callback);
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn: function touchableHandleActivePressIn(e) {
    this.bounceTo(0.93, 0.1, 0);
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function touchableHandleActivePressOut(e) {
    this.bounceTo(1, 0.4, 0);
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandlePress: function touchableHandlePress(e) {
    var _this = this;

    var onPressWithCompletion = this.props.onPressWithCompletion;
    if (onPressWithCompletion) {
      onPressWithCompletion(function () {
        _this.state.scale.setValue(0.93);
        _this.bounceTo(1, 10, 10, _this.props.onPressAnimationComplete);
      });
      return;
    }

    this.bounceTo(1, 10, 10, this.props.onPressAnimationComplete);
    this.props.onPress && this.props.onPress(e);
  },

  touchableGetPressRectOffset: function touchableGetPressRectOffset() {
    return PRESS_RECT_OFFSET; // Always make sure to predeclare a constant!
  },

  touchableGetHighlightDelayMS: function touchableGetHighlightDelayMS() {
    return 0;
  },

  render: function render() {
    return _react2['default'].createElement(
      _ReactAnimated2['default'].View,
      {
        style: [{ transform: [{ scale: this.state.scale }] }, this.props.style],
        accessible: true,
        testID: this.props.testID,
        onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
        onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
        onResponderGrant: this.touchableHandleResponderGrant,
        onResponderMove: this.touchableHandleResponderMove,
        onResponderRelease: this.touchableHandleResponderRelease,
        onResponderTerminate: this.touchableHandleResponderTerminate },
      this.props.children
    );
  }
});

module.exports = TouchableBounce;