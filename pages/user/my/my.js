// pages/user/my/my.js
var app = getApp()
import request from '../../../service/network.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WEB: app.globalData.web,
    Token: app.globalData.Token,
    Role: app.globalData.Role,
    Userid: app.globalData.UserID,
    waitPay:'',
    waitSend:'',
    waitGet:'',
    waitComment:'',
  },
  //待处理订单条数数据设置
  inforListDataMake(){
    var userid = wx.getStorageSync(this.data.Userid)
    var accesstoken = wx.getStorageSync(this.data.Token)
       request({
         url: this.data.WEB + '/api/user/OrderLenSel',
         method: 'post',
         data: {
           userid: userid,
         },
         header: {
           'content-type': 'application/json',
           Authorization: "Bearer " + accesstoken
         }
       }).then(res => {
     
         if (res.data.status == 'success') {
           var arr=res.data.data
           console.log('arr',arr)
           if (res.data.data.length>99)
             res.data.data.length='99+'
           this.setData({
             waitPay: arr[1],
             waitSend: arr[2],
             waitGet: arr[3],
             waitComment: arr[4],
           })
         } else {
           console.log(222)
          //  if (res.data.message == '暂无数据') {
             this.setData({
               waitPay: '',
               waitSend: '',
               waitGet: '',
               waitComment: '',
             })
            
          //  }
         }

       }).catch(err => {
         console.log(err)
       })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //退出登录
  dropLogin(){
    //清除缓存
    wx.clearStorage()
    wx.reLaunch({
      url: '/pages/navigate/navigate',
    }) 
  },
  seeAllorder(){
    wx.navigateTo({
      url: '/pages/user/order/order?index=0',
    })
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
    this.inforListDataMake()
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