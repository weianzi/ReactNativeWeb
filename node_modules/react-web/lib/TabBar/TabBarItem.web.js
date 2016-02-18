/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactImage = require('ReactImage');

var _ReactImage2 = _interopRequireDefault(_ReactImage);

var _ReactText = require('ReactText');

var _ReactText2 = _interopRequireDefault(_ReactText);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var TabBarItem = _react2['default'].createClass({
  displayName: 'TabBarItem',

  propTypes: {
    /**
     * Little red bubble that sits at the top right of the icon.
     */
    badge: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    /**
     * A custom icon for the tab. It is ignored when a system icon is defined.
     */
    icon: _react.PropTypes.object,
    /**
     * A custom icon when the tab is selected. It is ignored when a system
     * icon is defined. If left empty, the icon will be tinted in blue.
     */
    selectedIcon: _react.PropTypes.string,
    /**
     * Callback when this tab is being selected, you should change the state of your
     * component to set selected={true}.
     */
    onPress: _react.PropTypes.func,
    /**
     * It specifies whether the children are visible or not. If you see a
     * blank content, you probably forgot to add a selected one.
     */
    selected: _react.PropTypes.bool,
    /**
     * React style object.
     */
    style: _react.PropTypes.object,
    /**
     * Text that appears under the icon. It is ignored when a system icon
     * is defined.
     */
    title: _react.PropTypes.string,
    /**
     * Color of the currently selected tab icon
     */
    selectedColor: _react.PropTypes.string
  },

  getStyles: function getStyles() {
    return {
      tab: {
        display: 'table-cell',
        textAlign: 'center',
        position: 'relative'
      },
      link: {
        display: 'block',
        padding: '0.3em 0'
      },
      badge: {
        display: 'inline-block',
        position: 'absolute',
        top: 0,
        left: '52%',
        color: '#FFF',
        backgroundColor: '#FF0000',
        height: '1.6em',
        lineHeight: '1.6em',
        minWidth: '1.6em',
        fontSize: '0.7em',
        borderRadius: '0.8em',
        fontStyle: 'normal'
      },
      icon: {
        width: '1.875em',
        height: '1.875em'
      },
      title: {
        fontSize: 12
      }
    };
  },

  _onClick: function _onClick() {
    if (this.props.onPress) {
      this.props.onPress();
    }
    if (this.props.handleTouchTap) {
      this.props.handleTouchTap(this.props.index);
    }
  },

  render: function render() {
    var styles = this.getStyles();

    var tabStyle = _extends({}, styles.tab, this.props.style || {}, { color: this.props.selectedColor && this.props.selected ? this.props.selectedColor : null });

    return _react2['default'].createElement(
      'li',
      { style: tabStyle },
      _react2['default'].createElement(
        'a',
        { onClick: this._onClick, style: styles.link },
        this.props.badge ? _react2['default'].createElement(
          'em',
          { style: styles.badge },
          this.props.badge
        ) : '',
        _react2['default'].createElement(_ReactImage2['default'], { source: this.props.selected && this.props.selectedIcon ? this.props.selectedIcon : this.props.icon, style: styles.icon }),
        _react2['default'].createElement(
          _ReactView2['default'],
          { style: { marginTop: 4 } },
          _react2['default'].createElement(
            _ReactText2['default'],
            { style: styles.title },
            this.props.title
          )
        )
      )
    );
  }
});

module.exports = TabBarItem;