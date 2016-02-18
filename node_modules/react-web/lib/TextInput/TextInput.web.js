/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactTextInput
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var typeMap = {
  'default': 'text',
  'ascii-capable': 'text',
  'numbers-and-punctuation': 'number',
  'url': 'url',
  'number-pad': 'number',
  'phone-pad': 'tel',
  'name-phone-pad': 'text',
  'email-address': 'email',
  'decimal-pad': 'number',
  'twitter': 'text',
  'web-search': 'search',
  'numeric': 'number'
};

var TextInput = _react2['default'].createClass({
  displayName: 'TextInput',

  propTypes: {
    /**
     * Can tell TextInput to automatically capitalize certain characters.
     *
     * - characters: all characters,
     * - words: first letter of each word
     * - sentences: first letter of each sentence (default)
     * - none: don't auto capitalize anything
     */
    autoCapitalize: _react.PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
    /**
     * If false, disables auto-correct. The default value is true.
     */
    autoCorrect: _react.PropTypes.bool,
    /**
     * If true, focuses the input on componentDidMount.
     * The default value is false.
     */
    autoFocus: _react.PropTypes.bool,
    /**
     * Set the position of the cursor from where editing will begin.
     * @platorm android
     */
    textAlign: _react.PropTypes.oneOf(['start', 'center', 'end']),
    /**
     * Aligns text vertically within the TextInput.
     * @platform android
     */
    textAlignVertical: _react.PropTypes.oneOf(['top', 'center', 'bottom']),
    /**
     * If false, text is not editable. The default value is true.
     */
    editable: _react.PropTypes.bool,
    /**
     * Determines which keyboard to open, e.g.`numeric`.
     *
     * The following values work across platforms:
     * - default
     * - numeric
     * - email-address
     */
    keyboardType: _react.PropTypes.oneOf([
    // Cross-platform
    'default', 'numeric', 'email-address',
    // iOS-only
    'ascii-capable', 'numbers-and-punctuation', 'url', 'number-pad', 'phone-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search']),
    /**
     * Determines how the return key should look.
     * @platform ios
     */
    returnKeyType: _react.PropTypes.oneOf(['default', 'go', 'google', 'join', 'next', 'route', 'search', 'send', 'yahoo', 'done', 'emergency-call']),
    /**
     * Limits the maximum number of characters that can be entered. Use this
     * instead of implementing the logic in JS to avoid flicker.
     * @platform ios
     */
    maxLength: _react.PropTypes.number,
    /**
     * Sets the number of lines for a TextInput. Use it with multiline set to
     * true to be able to fill the lines.
     * @platform android
     */
    numberOfLines: _react.PropTypes.number,
    /**
     * If true, the keyboard disables the return key when there is no text and
     * automatically enables it when there is text. The default value is false.
     * @platform ios
     */
    enablesReturnKeyAutomatically: _react.PropTypes.bool,
    /**
     * If true, the text input can be multiple lines.
     * The default value is false.
     */
    multiline: _react.PropTypes.bool,
    /**
     * Callback that is called when the text input is blurred
     */
    onBlur: _react.PropTypes.func,
    /**
     * Callback that is called when the text input is focused
     */
    onFocus: _react.PropTypes.func,
    /**
     * Callback that is called when the text input's text changes.
     */
    onChange: _react.PropTypes.func,
    /**
     * Callback that is called when the text input's text changes.
     * Changed text is passed as an argument to the callback handler.
     */
    onChangeText: _react.PropTypes.func,
    /**
     * Callback that is called when text input ends.
     */
    onEndEditing: _react.PropTypes.func,
    /**
     * Callback that is called when the text input's submit button is pressed.
     */
    onSubmitEditing: _react.PropTypes.func,
    /**
     * Invoked on mount and layout changes with `{x, y, width, height}`.
     */
    onLayout: _react.PropTypes.func,
    /**
     * The string that will be rendered before text input has been entered
     */
    placeholder: _react.PropTypes.string,
    /**
     * The text color of the placeholder string
     */
    placeholderTextColor: _react.PropTypes.string,
    /**
     * If true, the text input obscures the text entered so that sensitive text
     * like passwords stay secure. The default value is false.
     */
    secureTextEntry: _react.PropTypes.bool,

    /**
     * The value to show for the text input. TextInput is a controlled
     * component, which means the native value will be forced to match this
     * value prop if provided. For most uses this works great, but in some
     * cases this may cause flickering - one common cause is preventing edits
     * by keeping value the same. In addition to simply setting the same value,
     * either set `editable={false}`, or set/update `maxLength` to prevent
     * unwanted edits without flicker.
     */
    value: _react.PropTypes.string,
    /**
     * Provides an initial value that will change when the user starts typing.
     * Useful for simple use-cases where you don't want to deal with listening
     * to events and updating the value prop to keep the controlled state in sync.
     */
    defaultValue: _react.PropTypes.string,
    /**
     * When the clear button should appear on the right side of the text view
     * @platform ios
     */
    clearButtonMode: _react.PropTypes.oneOf(['never', 'while-editing', 'unless-editing', 'always']),
    /**
     * If true, clears the text field automatically when editing begins
     * @platform ios
     */
    clearTextOnFocus: _react.PropTypes.bool,
    /**
     * If true, all text will automatically be selected on focus
     * @platform ios
     */
    selectTextOnFocus: _react.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      editable: true,
      multiline: false,
      secureTextEntry: false,
      keyboardType: 'default',
      autoFocus: false
    };
  },

  _onBlur: function _onBlur(e) {
    var onBlur = this.props.onBlur;

    if (onBlur) {
      e.nativeEvent.text = e.target.value;
      onBlur(e);
    }
  },

  _onChange: function _onChange(e) {
    var _props = this.props;
    var onChange = _props.onChange;
    var onChangeText = _props.onChangeText;

    if (onChangeText) onChangeText(e.target.value);
    if (onChange) {
      e.nativeEvent.text = e.target.value;
      onChange(e);
    }
  },

  _onFocus: function _onFocus(e) {
    var _props2 = this.props;
    var clearTextOnFocus = _props2.clearTextOnFocus;
    var onFocus = _props2.onFocus;
    var selectTextOnFocus = _props2.selectTextOnFocus;

    var node = _reactDom2['default'].findDOMNode(this);
    if (clearTextOnFocus) node.value = '';
    if (selectTextOnFocus) node.select();
    if (onFocus) {
      e.nativeEvent.text = e.target.value;
      onFocus(e);
    }
  },

  _onSelectionChange: function _onSelectionChange(e) {
    var onSelectionChange = this.props.onSelectionChange;

    if (onSelectionChange) {
      var _e$target = e.target;
      var selectionDirection = _e$target.selectionDirection;
      var selectionEnd = _e$target.selectionEnd;
      var selectionStart = _e$target.selectionStart;

      e.nativeEvent.text = e.target.value;
      var _event = {
        selectionDirection: selectionDirection,
        selectionEnd: selectionEnd,
        selectionStart: selectionStart,
        nativeEvent: e.nativeEvent
      };
      onSelectionChange(_event);
    }
  },

  componentDidMount: function componentDidMount() {
    if (this.props.autoFocus) {
      _reactDom2['default'].findDOMNode(this.refs.input).focus();
    }
  },

  render: function render() {
    var _props3 = this.props;
    var accessibilityLabel = _props3.accessibilityLabel;
    var autoComplete = _props3.autoComplete;
    var autoFocus = _props3.autoFocus;
    var defaultValue = _props3.defaultValue;
    var editable = _props3.editable;
    var keyboardType = _props3.keyboardType;
    var maxLength = _props3.maxLength;
    var maxNumberOfLines = _props3.maxNumberOfLines;
    var multiline = _props3.multiline;
    var numberOfLines = _props3.numberOfLines;
    var onBlur = _props3.onBlur;
    var onChange = _props3.onChange;
    var onChangeText = _props3.onChangeText;
    var onSelectionChange = _props3.onSelectionChange;
    var placeholder = _props3.placeholder;
    var password = _props3.password;
    var secureTextEntry = _props3.secureTextEntry;
    var style = _props3.style;
    var testID = _props3.testID;
    var value = _props3.value;

    var propsCommon = {
      ref: 'input',
      'aria-label': accessibilityLabel,
      autoComplete: autoComplete && 'on',
      autoFocus: autoFocus,
      defaultValue: defaultValue,
      maxLength: maxLength,
      onBlur: onBlur && this._onBlur,
      onChange: (onChange || onChangeText) && this._onChange,
      onFocus: this._onFocus,
      onSelect: onSelectionChange && this._onSelectionChange,
      placeholder: placeholder,
      readOnly: !editable,
      style: _extends({}, styles.initial, style),
      testID: testID,
      value: value
    };

    var input;
    if (multiline) {
      var propsMultiline = _extends({}, propsCommon, {
        maxRows: maxNumberOfLines || numberOfLines,
        minRows: numberOfLines
      });

      input = _react2['default'].createElement('textarea', propsMultiline);
    } else {

      var type = typeMap[keyboardType];

      if (password || secureTextEntry) {
        type = 'password';
      }

      var propsSingleline = _extends({}, propsCommon, {
        type: type
      });

      input = _react2['default'].createElement('input', propsSingleline);
    }

    if (this.props.children) {
      return _react2['default'].createElement(
        _ReactView2['default'],
        null,
        input,
        this.props.children
      );
    } else {
      return input;
    }
  }
});

var styles = {
  initial: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 0,
    boxSizing: 'border-box',
    color: 'inherit',
    font: 'inherit',
    padding: 0,
    height: 30 }
};

// default height
module.exports = TextInput;