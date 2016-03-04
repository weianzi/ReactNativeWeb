'use strict';
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableHighlight,
} = React;

module.exports = React.createClass({

  render: function() {
    return (
    	<View style={styles.container}>
    		<Text>会员页面</Text>
    	</View>
    );
  },


  
});

var styles = StyleSheet.create({
	container: {
    flex: 1,
    marginTop: Platform.OS =='web' ? 44 : 24,
	  marginBottom:44,
	  backgroundColor:'#f8f8f8',
	  justifyContent:'center',
	  alignItems:'center',
	},
});

