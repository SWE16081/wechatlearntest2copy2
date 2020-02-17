// pages/makerRegister/makerRegister.js
// const WEB = "http://www.wechatdemo5.com"
import request from '../../../service/network.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:"",
    name:"",
    password:"",
    role:2,
    WEB: app.globalData.web,
    Token: app.globalData.Token,
    Role: app.globalData.Role
  },
  formSubmit:function(e){
    // console.log(app.globalData.WEB)
    this.setData({
      name: e.detail.value.name,
      password: e.detail.value.password
    })
    wx.login({//微信端登陆获取code
      success: (res) => {
        console.log("code为" + res.code)
        //获取code
        this.setData({
          code: res.code
        })
        var that = this;
        request({
          url: that.data.WEB + '/api/register',
          method: 'post',
          data: {
            name: that.data.name,
            password: that.data.password,
            code: that.data.code,
            role: that.data.role,
          },
          header: {
            'content-type': 'application/json',
            // Authorization: "Bearer " + accesstoken
          }
        }).then(res => {
          console.log(res.data)
          if (res.data.res == 'success') {
            wx.showToast({
              title: '商家注册成功请等待审核',
              icon: 'success',
              duration: 2000
            })
            wx.reLaunch({
              url: '/pages/navigate/navigate',
              //弹出等待审核窗口
            })
            wx.showToast({
              title: '等待审核',
              icon: 'success',
              duration: 2000
            })
          } else if (res.data.res == 'repeat') {
            wx.showToast({
              title: '用户已注册',
              icon: 'success',
              duration: 2000
            })
            wx.reLaunch({
              url: '/pages/navigate/navigate',
              //弹出等待审核窗口
            })
          }
        }).catch(err => {
          console.log(err)
        })
        //获取laravel的token请求后端api
        // request({
        //   url: that.data.WEB + '/oauth/token',
        //   data: {
        //     grant_type: 'client_credentials',
        //     client_id: '3',
        //     client_secret: 'vGOdopoxPHn93OoGK78wbbMstauiJmv8gHec7l1l',
        //   },
        //   method: 'post',
        //   header: {
        //     'content-type': 'application/json; charset=UTF-8'
        //   }
        // }).then(res=>{
        //   // console.log(res.data.access_token)
        //   var accesstoken = res.data.access_token
     
        // }).catch(err=>{
        //   console.log(err)
        // })
      
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData.web);
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