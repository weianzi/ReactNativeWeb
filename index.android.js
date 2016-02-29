/**
 * IOS 入口文件
 */
'use strict';

var React = require('react-native');
var { AppRegistry, Navigator, StyleSheet, View } = React;
var StoryList = require('./views/StoryList.react');
var StoryDetail = require('./views/StoryDetail.react');

var RouteMapper = function(route, navigationOperations, onComponentRef) {
    switch(route.name){
        case 'storyList':
            return (
              <StoryList navigator={navigationOperations} />
            );
        case 'storyDetail':
            return (
                <StoryDetail navigator={navigationOperations} detailId={route.detailId} />
            );
    }
};

var ReactNativeWeb = React.createClass({
    render: function(){
        var initialRoute = {name: 'storyList'};
        return (
          <Navigator
            style={styles.container}
            initialRoute={initialRoute}
            renderScene={RouteMapper}
          />
        );
    }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('ReactNativeWeb', () => ReactNativeWeb);