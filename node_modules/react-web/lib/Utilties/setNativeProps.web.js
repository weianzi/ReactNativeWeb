/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactSetNativeProps
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _CSSProperty = require('CSSProperty');

var _CSSProperty2 = _interopRequireDefault(_CSSProperty);

function convertTransform(style) {
  var result = {};
  var transform = '';

  for (var k in style) {
    if (k === 'transformMatrix') {
      transform += 'matrix3d(' + style[k].join(',') + ') ';
    } else if (k === 'translateX' || k === 'translateY' || k === 'translateZ') {
      var v = style[k];
      if (typeof v === 'number') v += 'px';
      transform += k + '(' + v + ') ';
    } else if (k === 'scaleX' || k === 'scaleY' || k === 'scaleZ') {
      transform += k + '(' + style[k] + ') ';
    } else {
      var val = style[k];

      if (!_CSSProperty2['default'].isUnitlessNumber[k] && typeof val == 'number') {
        val += 'px';
      }

      result[k] = val;
    }
  }

  if (transform) {
    result.transform = transform;
  }

  return result;
}

function setNativeProps(ref, props) {
  var node = _reactDom2['default'].findDOMNode(ref);
  var style = props.style;

  if (style) {
    style = convertTransform(style);
    for (var k in style) {
      node.style[k] = style[k];
    }
  }
}

module.exports = setNativeProps;