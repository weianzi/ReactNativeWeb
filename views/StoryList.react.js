'use strict';
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Platform,
  RefreshControl,
  ActivityIndicatorIOS,
  TouchableHighlight,
} = React;

//var fetch = Platform.OS === 'web' ? require('ReactJsonp') : require('ReactFetch');

module.exports = React.createClass({
  getInitialState: function() {
      return {
          data:[],
          dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
          loaded: false,
          isloadingNextPage: false, //是否正在加载下一页
          currentPage: 0,
          totalCount: 0,//总数量
          pageSize: 10,
          isRefreshing: false,
      };
  },
  componentDidMount: function(){
    var This = this;
    this._getStoryList(1, function(data){
        This._setNewData(data);
    });
  },
  _setNewData: function(data) {
    let newData = this.state.data.concat(data.Data);
    this.setState({
        data: newData,
        dataSource: this.state.dataSource.cloneWithRows(newData),
        currentPage: data.PageIndex,
        totalCount: data.TotalCount,
        pageSize: data.PageSize,
        loaded: true,
        isloadingNextPage: false,
        isRefreshing: false,
    }); 
  },
  _getStoryList: function(page, callback) {
      var domain = 'http://weixin.chatu.com';
      var url = domain +'/api/article/GetList?pageindex=' + page + '&pagesize=10';
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
    if(!this.state.loaded){
        return this._renderLoadingView();
    }
    if(Platform.OS == 'web'){
        return (
          <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderRow}
              onEndReachedThreshold={66}
              automaticallyAdjustContentInsets={false}
              showsVerticalScrollIndicator={false}
              renderFooter={this._renderFooter}
              onEndReached={this._loadMore}
              style={styles.listView} />
        );
    }
    return (
      <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          onEndReachedThreshold={66}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={false}
          renderFooter={this._renderFooter}
          onEndReached={this._loadMore}
          style={styles.listView}
          refreshControl={
              <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh}
                  tintColor='#ccc'
                  title='正在刷新'
                  colors={['#bbb','#ccc','#333']}
                  progressBackgroundColor='#f9f9f9' />
          }
      />
    );
  },
  _onRefresh: function(){
      var This = this;
      this.setState({isRefreshing: true});
      setTimeout(function(){
        This._getStoryList(1, function(data){
            This._setNewData(data);
        });
      }, 1000);
  },
  _renderRow: function(rowData) {
      return (
          <TouchableHighlight 
            style={styles.touchBtn} 
            underlayColor="#fff" 
            onPress={this._toDetail.bind(this, rowData.StoryId, rowData.Title)}>
              <View style={styles.itemView}>
                  <Image source={{uri:rowData.CoverUrl}} style={styles.coverImg}/>
                  <View style={styles.textView}>
                      <View style={styles.authorAndTime}>
                          <Text allowFontScaling={false} style={styles.author}>{rowData.Author}</Text>
                          <Text allowFontScaling={false} style={styles.time}>{rowData.PublishTime}</Text>
                      </View>
                      <Text allowFontScaling={false} style={styles.title}>{rowData.Title}</Text>
                      <View style={styles.countBox}>
                          <Text allowFontScaling={false} style={styles.count}>阅读{rowData.ViewCount}</Text>
                          <Text allowFontScaling={false} style={styles.dot}>·</Text>
                          <Text allowFontScaling={false} style={styles.count}>评论{rowData.CommentCount}</Text>
                          <Text allowFontScaling={false} style={styles.dot}>·</Text>
                          <Text allowFontScaling={false} style={styles.count}>喜欢{rowData.LikeCount}</Text>
                      </View>
                  </View>
              </View>
          </TouchableHighlight>
      );
  },
  _renderLoadingView: function(isFooter){
      return (
          <View style={[styles.loading, isFooter ? styles.footerLoading : null]}>
              <ActivityIndicatorIOS
                  animating={true}
                  color={'#808080'}
                  size={'small'} />
          </View>
      );
  },
  _renderFooter: function(){
      if(this.state.isloadingNextPage){
          return this._renderLoadingView(true);
      }
  },
  _loadMore: function(){
      if (this.state.isloadingNextPage) {
          return;
      }
      if(this.state.currentPage * this.state.pageSize >= this.state.totalCount){
          return;
      }
      this.setState({isloadingNextPage: true});
      let currentPage = this.state.currentPage;
      let This = this;
      setTimeout(function(){
          This._getStoryList(currentPage + 1, function(data){
              This._setNewData(data);
          });
      }, 300);
  },
  _toDetail: function (detailId, title) {
    this.props.navigator.push({
        name: 'storyDetail',
        detailId,
        title,
    });
  },
  
});

var styles = StyleSheet.create({
  listView:{
      flex: 1,
      marginTop:44,
      marginBottom:44,
      backgroundColor:'#f8f8f8',
  },
  itemView:{
      flex:1,
      flexDirection:'row',
      marginLeft:15,
      marginRight:15,
      height:117,
      paddingTop:15,
      paddingBottom:13,
      borderBottomWidth:1,
      borderColor:'#ebebeb',
  },
  loading:{
      marginTop:150,
      justifyContent: 'center',
      alignItems: 'center',
  },
  footerLoading:{
      height:30,
      marginTop:10,
      marginBottom:10,
  },
  coverImg:{
      width:85,
      height:85,
      marginRight:8,
      marginBottom:3,
  },
  textView:{
      flex:1,
  },
  authorAndTime:{
      flex:1,
      flexDirection:'row',
  },
  time:{
      marginLeft:4,
      color:'#999',
      fontSize:12,
  },
  author:{
      color:'#444',
      fontSize:12,
  },
  title:{
      height:48,
      lineHeight:22,
      fontSize:18,
      marginTop:5,
      marginBottom:5,
      color:'#222',
  },
  countBox:{
      flexDirection:'row',
  },
  count:{
      fontSize:12,
      color:'#999',
  },
  dot:{
      lineHeight:16,
      fontSize:16,
      marginRight:2,
      marginLeft:2,
      color:'#dcdcdc',
  }
});

