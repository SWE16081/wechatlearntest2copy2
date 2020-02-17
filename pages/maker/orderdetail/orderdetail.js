// pages/user/orderdetail/orderdetail.js
var app = getApp()
import request from '../../../service/network.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:'',
    WEB: app.globalData.web,
    Token: app.globalData.Token,
    Role: app.globalData.Role,
    Height: app.globalData.Height,
    Width: app.globalData.Width,
    Userid: app.globalData.UserID,
    kindheight: parseInt(app.globalData.Height * 0.05),
    cachetHeight: parseInt(app.globalData.Height * 0.15),
    picHeight: parseInt(app.globalData.Height * 0.11),
    picHeight2: parseInt(app.globalData.Height * 0.03),
    orderinfo:'',//订单状态文字
    orderdata:[],//订单数据
    allnumber:0,
    allprice:0,
    explain: '暂无备注',//订单备注
  },
  //返回前一页
  backbefore(){
   wx.navigateBack({
     url:'/pages/user/order/order'
   })
  },
  //返回公章购买页面
  tocachetshop(){
     wx.reLaunch({
       url: '/pages/user/home/home',
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderid=options.orderid
    // console.log('页面传参', options)
    this.setData({
      orderid:orderid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //请求订单详情信息
   orderRequest(){
     var accesstoken=wx.getStorageSync(this.data.Token)
    //  orderid
     var orderid=this.data.orderid
     console.log('orderid',orderid)
    request({
      url: this.data.WEB + '/api/user/orderdetail',
      method: 'post',
      data: {
        orderid: orderid
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      console.log('订单详情',res.data.data)
      if (res.data.status == "success") {
         this.setData({
           orderdata:res.data.data
         })
        if (res.data.data['explain'] != null) {
          this.setData({
            explain: res.data.data['explain']
          })
        }
         this.datamake()
         console.log('orderdata',this.data.orderdata)
      }
      else{
        if (res.data.message =='暂无数据'){
          console.log('暂无数据')
        }
      }
    }).catch(err => {
      console.log(err)
    })
   },
   //allnumber allprice数据初始化
   datamake(){
     var orderdata = this.data.orderdata.order
     var data = this.data.orderdata
     var allnumber = 0
     var allprice = 0
     if (data.state=='1'){
       this.data.orderinfo='尚未付款'
     }
     else if (data.state=='2')
     {
       this.data.orderinfo='尚未发货'
     }
     else if (data.state == '3') {
       this.data.orderinfo = '订单配送中'
     }
     else if (data.state == '4') {
       this.data.orderinfo = '待评价'
     }
     else if (data.state == '0') {
       this.data.orderinfo = '订单完成'
     }

     for(var i=0;i<orderdata.length;i++){
       allnumber = allnumber + orderdata[i]['number'];
       allprice = allprice + Number(orderdata[i]['price2']) * orderdata[i]['number']
     }
     allnumber= Number((allnumber).toFixed(2))
     allprice= Number((allprice).toFixed(2))
     this.setData({
       allnumber: allnumber,
       allprice: allprice,
       orderinfo:this.data.orderinfo
     })
   },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.orderRequest()
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