// pages/makerLogin/makerLogin.js
var app=getApp();
import request from '../../../service/network.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    password:'',
    WEB: app.globalData.web,
    Token: app.globalData.Token,
    Role: app.globalData.Role,
    Userid: app.globalData.UserID,
    //帐号密码
    name:'',
    password:'',
  },
  //帐号点击
  nameClick(event) {
    var name = event.detail.value
    this.setData({
      name: name
    })
  },
  //密码点击
  passwordClick(event) {
    var password = event.detail.value
    this.setData({
      password: password
    })

  },

//登录
  submit(){
   var name=this.data.name
   var password=this.data.password
    var that = this
    //获取laravel的token请求后端api
    request({
      url: that.data.WEB + '/oauth/token',
      data: {
        grant_type: 'client_credentials',
        client_id: '3',
        client_secret: 'vGOdopoxPHn93OoGK78wbbMstauiJmv8gHec7l1l',
      },
      method: 'post',
      header: {
        'content-type': 'application/json; charset=UTF-8'
      }
    }).then(res => {
      var accesstoken = res.data.access_token
      request({
        url: that.data.WEB + '/api/maker/login',
        method: 'post',
        data: {
          name: that.data.name,
          password: that.data.password,
        },
        header: {
          'content-type': 'application/json',
          Authorization: "Bearer " + accesstoken
        }
      }).then(res => {
        console.log('商家登录', res.data)
        if (res.data.res == 'success') {
          // //将存储到storage中
          wx.setStorageSync(that.data.Token, accesstoken)//同步存储
          wx.setStorageSync(that.data.Role, 2)
          wx.setStorageSync(that.data.Userid, res.data.userid)
          wx.showToast({
            title: '商家登录成功',
            icon: 'success',
            duration: 3000
          })

          wx.reLaunch({
            url: '/pages/maker/makerIndex/makerIndex',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData.Token)
    // console.log(app.globalData.Role)
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