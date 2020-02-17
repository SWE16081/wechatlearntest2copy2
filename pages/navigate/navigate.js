// pages/navigate/navigate.js
var app = getApp();
import request from'../../service/network.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    WEB: app.globalData.web,
    Token: app.globalData.Token,
    Role: app.globalData.Role,
    Userid: app.globalData.UserID
  },

  //商家注册测试
  makerRgister: function (e) {
    wx.navigateTo({
      url: '/pages/maker/makerRegister/makerRegister',

    })
  },
  makerLogin:function(e){
    wx.navigateTo({
      url: '/pages/maker/makerLogin/makerLogin',
    })
  },
  userlogin:function(){
    wx.login({//微信端登陆获取code
      success: (res) => {
        // console.log("code为" + res.code)
        //获取code
        this.setData({
          code: res.code
        })
        var that = this;
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
        //   var accesstoken = res.data.access_token
 
        // }).catch(err=>{
        //   console.log(err)
        // })
        request({
          url: that.data.WEB + '/api/user/login',
          method: 'post',
          data: {
            code: that.data.code,
          },
          header: {
            'content-type': 'application/json'
            // Authorization: "Bearer " + accesstoken
          }
        }).then(res => {
          // console.log(res.data)
          if (res.data.res == 'success') {
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1000
            })
            // //将存储到storage中
            // wx.setStorageSync(that.data.Token, accesstoken)//同步存储
            wx.setStorageSync(that.data.Role, 1)
            wx.setStorageSync(that.data.Userid, res.data.userid)
            wx.switchTab({
              url: '/pages/user/home/home',
              //弹出等待审核窗口
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },
  // onGotUserInfo: function (e) {
  //   // console.log(e.detail.errMsg)
  //   // console.log(e.detail.userInfo)
  //   // console.log(e.detail.rawData)

  //   wx.getUserInfo({
  //     success: function (res) {
  //       wx.showModal({
  //         title: '用户授权',
  //         content: '申请获取以下权限',
  //         confirmText:'同意',
  //         cancelText:'拒绝',
  //         confirmColor:'#38c172',
  //         success(res) {
  //           if (res.confirm) {
  //             console.log('用户点击确定')
  //             //注册用户
  //             wx.redirectTo({
  //               url: '/pages/index/index',
  //             })
  //           } else if (res.cancel) {
  //             console.log('用户点击取消')
  //           }
  //         }
  //       })


  //     },
  //     // fail: S.showPrePage
  //   })
  // },
 
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
    // this.onGotUserInfo()
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