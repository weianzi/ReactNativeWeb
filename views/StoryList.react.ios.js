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

import Storage from 'react-native-storage';

//本地存储
var storage = new Storage({
    //最大容量，默认值1000条数据循环存储
    size: 1000,    
    //数据过期时间，默认一整天（1000 * 3600 * 24秒）
    defaultExpires: 1000 * 3600 * 24,
    //读写时在内存中缓存数据。默认启用。
    enableCache: true,
    //如果storage中没有相应数据，或数据已过期，
    //则会调用相应的sync同步方法，无缝返回最新数据。
    sync: {
      //同步方法
      storyList(params) {
          let { id, resolve, reject } = params;
          let domain = 'http://weixin.chatu.com';
          let url = domain +'/api/article/GetList?pageindex=' + id + '&pagesize=10';
          console.log('同步方法');
          fetch(url)
              .then(response => response.json())
              .then(json => {
                  if(json && json.Data){
                      storage.save({
                          key: 'storyList',
                          rawData: json.Data
                      });
                      //成功则调用resolve
                      resolve && resolve(json.Data);
                  } else {
                      // 失败则调用reject
                      reject && reject('data parse error');
                  }
              })
              .catch((error) => {
                  console.warn(error);
                  reject && reject(err);
              }
          );
      }
    }
});
//全局
global.storage = storage;
var first = true;

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
  //componentWillMount:function(){},
  componentDidMount: function(){
    // 读取
    if(first){
        storage.load({
            key: 'storyList',
            id: '1',
            //autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的同步方法
            autoSync: true,
            //syncInBackground(默认为true)意味着如果数据过期，
            //在调用同步方法的同时先返回已经过期的数据。
            //设置为false的话，则始终强制返回同步方法提供的最新数据(当然会需要更多等待时间)。
            syncInBackground: true
        }).then( ret => {
            //如果找到数据，则在then方法中返回
            console.log(ret.storyListData);
            if(ret.storyListData && ret.currentPage){
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(ret.storyListData),
                    currentPage: 0,
                    totalCount: ret.TotalCount,
                    pageSize: ret.PageSize,
                    loaded: true,
                    isloadingNextPage: false,
                    isRefreshing: false,
                }); 
                first = false;
            } else {
                this._getStoryList(1, data => {
                   this._setNewData(data)
                })
            }
        }).catch( err => {
            //如果没有找到数据且没有同步方法，
            //或者有其他异常，则在catch中返回
            console.warn(err);
        })
    }
  },
  _setNewData: function(data) {
    let newData = this.state.data.concat(data.Data);
    storage.save({
        key: 'storyList',
        id: '1',
        rawData: {
            storyListData: newData,
            currentPage: data.PageIndex,
            totalCount: data.TotalCount,
            pageSize: data.PageSize,
        },
        expires: 1000 * 3600
    });
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
      console.log('远程获取数据' + page);
      var domain = 'http://weixin.chatu.com';
      var url = domain +'/api/article/GetList?pageindex=' + page + '&pagesize=5';
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
      setTimeout(() => {
        this._getStoryList(1, (data) => {
            this._setNewData(data);
            this.setState({ data: [] });
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
          console.log(0);
          return;
      }
      this.setState({isloadingNextPage: true});
      storage.remove({
          key: 'storyList',
          id: '1'
      });
      let currentPage = this.state.currentPage;
      setTimeout(() => {
          this._getStoryList(currentPage + 1, (data) => {
              this._setNewData(data);
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
      marginTop: Platform.OS =='web' ? 44 : 24,
      marginBottom: 44,
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

