// pages/maker/cachetkind/cachetkind.js
import request from '../../../service/network.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WEB: app.globalData.web,//网站路径
    Token: app.globalData.Token,//存储token的storage名字
    Role: app.globalData.Role,//存储role的storage名字
    Userid: app.globalData.UserID,
    Height: app.globalData.Height,
    Width: app.globalData.Width,
    cachetKindHeight: parseInt(app.globalData.Height * 0.13),//公章种类view高度
    makeScrollHeight: parseInt(app.globalData.Height * 0.7),//制作公章scroll-view view高度
    movableareaWdith: parseInt(app.globalData.Width - 36),//movablearea区域宽度
    movableViewWidth: parseInt(app.globalData.Width * 1.15 - 36),//movable-view区域宽度==删除区域宽度+cache区域宽度
    cachetHeight: parseInt(app.globalData.Height * 0.15),
    delWidth: parseInt(app.globalData.Width * 0.15),//删除区域宽度
    //公章种类
    cachetKindData:[],
  },
  //滑动改变
  handleMovableChange: function (e) {
    //e.detail x轴方向的偏移
    console.log('滑动改变', e.detail)
    var index = e.currentTarget.dataset.index//内层数组索引
    this.data.cachetKindData[index]['currentX'] = e.detail.x;//记录手指刚开始触摸的位置
  },
  //滑动结束
  handleTouchend: function (e) {
    var cachetKindData = this.data.cachetKindData
    var index = e.currentTarget.dataset.index//内层数组索引
    // this.isMove = true;
    console.log('移动结束', this.data.cachetKindData[index]['currentX'])
    if (this.data.cachetKindData[index]['currentX'] < -this.data.delWidth * 0.5) {//向左移动距离大于删除区域宽度
      this.data.cachetKindData[index]['x'] = -this.data.delWidth;
      this.setData({
        cachetKindData: this.data.cachetKindData
      });
    } else {
      this.data.cachetKindData[index]['x'] = 0
      this.setData({
        cachetKindData: this.data.cachetKindData
      });
    }
  },
  handleTouchestart: function (e) {
    console.log('滑动开始', e)
  },
  //添加公章种类
  addcachetkind(){
    wx.navigateTo({
      url: '/pages/maker/cachetkindadd/cachetkindadd',
    })
  },
 //更新公章种类数据
  update(event){
    var cachetkindid = event.currentTarget.dataset.cachetkindid
    // var cachetid = e.currentTarget.dataset.cachetid
    console.log('更新cachetkindid', cachetkindid)
    wx.navigateTo({
      url: '/pages/maker/cachetkindupdate/cachetkindupdate?cachetkindid=' + cachetkindid,
    })
  },
 //删除公章种类
  delete(event){
    var cachetkindid = event.currentTarget.dataset.cachetkindid
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/maker/deletecakind',
      method: 'post',
      data: {
        cachetkindid: cachetkindid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.status == 'success') {
        wx.showToast({
          title: '删除成功',
          duration: 500
        })
     this.onShow()
      }else{
        //删除有错误
      }
    }).catch(err => {
      console.log(err)
    })
  },

//页面数据请求
dataRequest(){
  var userid=wx.getStorageSync(this.data.Userid)
  // var accesstoken=wx.getStorageSync(this.data.Token)
  request({
    url: this.data.WEB + '/api/maker/selcakind2',
    method:'post',
    data:{
      userid: userid
    },
    header:{
      'content-type': 'application/json',
      // Authorization: "Bearer " + accesstoken
    }
  }).then(res=>{
    console.log('公章种类显示页面')
    console.log(res.data)
    if (res.data.status=='success'){
      this.setData({
        cachetKindData: res.data.data
      })
      this.cachetkindMoveData()
    }else{
      //暂无数据
    }

  }).catch(err=>{
    console.log(err)
  })
},
  //cachetkindData move数据设置
  cachetkindMoveData() {
    var cachetKindData = this.data.cachetKindData
    for (var i = 0; i < cachetKindData.length; i++) {
      cachetKindData[i]['currentX'] = 0
      cachetKindData[i]['x'] = 0
    }
    this.setData({
      cachetKindData: cachetKindData
    })
    console.log('cachetKindData move数据设置', this.data.cachetKindData)
  },
  /**
   * 生命周期函数--监听页面显示
   */
onShow: function () {
  this.dataRequest()
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})