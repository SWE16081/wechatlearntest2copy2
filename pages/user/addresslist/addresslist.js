// pages/user/addresslist/addresslist.js
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
    Height: app.globalData.Height,
    Width: app.globalData.Width,
    Userid: app.globalData.UserID,
    informationHeight: parseInt(app.globalData.Height*0.14),
    inforUpdateHeight: parseInt(app.globalData.Height * 0.03),
    inforfootHeight: parseInt(app.globalData.Height * 0.08),
    mainheight: parseInt(app.globalData.Height*0.82),
    //收件人数据
    address:[],
  },
  //添加收件人
  addAddress(){
    wx.navigateTo({
      url: '/pages/user/addAddress/addAddress',
    })
  },
  //更新收件人
  updateAddress(e){
    var addressid = e.currentTarget.dataset.addressid
    console.log('更新收件人', addressid)
    // wx.navigateTo({
    //   url: '/pages/user/updateAddress/updateAddress?addressid='+ addressid,
    // })
    // redirect
    wx.navigateTo({
      url: '/pages/user/updateAddress/updateAddress?addressid='+ addressid,
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
    var userid = wx.getStorageSync(this.data.Userid)
    var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/SelAddress',
      method: 'post',
      data: {
        userid: userid
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {

      console.log(res.data)
      this.setData({
        address: res.data,
      })
    }).catch(err => {
      console.log(err)
    })
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