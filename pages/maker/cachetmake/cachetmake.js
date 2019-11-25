// pages/maker/cachetmake/cachetmake.js
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
    makecacheSwipertHeight: parseInt(app.globalData.Height * 0.27),//制作公章swiper view高度
    makeScrollHeight: parseInt(app.globalData.Height * 0.45),//制作公章scroll-view view高度
    picHeight: parseInt(app.globalData.Height * 0.12),//添加公章中商品图片高度
    delWidth: parseInt(app.globalData.Width * 0.15),//删除区域宽度
    movableareaWdith: parseInt(app.globalData.Width-36),//movablearea区域宽度
    movableViewWidth: parseInt(app.globalData.Width * 1.15-36),//movable-view区域宽度==删除区域宽度+cache区域宽度
    // kindheight: parseInt(app.globalData.Height * 0.05),
    cachetHeight: parseInt(app.globalData.Height * 0.15),
    // picHeight: parseInt(app.globalData.Height * 0.12),
    mainheight: parseInt(app.globalData.Height * 0.76),
    cachetkindData:[],//公章种类数据
    cachetData:[],//公章数据
  },
swiperonclick(event){
  var cachetkindid = event.currentTarget.dataset.cachetkindid
  //设置storage 防止页面刷新  纪录上一次点击的cachetkind数据
  wx.setStorageSync('cachetkindid', cachetkindid)
  this.cachetkindRequest(cachetkindid)
},
//按公章种类查询公章数据
cachetkindRequest(cachetkindid){
  var userid = wx.getStorageSync(this.data.Userid)
  var accesstoken = wx.getStorageSync(this.data.Token)
  request({
    url: this.data.WEB + '/api/maker/selcachetbykind',
    method: 'post',
    data: {
      userid: userid,
      cachetkindid: cachetkindid
    },
    header: {
      'content-type': 'application/json',
      Authorization: "Bearer " + accesstoken
    }
  }).then(res => {
      console.log('种类点击',res.data)
    if (res.data.status =='success'){
      this.setData({
        cachetData: res.data.data
      })
  }else{
      this.setData({
        cachetData: []
      })
  }

  }).catch(err => {
    console.log(err)
  })
},
  //页面公章种类数据请求
  KinddataRequest() {
    var userid = wx.getStorageSync(this.data.Userid)
    console.log('user', userid)
    var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/maker/selcakind',
      method: 'post',
      data: {
        userid: userid
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      console.log('公章种类数据',res.data)
   if(res.data.status=='success'){
     this.setData({
       cachetkindData: res.data.data
     })
   }else{
     console.log('暂无数据')
   }

    }).catch(err => {
      console.log(err)
    })
  },
  //公章数据请求
  cachetData(){
    var cachetkindid = wx.getStorageSync('cachetkindid')
    console.log('cachetkindid',cachetkindid)
    if (cachetkindid==''){
      var userid = wx.getStorageSync(this.data.Userid)
      var accesstoken = wx.getStorageSync(this.data.Token)
      request({
        url: this.data.WEB + '/api/maker/selcachet',
        method: 'post',
        data: {
          userid: userid
        },
        header: {
          'content-type': 'application/json',
          Authorization: "Bearer " + accesstoken
        }
      }).then(res => {
         if(res.data.status=='success'){
           this.setData({
             cachetData: res.data.data
           })
           this.cachetMoveData()
         }else{
           this.setData({
             cachetData:[]
           })
         }

      }).catch(err => {
        console.log(err)
      })
    }
    else{
      this.cachetkindRequest(cachetkindid)
    }
  },
    //cachetData move数据设置
cachetMoveData(){
    var cachetData=this.data.cachetData
    for(var i=0;i<cachetData.length;i++){
      cachetData[i]['currentX']=0
      cachetData[i]['x'] = 0
    }
    this.setData({
      cachetData: cachetData
    })
  console.log('cachetData move数据设置',this.data.cachetData)
},
  //滑动改变
  handleMovableChange: function (e) {
    //e.detail x轴方向的偏移
    console.log('滑动改变', e.detail)
    // var shopdata = this.data.cachetData
    // var fatherindex = e.currentTarget.dataset.fatherindex//外层数组索引
    var index = e.currentTarget.dataset.index//内层数组索引
    this.data.cachetData[index]['currentX'] = e.detail.x;//记录手指刚开始触摸的位置
  },
  //滑动结束
  handleTouchend: function (e) {
    var cachetData = this.data.cachetData
    var index = e.currentTarget.dataset.index//内层数组索引
    // this.isMove = true;
    console.log('移动结束', this.data.cachetData[index]['currentX'])
    if (this.data.cachetData[index]['currentX'] < -this.data.delWidth * 0.5) {//向左移动距离大于删除区域宽度
      this.data.cachetData[index]['x'] = -this.data.delWidth;
      this.setData({
        cachetData: this.data.cachetData
      });
    } else {
      this.data.cachetData[index]['x'] = 0
      this.setData({
        cachetData: this.data.cachetData
      });
    }
  },
  handleTouchestart: function (e) {
    console.log('滑动开始', e)
  },
  //删除公章
delcachet(e) {
  var cachetid = e.currentTarget.dataset.cachetid
  var accesstoken = wx.getStorageSync(this.data.Token)
  var userid = wx.getStorageSync(this.data.Userid)

  request({
    url: this.data.WEB + '/api/maker/delcachet',
    method: 'post',
    data: {
      cachetid: cachetid,
      makerid: userid,
    },
    header: {
      'content-type': 'application/json',
      Authorization: "Bearer " + accesstoken
    }
  }).then(res => {
    if (res.data.status == "success") {
      wx.showLoading({
        title: '删除成功',
        duration: 1000
      })
      this.onShow()
    }
  }).catch(err => {
    console.log(err)
  })
},
//修改公章
cachetupdate(e){
  var cachetid = e.currentTarget.dataset.cachetid
  wx.navigateTo({
    url: '/pages/maker/cachetupdate/cachetupdate?cachetid=' + cachetid,
  })
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.KinddataRequest()
    this.cachetData()
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