/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactActivityIndicator
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _ReactStyleSheet = require('ReactStyleSheet');

var _ReactStyleSheet2 = _interopRequireDefault(_ReactStyleSheet);

var _domkitAppendVendorPrefix = require('domkit/appendVendorPrefix');

var _domkitAppendVendorPrefix2 = _interopRequireDefault(_domkitAppendVendorPrefix);

var _domkitInsertKeyframesRule = require('domkit/insertKeyframesRule');

var _domkitInsertKeyframesRule2 = _interopRequireDefault(_domkitInsertKeyframesRule);

var keyframes = {
  '50%': {
    opacity: 0.3
  },
  '100%': {
    opacity: 1
  }
};

var GRAY = '#999999';

var animationName = (0, _domkitInsertKeyframesRule2['default'])(keyframes);

var ActivityIndicator = _react2['default'].createClass({
  displayName: 'ActivityIndicator',

  propTypes: {
    /**
     * Whether to show the indicator (true, the default) or hide it (false).
     */
    animating: _react.PropTypes.bool,
    /**
     * The foreground color of the spinner (default is gray).
     */
    color: _react.PropTypes.string,
    /**
     * Size of the indicator. Small has a height of 20, large has a height of 36.
     */
    size: _react.PropTypes.oneOf(['small', 'large'])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      animating: true,
      color: GRAY,
      size: 'small'
    };
  },

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getAnimationStyle: function getAnimationStyle(i) {
    var animation = [animationName, '1.2s', i * 0.12 + 's', 'infinite', 'ease-in-out'].join(' ');
    var animationFillMode = 'both';

    return {
      animation: animation,
      animationFillMode: animationFillMode
    };
  },

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getLineStyle: function getLineStyle(i, lines) {
    return {
      backgroundColor: this.props.color,
      position: 'absolute',
      // FIXME: hacked a fixed value for align
      top: -3,
      left: -1,
      transform: 'rotate(' + ~ ~(360 / lines * i) + 'deg) translate(0, -' + (this.props.size === 'large' ? 12 : 7) + 'px)'
    };
  },
  /**
   * @param  {Number} i
   * @return {Object}
   */
  getStyle: function getStyle(i, lines) {
    var sizeLineStyle = this.props.size === 'large' ? styles.sizeLargeLine : styles.sizeSmallLine;
    return (0, _domkitAppendVendorPrefix2['default'])(this.getAnimationStyle(i), this.getLineStyle(i, lines), sizeLineStyle);
  },

  render: function render() {
    var lines = [];
    var sizeContainerStyle = this.props.size === 'large' ? styles.sizeLargeContainer : styles.sizeSmallContainer;

    if (this.props.animating) {
      for (var i = 1; i <= 12; i++) {
        lines.push(_react2['default'].createElement(_ReactView2['default'], { key: i, style: this.getStyle(i, 12) }));
      }
    }

    return _react2['default'].createElement(
      _ReactView2['default'],
      { style: [styles.container, sizeContainerStyle, this.props.style] },
      _react2['default'].createElement(
        _ReactView2['default'],
        null,
        lines
      )
    );
  }
});

var styles = _ReactStyleSheet2['default'].create({
  container: {
    position: 'relative',
    fontSize: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sizeSmallContainer: {
    width: 20,
    height: 20
  },
  sizeLargeContainer: {
    width: 36,
    height: 36
  },
  sizeSmallLine: {
    width: 2,
    height: 5,
    borderRadius: 2
  },
  sizeLargeLine: {
    width: 3,
    height: 9,
    borderRadius: 3
  }
});

module.exports = ActivityIndicator;