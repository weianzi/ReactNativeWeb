/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactImage
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _ReactLayoutMixin = require('ReactLayoutMixin');

var _ImageResizeMode = require('./ImageResizeMode');

var _ImageResizeMode2 = _interopRequireDefault(_ImageResizeMode);

var Image = _react2['default'].createClass({
  displayName: 'Image',

  statics: {
    resizeMode: _ImageResizeMode2['default']
  },

  mixins: [_ReactLayoutMixin.Mixin],

  contextTypes: {
    isInAParentText: _react2['default'].PropTypes.bool
  },
  render: function render() {

    var props = _extends({}, this.props);
    props.src = typeof props.source === 'string' ? props.source : props.source.uri;

    // TODO: lazyload image when not in viewport

    var resizeMode = this.props.resizeMode;

    // Background image element, resizeMode is strtch is equal default img style
    if ((this.props.children || resizeMode && resizeMode !== 'stretch') && !this.context.isInAParentText) {
      var containerStyles = props.style ? props.style : {};
      containerStyles.backgroundImage = 'url("' + props.src + '")';
      containerStyles.backgroundSize = resizeMode || 'cover';
      containerStyles.backgroundRepeat = 'no-repeat';
      containerStyles.backgroundPosition = '50%';

      return _react2['default'].createElement(
        _ReactView2['default'],
        { style: containerStyles, 'data-src': props.src },
        this.props.children
      );
    } else {
      return _react2['default'].createElement('img', props);
    }
  }
});

module.exports = Image;