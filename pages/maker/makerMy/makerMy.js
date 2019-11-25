// pages/maker/makerMy/makerMy.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //tabbar选中项
    active: 1,
    //tabbar页面切换地址
    tabbarList: [
      {
        url: '/pages/maker/makerIndex/makerIndex'
      },
      {
        url: '/pages/maker/makerMy/makerMy'
      }
    ]
  },
  onChange(event) {
    console.log(event.detail);
    this.setData({
      active: event.detail
    })
    
    wx.redirectTo({
      url: this.data.tabbarList[event.detail].url,
    })
    console.log(this.data.tabbarList[event.detail].url)
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
    const page = getCurrentPages().pop();
    this.setData({
      active: this.data.tabbarList.findIndex(item => item.url === `/${page.route}`)
    });
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