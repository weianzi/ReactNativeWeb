/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactText
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactTouchable = require('ReactTouchable');

var _ReactLayoutMixin = require('ReactLayoutMixin');

/**
 * A React component for displaying text which supports nesting,
 * styling, and touch handling.  In the following example, the nested title and
 * body text will inherit the `fontFamily` from `styles.baseText`, but the title
 * provides its own additional styles.  The title and body will stack on top of
 * each other on account of the literal newlines:
 *
 * ```
 * renderText: function() {
 *   return (
 *     <Text style={styles.baseText}>
 *       <Text style={styles.titleText} onPress={this.onPressTitle}>
 *         {this.state.titleText + '\n\n'}
 *       </Text>
 *       <Text numberOfLines={5}>
 *         {this.state.bodyText}
 *       </Text>
 *     </Text>
 *   );
 * },
 * ...
 * var styles = StyleSheet.create({
 *   baseText: {
 *     fontFamily: 'Cochin',
 *   },
 *   titleText: {
 *     fontSize: 20,
 *     fontWeight: 'bold',
 *   },
 * };
 * ```
 */

var Text = _react2['default'].createClass({
  displayName: 'Text',

  mixins: [_ReactLayoutMixin.Mixin, _ReactTouchable.Mixin],

  propTypes: {
    /**
     * Used to truncate the text with an elipsis after computing the text
     * layout, including line wrapping, such that the total number of lines
     * does not exceed this number.
     */
    numberOfLines: _react2['default'].PropTypes.number,
    /**
     * Invoked on mount and layout changes with
     *
     *   `{nativeEvent: {layout: {x, y, width, height}}}`
     */
    onLayout: _react2['default'].PropTypes.func,
    /**
     * This function is called on press.
     */
    onPress: _react2['default'].PropTypes.func,
    /**
     * When true, no visual change is made when text is pressed down. By
     * default, a gray oval highlights the text on press down.
     * @platform ios
     */
    suppressHighlighting: _react2['default'].PropTypes.bool,
    /**
     * Used to locate this view in end-to-end tests.
     */
    testID: _react2['default'].PropTypes.string,
    /**
     * Specifies should fonts scale to respect Text Size accessibility setting on iOS.
     */
    allowFontScaling: _react2['default'].PropTypes.bool
  },

  getInitialState: function getInitialState() {
    return _extends({}, this.touchableGetInitialState(), {
      isHighlighted: false
    });
  },

  getDefaultProps: function getDefaultProps() {
    return {
      allowFontScaling: true
    };
  },

  // componentDidMount: function() {
  //   console.log('mount')
  // },
  //
  // componentDidUpdate: function() {
  //   console.log('update')
  // },

  onStartShouldSetResponder: function onStartShouldSetResponder() {
    var shouldSetFromProps = this.props.onStartShouldSetResponder && this.props.onStartShouldSetResponder();
    return shouldSetFromProps || !!this.props.onPress;
  },

  /*
   * Returns true to allow responder termination
   */
  handleResponderTerminationRequest: function handleResponderTerminationRequest() {
    // Allow touchable or props.onResponderTerminationRequest to deny
    // the request
    var allowTermination = this.touchableHandleResponderTerminationRequest();
    if (allowTermination && this.props.onResponderTerminationRequest) {
      allowTermination = this.props.onResponderTerminationRequest();
    }
    return allowTermination;
  },

  handleResponderGrant: function handleResponderGrant(e, dispatchID) {
    this.touchableHandleResponderGrant(e, dispatchID);
    this.props.onResponderGrant && this.props.onResponderGrant.apply(this, arguments);
  },

  handleResponderMove: function handleResponderMove(e) {
    this.touchableHandleResponderMove(e);
    this.props.onResponderMove && this.props.onResponderMove.apply(this, arguments);
  },

  handleResponderRelease: function handleResponderRelease(e) {
    this.touchableHandleResponderRelease(e);
    this.props.onResponderRelease && this.props.onResponderRelease.apply(this, arguments);
  },

  handleResponderTerminate: function handleResponderTerminate(e) {
    this.touchableHandleResponderTerminate(e);
    this.props.onResponderTerminate && this.props.onResponderTerminate.apply(this, arguments);
  },

  touchableHandleActivePressIn: function touchableHandleActivePressIn() {
    if (this.props.suppressHighlighting || !this.props.onPress) {
      return;
    }
    this.setState({
      isHighlighted: true
    });
  },

  touchableHandleActivePressOut: function touchableHandleActivePressOut() {
    if (this.props.suppressHighlighting || !this.props.onPress) {
      return;
    }
    this.setState({
      isHighlighted: false
    });
  },

  touchableHandlePress: function touchableHandlePress() {
    this.props.onPress && this.props.onPress();
  },

  touchableGetPressRectOffset: function touchableGetPressRectOffset() {
    return PRESS_RECT_OFFSET;
  },

  getChildContext: function getChildContext() {
    return { isInAParentText: true };
  },

  contextTypes: {
    isInAParentText: _react2['default'].PropTypes.bool
  },

  childContextTypes: {
    isInAParentText: _react2['default'].PropTypes.bool
  },

  render: function render() {
    var props = _extends({}, this.props);
    // Text is accessible by default
    if (props.accessible !== false) {
      props.accessible = true;
    }
    props.isHighlighted = this.state.isHighlighted;
    props.onStartShouldSetResponder = this.onStartShouldSetResponder;
    props.onResponderTerminationRequest = this.handleResponderTerminationRequest;
    props.onResponderGrant = this.handleResponderGrant;
    props.onResponderMove = this.handleResponderMove;
    props.onResponderRelease = this.handleResponderRelease;
    props.onResponderTerminate = this.handleResponderTerminate;

    var numberOfLines = props.numberOfLines;
    var style = props.style;

    style = _extends({}, props.style);

    if (typeof style.lineHeight == 'number') {
      style.lineHeight += 'px';
    }

    // Default lineHeight is 1.2 x fontSize
    var lineHeight = style.lineHeight || (style.fontSize || 16) * 1.2; // FIXME:  not sure 16px is the default line height
    if (typeof lineHeight == 'number') {
      lineHeight += 'px';
    }
    style.lineHeight = lineHeight;

    if (style.textDecorationLine) {
      style.textDecoration = style.textDecorationLine;
    }

    if (!props.children) {
      // TODO set a linebreak
    }

    return _react2['default'].createElement('span', _extends({}, props, {
      style: _extends({
        display: this.context.isInAParentText ? 'inline' : 'inline-block',
        margin: 0,
        padding: 0,
        wordWrap: 'break-word',
        fontFamily: 'Helvetica Neue, STHeiTi, sans-serif'
      }, style, numberOfLines && {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordWrap: 'break-word',
        display: '-webkit-box',
        WebkitLineClamp: numberOfLines,
        WebkitBoxOrient: 'vertical',
        maxHeight: parseFloat(lineHeight) * numberOfLines
      }) }));
  }
});

var PRESS_RECT_OFFSET = { top: 20, left: 20, right: 20, bottom: 30 };

module.exports = Text;