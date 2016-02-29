'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  Platform,
  WebView,
} = React;

module.exports = React.createClass({
  getInitialState: function() {
      return { data: {} };
  },
  componentDidMount: function(){
    var This = this;
    this._getDetailData(this.props.detailId, function(data){
        This.setState({ data: data });
    });
  },
  _getDetailData: function(detailId, callback) {
      var domain = 'http://weixin.chatu.com';
      var url = domain + '/api/article/get/' + detailId;
      fetch(url)
          .then((response) => response.json())
          .then((responseText) => {
              callback(responseText);
          })
          .catch((error) => {
              console.log(error);
          });
  },
  render: function() {
    var data = this.state.data;
    if(!data.Story){
      return <Text>Loading...</Text>;
    }
    if(Platform.OS == 'web'){
      var HTML = '<style>img{width:100%}</style>' + data.Story.Content;
      return(
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{data.Story.Title}</Text>
            <View style={styles.htmlView} dangerouslySetInnerHTML={{__html: HTML}} />
        </ScrollView>
      );
    }
    var HTML = '<!DOCTYPE html><html>'
        + '<head><style>img{width:100%}</style></head>'
        + '<body>'
        + data.Story.Content
        + '</body></html>';
      return (
            <WebView
                style={styles.webView}
                source={{html: HTML}}
                automaticallyAdjustContentInsets={true}
                scalesPageToFit={true}
            />
      );
  },

});

var styles = StyleSheet.create({
  container:{
      flex: 1,
  },
  title:{
      height:40,
      marginTop:10,
      fontSize:20,
      textAlign:'center'
  },
  htmlView:{
    padding:10,
  },
  webView:{
      flex:1,
  },
});

