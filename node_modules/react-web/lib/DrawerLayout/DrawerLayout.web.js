/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactDrawerLayout
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactStyleSheet = require('ReactStyleSheet');

var _ReactStyleSheet2 = _interopRequireDefault(_ReactStyleSheet);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _ReactAnimated = require('ReactAnimated');

var _ReactAnimated2 = _interopRequireDefault(_ReactAnimated);

var _ReactPanResponder = require('ReactPanResponder');

var _ReactPanResponder2 = _interopRequireDefault(_ReactPanResponder);

var _ReactDimensions = require('ReactDimensions');

var _ReactDimensions2 = _interopRequireDefault(_ReactDimensions);

var DEVICE_WIDTH = parseFloat(_ReactDimensions2['default'].get('window').width);
var THRESHOLD = DEVICE_WIDTH / 2;
var VX_MAX = 0.1;

var IDLE = 'Idle';
var DRAGGING = 'Dragging';
var SETTLING = 'Settling';

var DrawerLayout = _react2['default'].createClass({
  displayName: 'DrawerLayout',

  statics: {
    positions: {
      Left: 'left',
      Right: 'right'
    }
  },

  getDefaultProps: function getDefaultProps() {
    return {
      drawerWidth: 0,
      drawerPosition: 'left'
    };
  },

  propTypes: {
    drawerWidth: _react.PropTypes.number.isRequired,
    drawerPosition: _react.PropTypes.oneOf(['left', 'right']).isRequired,
    renderNavigationView: _react.PropTypes.func.isRequired,

    onDrawerSlide: _react.PropTypes.func,
    onDrawerStateChanged: _react.PropTypes.func,

    onDrawerOpen: _react.PropTypes.func,
    onDrawerClose: _react.PropTypes.func,

    /* Not implemented */
    keyboardDismissMode: _react.PropTypes.oneOf(['none', 'on-drag'])
  },

  getInitialState: function getInitialState() {
    return {
      openValue: new _ReactAnimated2['default'].Value(0)
    };
  },

  componentWillMount: function componentWillMount() {
    var _this = this;

    var openValue = this.state.openValue;

    openValue.addListener(function (_ref) {
      var value = _ref.value;

      _this._lastOpenValue = value;
      _this.props.onDrawerSlide && _this.props.onDrawerSlide({ nativeEvent: { offset: value } });
    });

    this._panResponder = _ReactPanResponder2['default'].create({
      onMoveShouldSetPanResponder: this._shouldSetPanResponder,
      onPanResponderGrant: this._panResponderGrant,
      onPanResponderMove: this._panResponderMove,
      onPanResponderTerminationRequest: function onPanResponderTerminationRequest(evt, gestureState) {
        return true;
      },
      onPanResponderRelease: this._panResponderRelease,
      onPanResponderTerminate: function onPanResponderTerminate(evt, gestureState) {}
    });
  },

  render: function render() {
    var openValue = this.state.openValue;
    var _props = this.props;
    var drawerPosition = _props.drawerPosition;
    var drawerWidth = _props.drawerWidth;

    var dynamicDrawerStyles = {};
    dynamicDrawerStyles[drawerPosition] = 0;
    dynamicDrawerStyles.width = drawerWidth;

    /* Drawer styles */
    var outputRange = undefined;

    if (drawerPosition === 'left') {
      outputRange = [-drawerWidth, 0];
    } else {
      outputRange = [drawerWidth, 0];
    }

    var drawerTranslateX = openValue.interpolate({
      inputRange: [0, 1],
      outputRange: outputRange,
      extrapolate: 'clamp'
    });
    var animatedDrawerStyles = { transform: [{ translateX: drawerTranslateX }] };

    /* Overlay styles */
    // let opacityOutputRange;

    var overlayOpacity = openValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7],
      extrapolate: 'clamp'
    });
    var animatedOverlayStyles = { opacity: overlayOpacity };

    return _react2['default'].createElement(
      _ReactView2['default'],
      _extends({ style: { flex: 1, backgroundColor: 'transparent' } }, this._panResponder.panHandlers),
      _react2['default'].createElement(
        _ReactAnimated2['default'].View,
        { style: styles.main },
        this.props.children
      ),
      _react2['default'].createElement(_ReactAnimated2['default'].View, { style: [styles.overlay, animatedOverlayStyles], onClick: this.close }),
      _react2['default'].createElement(
        _ReactAnimated2['default'].View,
        { style: [styles.drawer, dynamicDrawerStyles, animatedDrawerStyles] },
        this.props.renderNavigationView()
      )
    );
  },

  _emitStateChanged: function _emitStateChanged(newState) {
    this.props.onDrawerStateChanged && this.props.onDrawerStateChanged(newState);
  },

  open: function open() {
    var _this2 = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    this._emitStateChanged(SETTLING);
    _ReactAnimated2['default'].spring(this.state.openValue, _extends({ toValue: 1, bounciness: 0, restSpeedThreshold: 0.1 }, options)).start(function () {
      _this2.props.onDrawerOpen && _this2.props.onDrawerOpen();
      _this2._emitStateChanged(IDLE);
    });
  },

  close: function close() {
    var _this3 = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    this._emitStateChanged(SETTLING);
    _ReactAnimated2['default'].spring(this.state.openValue, _extends({ toValue: 0, bounciness: 0, restSpeedThreshold: 1 }, options)).start(function () {
      _this3.props.onDrawerClose && _this3.props.onDrawerClose();
      _this3._emitStateChanged(IDLE);
    });
  },

  _handleDrawerOpen: function _handleDrawerOpen() {
    this.props.onDrawerOpen && this.props.onDrawerOpen();
  },

  _handleDrawerClose: function _handleDrawerClose() {
    this.props.onDrawerClose && this.props.onDrawerClose();
  },

  _shouldSetPanResponder: function _shouldSetPanResponder(e, _ref2) {
    var moveX = _ref2.moveX;
    var dx = _ref2.dx;
    var dy = _ref2.dy;
    var drawerPosition = this.props.drawerPosition;

    if (drawerPosition === 'left') {
      var overlayArea = DEVICE_WIDTH - (DEVICE_WIDTH - this.props.drawerWidth);

      if (this._lastOpenValue === 1) {
        if (dx < 0 && Math.abs(dx) > Math.abs(dy) * 3 || moveX > overlayArea) {
          this._isClosing = true;
          this._closingAnchorValue = this._getOpenValueForX(moveX);
          return true;
        }
      } else {
        if (moveX <= 35 && dx > 0) {
          this._isClosing = false;
          return true;
        } else {
          return false;
        }
      }
    } else {
      var overlayArea = DEVICE_WIDTH - this.props.drawerWidth;

      if (this._lastOpenValue === 1) {
        if (dx > 0 && Math.abs(dx) > Math.abs(dy) * 3 || moveX < overlayArea) {
          this._isClosing = true;
          this._closingAnchorValue = this._getOpenValueForX(moveX);
          return true;
        }
      } else {
        if (moveX >= DEVICE_WIDTH - 35 && dx < 0) {
          this._isClosing = false;
          return true;
        } else {
          return false;
        }
      }
    }
  },

  _panResponderGrant: function _panResponderGrant() {
    this._emitStateChanged(DRAGGING);
  },

  _panResponderMove: function _panResponderMove(e, _ref3) {
    var moveX = _ref3.moveX;

    var openValue = this._getOpenValueForX(moveX);

    if (this._isClosing) {
      openValue = 1 - (this._closingAnchorValue - openValue);
    }

    if (openValue > 1) {
      openValue = 1;
    } else if (openValue < 0) {
      openValue = 0;
    }

    this.state.openValue.setValue(openValue);
  },

  _panResponderRelease: function _panResponderRelease(e, _ref4) {
    var moveX = _ref4.moveX;
    var vx = _ref4.vx;
    var drawerPosition = this.props.drawerPosition;

    // let { openValue } = this.state;
    var previouslyOpen = this._isClosing;
    var isWithinVelocityThreshold = vx < VX_MAX && vx > -VX_MAX;

    if (drawerPosition === 'left') {
      if (vx > 0 && moveX > THRESHOLD || vx >= VX_MAX || isWithinVelocityThreshold && previouslyOpen && moveX > THRESHOLD) {
        this.open({ velocity: vx });
      } else if (vx < 0 && moveX < THRESHOLD || vx < -VX_MAX || isWithinVelocityThreshold && !previouslyOpen) {
        this.close({ velocity: vx });
      } else if (previouslyOpen) {
        this.open();
      } else {
        this.close();
      }
    } else {
      if (vx < 0 && moveX < THRESHOLD || vx <= -VX_MAX || isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD) {
        this.open({ velocity: -1 * vx });
      } else if (vx > 0 && moveX > THRESHOLD || vx > VX_MAX || isWithinVelocityThreshold && !previouslyOpen) {
        this.close({ velocity: -1 * vx });
      } else if (previouslyOpen) {
        this.open();
      } else {
        this.close();
      }
    }
  },

  _getOpenValueForX: function _getOpenValueForX(x) {
    var _props2 = this.props;
    var drawerPosition = _props2.drawerPosition;
    var drawerWidth = _props2.drawerWidth;

    if (drawerPosition === 'left') {
      return x / drawerWidth;
    } else if (drawerPosition === 'right') {
      return (DEVICE_WIDTH - x) / drawerWidth;
    }
  }
});

var styles = _ReactStyleSheet2['default'].create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  main: {
    flex: 1
  },
  overlay: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

exports['default'] = DrawerLayout;
module.exports = exports['default'];