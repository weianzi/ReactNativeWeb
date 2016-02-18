/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactTabBar
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _TabBarItemWeb = require('./TabBarItem.web');

var _TabBarItemWeb2 = _interopRequireDefault(_TabBarItemWeb);

var _TabBarContentsWeb = require('./TabBarContents.web');

var _TabBarContentsWeb2 = _interopRequireDefault(_TabBarContentsWeb);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var TabBar = _react2['default'].createClass({
  displayName: 'TabBar',

  getInitialState: function getInitialState() {
    return {
      selectedIndex: 0
    };
  },

  statics: {
    Item: _TabBarItemWeb2['default']
  },

  propTypes: {
    style: _react2['default'].PropTypes.object,
    /**
     * Color of the currently selected tab icon
     */
    tintColor: _react2['default'].PropTypes.string,
    /**
     * Background color of the tab bar
     */
    barTintColor: _react2['default'].PropTypes.string,

    clientHeight: _react2['default'].PropTypes.number
  },

  getStyles: function getStyles() {
    return {
      container: {
        width: '100%',
        height: this.props.clientHeight || document.documentElement.clientHeight,
        position: 'relative',
        overflow: 'hidden'
      },
      content: {
        width: '100%',
        height: '100%'
      },
      bar: {
        width: '100%',
        position: 'absolute',
        padding: 0,
        margin: 0,
        listStyle: 'none',
        left: 0,
        bottom: 0,
        // borderTop: '1px solid #e1e1e1',
        backgroundColor: 'rgba(250,250,250,.96)',
        display: 'table'
      }
    };
  },

  handleTouchTap: function handleTouchTap(index) {
    this.setState({
      selectedIndex: index
    });
  },

  render: function render() {
    var self = this;
    var styles = self.getStyles();
    var barStyle = (0, _objectAssign2['default'])(styles.bar, this.props.style || {}, this.props.barTintColor ? {
      backgroundColor: this.props.barTintColor
    } : {});

    var tabContent = [];

    var tabs = _react2['default'].Children.map(this.props.children, function (tab, index) {
      if (tab.type.displayName === 'TabBarItem') {
        if (tab.props.children) {
          tabContent.push(_react2['default'].createElement(_TabBarContentsWeb2['default'], {
            key: index,
            selected: self.state.selectedIndex === index
          }, tab.props.children));
        } else {
          tabContent.push(undefined);
        }

        return _react2['default'].cloneElement(tab, {
          index: index,
          selected: self.state.selectedIndex === index,
          selectedColor: self.props.tintColor,
          handleTouchTap: self.handleTouchTap
        });
      } else {
        var type = tab.type.displayName || tab.type;
        throw 'Tabbar only accepts TabBar.Item Components as children. Found ' + type + ' as child number ' + (index + 1) + ' of Tabbar';
      }
    });

    return _react2['default'].createElement(
      _ReactView2['default'],
      { style: styles.container },
      _react2['default'].createElement(
        _ReactView2['default'],
        { style: styles.content },
        tabContent
      ),
      _react2['default'].createElement(
        'ul',
        { style: barStyle },
        tabs
      )
    );
  }
});

module.exports = TabBar;