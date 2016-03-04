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
  Image,
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
        <Image 
           source={{uri:'./images/icon-back.imageset/icon-back@3x.png'}}
           style={styles.navBarLeftIcon} />
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
        {route.title.length>16 ? route.title.substring(0, 16) + '...' : route.title}
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
    color: '#fff',
  },
  navBarLeftButton: {
    color: '#fff',
    paddingLeft: 10,
  },
  navBarLeftIcon:{
   height:32,
   width:22,
  },
});


AppRegistry.registerComponent('ReactNativeWeb', () => ReactNativeWeb);

//web
var app = document.createElement('div');
document.body.appendChild(app);
AppRegistry.runApplication('ReactNativeWeb', {rootTag: app});
