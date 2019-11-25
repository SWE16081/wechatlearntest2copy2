// pages/maker/cachetkindadd/cachetkindadd.js
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
    //提交的数据
    cachetkindname:'',
    cachetexplain:'',

  },
  //公章种类名称点击
  NameClick(event){
    var cachetkindname = event.detail.value 
    this.setData({
      cachetkindname: cachetkindname
    })
  },
  //公章说明点击
  ExplainClick(event){
    var cachetexplain = event.detail.value
    this.setData({
      cachetexplain: cachetexplain
    })

  },
  //确认
  affirm(){
    var flage=this.jude()
    if(flage){
      var userid = wx.getStorageSync(this.data.Userid)
      var accesstoken = wx.getStorageSync(this.data.Token)
      var cachetkindname = this.data.cachetkindname
      var cachetexplain = this.data.cachetexplain
      request({
        url: this.data.WEB + '/api/maker/addcakind',
        method: 'post',
        data: {
          userid: userid,
          cachetkindname: cachetkindname,
          cachetexplain: cachetexplain
        },
        header: {
          'content-type': 'application/json',
          Authorization: "Bearer " + accesstoken
        }
      }).then(res=>{
        if (res.data.status=='success'){
          wx.showToast({
            title: '添加成功',
            duration: 500
          })
          setTimeout(function () {
            wx.navigateBack({
              url: "/pages/maker/cachetkind/cachetkind"
            })
          }, 500);
        }else{
          //添加操作出错页面
        }
      }).catch(err=>{
        consol.log(err)
      })
    }
  },
  //确认判断
  jude(){
    if(this.data.cachetkindname==''){
      wx.showToast({
        title: '公章种类名称不能为空',
        icon:'none',
        duration:1000
      })
      return false
    } else if (this.data.cachetexplain == ''){
      wx.showToast({
        title: '公章种类名称不能为空',
        icon: 'none',
        duration: 1000
      })
    }else{
      return true
    }
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