//app.js

App({
  globalData:{
  // web:'http://www.wechatdemo5.com',
    // web: 'http://123.207.89.57',
    web: 'https://www.herry.club',
  Token:'accesstoken',//缓存token的名字
  Role:'role',
  UserID:'userid',
  Height:'',
  Width:''
},

//获取屏幕宽高尺寸
 getHeightWid(){
   var that=this
   wx.getSystemInfo({
     success(res) {
       console.log(res);
       // 屏幕宽度、高度
       console.log('height=' + res.screenHeight);
       console.log('width=' + res.windowWidth);
       // 高度,宽度 单位为px
       that.globalData.Height = res.screenHeight
       that.globalData.Width = res.windowWidth
       console.log(that.globalData.Height)
       console.log(that.globalData.Width )
     }
   })
 },
  onLaunch: function () {
    this.getHeightWid()
    //清除缓存
    // wx.clearStorage()
    // 从缓存中取出token,role
    const userid = wx.getStorageSync(this.globalData.UserID)
    const role = wx.getStorageSync(this.globalData.Role)
    //判断用户角色
    if (userid && userid.length !== 0 && role && role.length !== 0){
      if (role == 1) {//普通用户跳转制作公章页面
        wx.switchTab({
          url: '/pages/user/home/home',
        })
      } else {//商家用户
        // if (token && token.length !== 0) {
          // this.check_token(token)//验证token是否过期

          //刷新token
          wx.redirectTo({
            url: '/pages/maker/makerIndex/makerIndex',
          })
        // }
    }
    }
    // else{
    //   wx.redirectTo({
    //     url: '/pages/navigate/navigate',
    //   })
    // }



    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //     }
  //   })
  //   // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             // 可以将 res 发送给后台解码出 unionId
  //             this.globalData.userInfo = res.userInfo

  //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //             // 所以此处加入 callback 以防止这种情况
  //             if (this.userInfoReadyCallback) {
  //               this.userInfoReadyCallback(res)
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  },
 
})