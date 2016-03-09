/**
 * IOS 入口文件
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
   StatusBarIOS,
   TouchableOpacity,
 } = React;

 //StatusBarIOS.setStyle('light-content');

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
            source={require('./images/icon-back.imageset/icon-back.png')}
            style={styles.navBarLeftIcon} />
       </TouchableOpacity>
     );
   },
   RightButton: function(route, navigator, index, navState) {
     return (
      <View style={styles.rightBtnView}></View>
     );
   },
   Title: function(route, navigator, index, navState) {
     if(!route.title){
       return (
         <Text style={[styles.navBarText]}>
           我的WebApp
         </Text>
       )
     }
     return (
       <Text style={[styles.navBarText]}>
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
    backgroundColor:'#333',
    //height: 44,
    paddingTop: 20,
   },
   navBar: {
     backgroundColor: '#333',
     height: 44,
   },
   navBarText: {
     fontSize: 14,
     color: '#fff',
   },
   navBarLeftButton: {
     paddingLeft: 10,
   },
   navBarLeftIcon:{
    height:32,
    width:22,
   },
   rightBtnView:{
   },
 });


 AppRegistry.registerComponent('ReactNativeWeb', () => ReactNativeWeb);