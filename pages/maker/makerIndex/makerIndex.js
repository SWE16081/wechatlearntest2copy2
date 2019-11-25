// pages/makerIndex/makerIndex.js
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
    headHeight: parseInt(app.globalData.Height * 0.35),//最上面图片swiper高度
    contInforHeight: parseInt(app.globalData.Height * 0.25),//消息view高度
    InforSwiperHeight: parseInt(app.globalData.Height * 0.12),//消息swiper高度
    makeHeight: parseInt(app.globalData.Height * 0.3),//制作公章view高度
    Height2: parseInt(app.globalData.Height * 1.1),//main 高度
    //tabbar选中项
    active:0,
    //用于tab切换显单页面显示不同
    tabshow:[true,false],
    //右上角数字提醒
    waitSend: '',
    waitGet: '',
    waitComment: '',
    message:'',
    
  },
  //订单类型条数信息请求
  orderListDataReq(){
    var accesstoken=wx.getStorageSync(this.data.Token)
    var userid=wx.getStorageSync(this.data.Userid)
    request({
      url:this.data.WEB+'/api/maker/orderLenSel',
      method:'post',
      data:{
        userid:userid
      },
      header:{
        'content-type':'application/json',
        Authorization:'Bearer '+accesstoken,
      }
    }).then(res=>{
      if(res.data.status="success"){
        this.setData({
          waitSend:res.data.data[0],
          waitGet: res.data.data[1],
          waitComment: res.data.data[2],
          // message: res.data.data[3]
        })
      }
      else{
        this.setData({
          waitPay: '',
          waitSend: '',
          waitGet: '',
          waitComment: '',
        })
      }
    }).catch(err=>{
      console.log(err)
    })

  },
  //查看公章详情
  cachetdetailClick(){
    wx.navigateTo({
      url: '/pages/maker/cachetmake/cachetmake',
    })
  },
  onChange(event) {
    console.log(event.detail);
    for(var i=0;i<this.data.tabshow.length;i++){
      if (i == event.detail){
        this.data.tabshow[i]=true;
      }else{
        this.data.tabshow[i] = false;
      }
    } this.setData({
      active: event.detail,
      tabshow: this.data.tabshow
    })

  },


  seeAllorder() {
    wx.navigateTo({
      url: '/pages/maker/makerorder/makerorder?index=0',
    })
  },
  //退出登录
  dropLogin() {
    //清除缓存
    wx.clearStorage()
    wx.reLaunch({
      url: '/pages/navigate/navigate',
    })
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //设置storage 防止页面刷新  纪录上一次点击的cachetkind数据
    wx.setStorageSync('cachetkindid', '')
    this.orderListDataReq()
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