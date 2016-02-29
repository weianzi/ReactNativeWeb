/**
 * web 入口文件
 */
'use strict';

var React = require('react-native');
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
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          back
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
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },
};
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
    //paddingTop: 20,
    flex: 1,
  },
  navBar: {
    backgroundColor: '#efeff4',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  navBarText: {
    fontSize: 16
  },
  navBarTitleText: {
    color: '#000',
    fontWeight: 700
  },
  navBarLeftButton: {
    color: '#007aff',
    paddingLeft: 10,
  },
});


AppRegistry.registerComponent('ReactNativeWeb', () => ReactNativeWeb);

//web
var app = document.createElement('div');
document.body.appendChild(app);
AppRegistry.runApplication('ReactNativeWeb', {rootTag: app});
