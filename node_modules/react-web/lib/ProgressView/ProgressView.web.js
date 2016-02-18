/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactProgressView
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _ReactStyleSheet = require('ReactStyleSheet');

var _ReactStyleSheet2 = _interopRequireDefault(_ReactStyleSheet);

var ProgressView = _react2['default'].createClass({
  displayName: 'ProgressView',

  render: function render() {

    var specificStyle = {
      progressTint: {},
      progressTrack: {}
    };

    if (this.props.trackImage) {
      specificStyle.progressTrack.background = 'url(' + this.props.trackImage.uri + ') no-repeat 0 0';
      specificStyle.progressTrack.backgroundSize = '100% 100%';
    }

    if (this.props.trackTintColor) {
      specificStyle.progressTrack.background = this.props.trackTintColor;
    }

    if (this.props.progressViewStyle == 'bar') {
      specificStyle.progressTrack.background = 'transparent';
    }

    if (this.props.progressImage) {
      specificStyle.progressTint.background = 'url(' + this.props.progressImage.uri + ') no-repeat 0 0';
      specificStyle.progressTint.backgroundSize = '100% 100%';
    }

    if (this.props.progressTintColor) {
      specificStyle.progressTint.background = this.props.progressTintColor;
    }

    // process progress
    var progress = this.props.progress;
    if (progress >= 1) {
      progress = 1;
    } else if (progress <= 0) {
      progress = 0;
    }

    specificStyle.progressTint.width = 100 * progress + '%';

    specificStyle = _ReactStyleSheet2['default'].create(specificStyle);

    return _react2['default'].createElement(
      _ReactView2['default'],
      { style: [styles.progressView, this.props.style] },
      _react2['default'].createElement(
        _ReactView2['default'],
        { style: [styles.progressTrack, specificStyle.progressTrack] },
        _react2['default'].createElement(_ReactView2['default'], { style: [styles.progressTint, specificStyle.progressTint] })
      )
    );
  }
});

var styles = _ReactStyleSheet2['default'].create({
  progressView: {
    display: 'block',
    height: '2px',
    width: '100%'
  },
  progressTint: {
    position: 'absolute',
    left: 0,
    width: 0,
    height: '100%',
    background: '#0079fe'
  },
  progressTrack: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: '#b4b4b4'
  }
});

module.exports = ProgressView;