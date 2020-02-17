// pages/user/companyinfo/companyinfo.js
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
    //公司信息数据
    companyinfodata: [],
    showFlage: ''
  },
  //公司数据请求
  dataRequest() {
    var userid = wx.getStorageSync(this.data.Userid)
    request({
      url: this.data.WEB + '/api/user/selmakerInfo',
      method: 'post',
      header: {
        'content-type': 'application/json',
      }
    }).then(res => {
      if (res.data.status == 'success' && res.data.data[0]['companyinfo'] != null) {

        console.log('公司信息', res.data.data)
        var companyinfodata = res.data.data[0]
        this.setData({
          companyinfodata: companyinfodata,
          showFlage: false
        })

      } else {
        this.setData({
          showFlage: true
        })
        console.log('暂无数据')
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.dataRequest()
    console.log("页面刷新")
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      showFlage: ''
    })
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