/**
 * web 入口文件
 */
'use strict';

var React = require('react-native');
var WebList = require('./views/WebList.react');
var { AppRegistry } = React;

var ReactNativeWeb = React.createClass({
    render: function(){
        return <WebList />;
    }
});

AppRegistry.registerComponent('ReactNativeWeb', () => ReactNativeWeb);

//web
var app = document.createElement('div');
document.body.appendChild(app);
AppRegistry.runApplication('ReactNativeWeb', {rootTag: app});
