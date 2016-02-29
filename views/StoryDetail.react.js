'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
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
      return(
        <View style={styles.container}>
            <Text style={styles.title}>{data.Story.Title}</Text>
            <View>{data.Story.Content}</View>
        </View>
      );
    }
    var HTML = '<!DOCTYPE html><html>'
        + '<head><style>img{width:100%}</style></head>'
        + '<body>'
        + data.Story.Content
        + '</body></html>';
      return (
        <View style={styles.container}>
            <Text style={styles.title}>{data.Story.Title}</Text>
            <WebView
                style={styles.webView}
                source={{html: HTML}}
                automaticallyAdjustContentInsets={false}
                scalesPageToFit={true}
            />
        </View>
      );
  },

});

var styles = StyleSheet.create({
  container:{
      flex: 1,
  },
  title:{
      height:50,
  },
  webView:{
      flex:1,
  },
});

