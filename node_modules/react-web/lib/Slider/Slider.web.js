/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactSlider
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ReactStyleSheet = require('ReactStyleSheet');

var _ReactStyleSheet2 = _interopRequireDefault(_ReactStyleSheet);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _ReactImage = require('ReactImage');

var _ReactImage2 = _interopRequireDefault(_ReactImage);

var _ReactPanResponder = require('ReactPanResponder');

var _ReactPanResponder2 = _interopRequireDefault(_ReactPanResponder);

var TRACK_SIZE = 4;
var THUMB_SIZE = 20;

function noop() {}

var Slider = (function (_Component) {
  _inherits(Slider, _Component);

  function Slider(props) {
    _classCallCheck(this, Slider);

    _get(Object.getPrototypeOf(Slider.prototype), 'constructor', this).call(this, props);
    this.state = {
      value: props.value
    };
  }

  _createClass(Slider, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._panResponder = _ReactPanResponder2['default'].create({
        onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder.bind(this),
        onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder.bind(this),
        onPanResponderGrant: this._handlePanResponderGrant.bind(this),
        onPanResponderMove: this._handlePanResponderMove.bind(this),
        onPanResponderRelease: this._handlePanResponderEnd.bind(this),
        onPanResponderTerminate: this._handlePanResponderEnd.bind(this)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var minimumTrackTintColor = _props.minimumTrackTintColor;
      var maximumTrackTintColor = _props.maximumTrackTintColor;
      var styles = _props.styles;
      var style = _props.style;
      var trackStyle = _props.trackStyle;
      var thumbStyle = _props.thumbStyle;
      var thumbTintColor = _props.thumbTintColor;
      var thumbImage = _props.thumbImage;
      var disabled = _props.disabled;

      var other = _objectWithoutProperties(_props, ['minimumTrackTintColor', 'maximumTrackTintColor', 'styles', 'style', 'trackStyle', 'thumbStyle', 'thumbTintColor', 'thumbImage', 'disabled']);

      var mainStyles = styles || defaultStyles;
      var trackHeight = trackStyle && trackStyle.height || defaultStyles.track.height;
      var thumbHeight = thumbStyle && thumbStyle.height || defaultStyles.thumb.height;
      var minTrackWidth = this._getMinTrackWidth();
      var minimumTrackStyle = {
        width: minTrackWidth,
        marginTop: -trackHeight,
        backgroundColor: minimumTrackTintColor
      };
      return _react2['default'].createElement(
        _ReactView2['default'],
        { style: [mainStyles.container, style] },
        _react2['default'].createElement(_ReactView2['default'], { ref: 'totalTrack',
          style: [{ backgroundColor: maximumTrackTintColor }, mainStyles.track, trackStyle, disabled && { backgroundColor: mainStyles.disabled.backgroundColor }] }),
        _react2['default'].createElement(_ReactView2['default'], { ref: 'minTrack', style: [mainStyles.track, trackStyle, minimumTrackStyle] }),
        thumbImage && thumbImage.uri && _react2['default'].createElement(_ReactImage2['default'], _extends({ ref: 'thumb', source: thumbImage, style: [{ width: mainStyles.thumb.width, height: mainStyles.thumb.height }, thumbStyle, { left: minTrackWidth, position: 'relative', display: 'block' }, { marginLeft: -thumbHeight / 2, marginTop: -(thumbHeight + trackHeight) / 2 }]
        }, this._panResponder.panHandlers)) || _react2['default'].createElement(_ReactView2['default'], _extends({ ref: 'thumb', style: [{ backgroundColor: thumbTintColor, left: minTrackWidth }, mainStyles.thumb, thumbStyle, { marginLeft: -thumbHeight / 2, marginTop: -(thumbHeight + trackHeight) / 2 }, disabled && { boxShadow: mainStyles.disabled.boxShadow }]
        }, this._panResponder.panHandlers))
      );
    }
  }, {
    key: '_handleStartShouldSetPanResponder',
    value: function _handleStartShouldSetPanResponder() {
      return !this.props.disabled;
    }
  }, {
    key: '_handleMoveShouldSetPanResponder',
    value: function _handleMoveShouldSetPanResponder() {
      return false;
    }
  }, {
    key: '_handlePanResponderGrant',
    value: function _handlePanResponderGrant(e, gestureState) {
      this.previousLeft = this._getWidth('minTrack');
      this.previousValue = this.state.value;
      this._fireProcessEvent('onSlidingStart');
    }
  }, {
    key: '_handlePanResponderMove',
    value: function _handlePanResponderMove(e, gestureState) {
      this.setState({ value: this._getValue(gestureState) });
      this._fireProcessEvent('onValueChange');
    }
  }, {
    key: '_handlePanResponderEnd',
    value: function _handlePanResponderEnd(e, gestureState) {
      this.setState({ value: this._getValue(gestureState) });
      this._fireProcessEvent('onSlidingComplete');
    }
  }, {
    key: '_fireProcessEvent',
    value: function _fireProcessEvent(event) {
      if (this.props[event]) {
        this.props[event](this.state.value);
      }
    }
  }, {
    key: '_getValue',
    value: function _getValue(gestureState) {
      var _props2 = this.props;
      var step = _props2.step;
      var maximumValue = _props2.maximumValue;
      var minimumValue = _props2.minimumValue;

      var totalWidth = this._getWidth('totalTrack');
      var thumbLeft = Math.min(totalWidth, Math.max(0, this.previousLeft + gestureState.dx)),
          ratio = thumbLeft / totalWidth,
          newValue = ratio * (maximumValue - minimumValue) + minimumValue;
      if (step > 0) {
        return Math.round(newValue / step) * step;
      } else {
        return newValue;
      }
    }
  }, {
    key: '_getWidth',
    value: function _getWidth(ref) {
      if (this.refs[ref]) {
        var node = _reactDom2['default'].findDOMNode(this.refs[ref]),
            rect = node.getBoundingClientRect();
        return rect.width;
      }
    }
  }, {
    key: '_getMinTrackWidth',
    value: function _getMinTrackWidth() {
      var value = this.state.value;
      return 100 * (value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue) + '%';
    }
  }]);

  return Slider;
})(_react.Component);

Slider.propTypes = {
  /**
   * Used to style and layout the `Slider`.  See `StyleSheet.js` and
   * `ViewStylePropTypes.js` for more info.
   */
  style: _ReactView2['default'].propTypes.style,
  /**
   * Initial value of the slider. The value should be between minimumValue
   * and maximumValue, which default to 0 and 1 respectively.
   * Default value is 0.
   *
   * *This is not a controlled component*, e.g. if you don't update
   * the value, the component won't be reset to its inital value.
   */
  value: _react.PropTypes.number,
  /**
   * Step value of the slider. The value should be
   * between 0 and (maximumValue - minimumValue).
   * Default value is 0.
   */
  step: _react.PropTypes.number,
  /**
   * Initial minimum value of the slider. Default value is 0.
   */
  minimumValue: _react.PropTypes.number,
  /**
   * Initial maximum value of the slider. Default value is 1.
   */
  maximumValue: _react.PropTypes.number,
  /**
   * The color used for the track to the left of the button. Overrides the
   * default blue gradient image.
   */
  minimumTrackTintColor: _react.PropTypes.string,
  /**
   * The color used for the track to the right of the button. Overrides the
   * default blue gradient image.
   */
  maximumTrackTintColor: _react.PropTypes.string,
  /**
   * If true the user won't be able to move the slider.
   * Default value is false.
   */
  disabled: _react.PropTypes.bool,
  /**
   * Sets an image for the track. It only supports images that are included as assets
   */
  trackImage: _react.PropTypes.any,
  /**
   * Sets an image for the thumb. It only supports static images.
   */
  thumbImage: _react.PropTypes.any,
  /**
   * Callback continuously called while the user is dragging the slider.
   */
  onValueChange: _react.PropTypes.func,
  /**
   * Callback called when the user finishes changing the value (e.g. when
   * the slider is released).
   */
  onSlidingComplete: _react.PropTypes.func
};

Slider.defaultProps = {
  value: 0,
  step: 0,
  minimumValue: 0,
  maximumValue: 1,
  minimumTrackTintColor: '#0f85fb',
  maximumTrackTintColor: '#b3b3b3',
  thumbTintColor: '#fff',
  disabled: false,
  onValueChange: noop,
  onSlidingComplete: noop
};

var defaultStyles = _ReactStyleSheet2['default'].create({
  container: {
    height: 40,
    justifyContent: 'center',
    position: 'relative'
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    boxShadow: '2px 3px 10px rgba(0,0,0,0.75)'
  },
  disabled: {
    backgroundColor: '#dadada',
    boxShadow: '2px 3px 10px rgba(0,0,0,0.25)'
  }
});

module.exports = Slider;