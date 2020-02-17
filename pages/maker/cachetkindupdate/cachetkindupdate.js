// pages/maker/cachetkindupdate/cachetkindupdate.js
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
    cachetkind:[],
    cachetkindid:'',
    //提交的数据
    cachetkindname: '',
    cachetexplain: '',

  },
  //公章种类名称点击
  NameClick(event) {
    console.log("公章种类名称点击",event.detail)
    var cachetkindname = event.detail
    this.setData({
      cachetkindname: cachetkindname
    })
  },
  //公章说明点击
  ExplainClick(event) {
    console.log("公章说明",event)
    var cachetexplain = event.detail
    this.setData({
      cachetexplain: cachetexplain
    })

  },
  //确认
  affirm() {
    var flage = this.jude()
    if (flage) {
      var cachetkindid = this.data.cachetkindid
      // var accesstoken = wx.getStorageSync(this.data.Token)
      var cachetkindname = this.data.cachetkindname
      var cachetexplain = this.data.cachetexplain
      console.log("cachetkindid", cachetkindid)
      console.log("cachetkindname", cachetkindname)
      console.log("cachetexplain", cachetexplain)
      console.log("修改种类")
      request({
        url: this.data.WEB + '/api/maker/updatecakind',
        method: 'post',
        data: {
          cachetkindid: cachetkindid,
          cachetkindname: cachetkindname,
          cachetexplain: cachetexplain
        },
        header: {
          'content-type': 'application/json',
          // Authorization: "Bearer " + accesstoken
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.status == 'success') {
          wx.showToast({
            title: '修改成功',
            duration: 500
          })
          setTimeout(function () {
            wx.navigateBack({
              url: "/pages/maker/cachetkind/cachetkind"
            })
          }, 500);
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  //确认判断
  jude() {
    if (this.data.cachetkindname == '') {
      wx.showToast({
        title: '公章种类名称不能为空',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (this.data.cachetexplain == '') {
      wx.showToast({
        title: '公章种类说明不能为空',
        icon: 'none',
        duration: 1000
      })
    } else {
      return true
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  console.log('公章种类更新',options)
    var cachetkindid = options.cachetkindid
    this.setData({
      cachetkindid: cachetkindid
    })
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/maker/selcakindby',
      method: 'post',
      data: {
        cachetkindid: cachetkindid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      console.log("更新数据",res.data)
      if (res.data.status == 'success') {
       this.setData({
         cachetkind:res.data.data,
         cachetkindname: res.data.data[0]['cakindname'],
         cachetexplain: res.data.data[0]['cachetExplain'],
       })
  
      }
    }).catch(err => {
      console.log(err)
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