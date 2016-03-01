/**
 * web 入口文件
 */
'use strict';
var React = require('react-native');
var MainTabBar = require('./MainTabBar.react');
var StoryList = require('./views/StoryList.react');
var StoryDetail = require('./views/StoryDetail.react');
var {
  AppRegistry,
  Navigator,
  StyleSheet,
  Text, 
  View,
  TouchableOpacity,
} = React;

var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>返回
        </Text>
      </TouchableOpacity>
    );
  },
  RightButton: function(route, navigator, index, navState) {
    return (
      <View/>
    );
  },
  Title: function(route, navigator, index, navState) {
    if(!route.title){
      return (
        <Text style={[styles.navBarText, styles.navBarTitleText]}>
          我的WebApp
        </Text>
      )
    }
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },
};
var RouteMapper = function(route, navigator) {
    switch(route.name){
      case 'storyList':
          return (
            <StoryList navigator={navigator} />
          );
      case 'storyDetail':
          return (
              <StoryDetail 
                navigator={navigator} 
                detailId={route.detailId} />
          );
        default:
          return (
              <MainTabBar navigator={navigator} />
          );
    }
};

var ReactNativeWeb = React.createClass({
    render: function(){
        var initialRoute = {name: 'MainTabBar'};
        return (
          <Navigator
              style={styles.container}
              initialRoute={initialRoute}
              renderScene={RouteMapper}
              navigationBar={
                <Navigator.NavigationBar
                  routeMapper={NavigationBarRouteMapper}
                  style={styles.navBar}
                />
              }
          />
        );
    }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    backgroundColor: '#333',
    height: 54,
    top:-10,
  },
  navBarText: {
    fontSize: 16
  },
  navBarTitleText: {
    //marginTop:-10,
    color: '#fff',
  },
  navBarLeftButton: {
    color: '#fff',
    paddingLeft: 10,
    //marginTop:-10,
  },
});


AppRegistry.registerComponent('ReactNativeWeb', () => ReactNativeWeb);

//web
var app = document.createElement('div');
document.body.appendChild(app);
AppRegistry.runApplication('ReactNativeWeb', {rootTag: app});
