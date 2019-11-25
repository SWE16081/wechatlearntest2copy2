// pages/maker/makerorder/makerorder.js
var app = getApp()
import request from '../../../service/network.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    index2:'',
    WEB: app.globalData.web,
    Token: app.globalData.Token,
    Role: app.globalData.Role,
    Height: app.globalData.Height,
    Width: app.globalData.Width,
    Userid: app.globalData.UserID,
    kindheight: parseInt(app.globalData.Height * 0.05),
    cachetHeight: parseInt(app.globalData.Height * 0.15),
    picHeight: parseInt(app.globalData.Height * 0.12),
    picHeight2: parseInt(app.globalData.Height * 0.03),
    //
    orderMaker: '公章店铺',//店铺名称
    // orderState:'商家处理中',//订单状态
    //
    orderData: [],//订单数据
  },
  //订单详情
  orderdetail(e) {
    var orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/maker/orderdetail/orderdetail?orderid=' + orderid,
    })

  },
  delete(e) {
    console.log(e.currentTarget.dataset.orderid)
    var orderid = e.currentTarget.dataset.orderid
    var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/OrderDelete',
      method: 'post',
      data: {
        orderid: orderid
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.res == "success") {
        this.onShow()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  payfor(e) {

  },
  remind(e) {

  },
  confirm(e) {
    console.log(111)
    var orderid = e.currentTarget.dataset.orderid
    var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/confirm',
      method: 'post',
      data: {
        orderid: orderid
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.res == "success") {
        this.onShow()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  comment(e) {

  },
  //确认发货
  affirmSend(e){
    var orderid = e.currentTarget.dataset.orderid
    var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/maker/affirmsend',
      method: 'post',
      data: {
        orderid: orderid
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.status == "success") {
        wx.showToast({
          title: '修改成功',
          duration:500
        })
        this.onShow()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  onClick(event) {
    console.log('点击', event.detail);
    var index = event.detail.index
    this.setData({
      index:index
    })
    if(index!=0){
      this.setData({
        index2: index + 1
      })
    }else{
      this.setData({
        index2: index 
      })
    }

    this.onShow()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.index)
    this.setData({
      index: options.index
    })
    var index2=Number(options.index)
    if(index2!=0){
      this.setData({
        index2:index2+1
      })
    }else{
      this.setData({
        index2: index2
      })
    }
    // this.show()
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
      url: this.data.WEB + '/api/maker/ordersel',
      method: 'post',
      data: {
        state: this.data.index2,
        userid: userid,
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.status == 'success') {
        console.log(res.data.data)
        var data=res.data.data
        for (var i = 0; i < data.length; i++) {
         if (data[i]['state'] == "2") {
            data[i]['orderState'] = '请尽快发货'
          } else if (data[i]['state'] == "3") {
            data[i]['orderState'] = '等待签收'
          }else if (data[i]['state'] == "0") {
            data[i]['orderState'] = '交易完成'
          }
          var allnumber = 0
          var allprice = 0
          for (var j = 0; j < data[i]['order'].length; j++) {

            allnumber = allnumber + data[i]['order'][j]['number'];
            allprice = allprice + Number(data[i]['order'][j]['price2']) *data[i]['order'][j]['number']
          }
          data[i]['allnumber'] = Number((allnumber).toFixed(2))
          data[i]['allprice'] = Number((allprice).toFixed(2))
        }
        this.setData({
          orderData:data
        })
      } else {
        if (res.data.message == '暂无数据') {
          this.setData({
            orderData: res.data.data
          })
        }
      }

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