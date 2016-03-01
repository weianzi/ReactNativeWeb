/**
 * IOS 入口文件
 */
'use strict';

var React = require('react-native');
var { AppRegistry, Navigator, StyleSheet, View, ToolbarAndroid,
  BackAndroid, 
} = React;
var StoryList = require('./views/StoryList.react');
var StoryDetail = require('./views/StoryDetail.react');

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var RouteMapper = function(route, navigationOperations, onComponentRef) {
    _navigator = navigationOperations;
    switch(route.name){
        case 'storyList':
            return (
              <StoryList navigator={navigationOperations} />
            );
        case 'storyDetail':
            return (
              <View style={{flex:1}}>
                <ToolbarAndroid
                  actions={[]}
                  navIcon={require('./images/icon-back.imageset/icon-back.png')}
                  onIconClicked={navigationOperations.pop}
                  style={styles.toolbar}
                  titleColor="#fff"
                  title={route.title} />
                <StoryDetail 
                  navigator={navigationOperations} 
                  detailId={route.detailId} />
              </View>
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
  toolbar: {
    backgroundColor: '#333',
    height: 56,
  },
});

AppRegistry.registerComponent('ReactNativeWeb', () => ReactNativeWeb);