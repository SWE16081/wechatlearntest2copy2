// pages/user/order/order.js
var app = getApp()
import MD5 from '../../../utils/md5.js'
import request from '../../../service/network.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:'',
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
    orderMaker:'公章店铺',//店铺名称
    // orderState:'商家处理中',//订单状态
    //
    orderData:[],//订单数据
    page:1,//订单分页请求的页数，默认为第一页
  },
  //订单详情
  orderdetail(e){
    var orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/user/orderdetail/orderdetail?orderid='+orderid,
    })
    
  },
  delete(e){
    console.log(e.currentTarget.dataset.orderid)
    var orderid = e.currentTarget.dataset.orderid
    // var accesstoken=wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/OrderDelete',
      method:'post',
      data:{
        orderid:orderid
      },
      header:{
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res=>{
      if (res.data.res == "success") {
        this.onShow()
      }
    }).catch(err=>{
      console.log(err)
    })
  },

  //取消订单
  cancelOrder(e){
    // wx.showLoading({
    //   title:'请等待',
    //   success: (res) => {
        var orderid=e.currentTarget.dataset.orderid
        request({
          url: this.data.WEB +'/api/user/OrderCancel',
          method:'post',
          data:{
            orderid:orderid
          },
          header:{
            'conyent-type': 'applocation/json',
           //  Authorization: 'Bearer ' + accesstoken
          }
        }).then(res=>{
          console.log(res)
          if(res.data.status=='success'){
            this.onShow()
          }
        }).catch(err=>{
          console.log(err)
        })
    //   }
    // }) 
    // setTimeout(function () {
    //   wx.hideLoading()
    // },500)
  },
  //支付
  payfor(e){
    console.log('支付')
    var orderid=e.currentTarget.dataset.orderid
    var allprice=e.currentTarget.dataset.allprice
    allprice=1
    var userid=wx.getStorageSync(this.data.Userid)
    console.log('userid',userid)
    console.log('orderid',orderid)
    // var accesstoken=wx.getStorageSync(this.data.Token)
    var timeStamp=String((new Date()).getTime())
    wx.showLoading({
      title: '请等待',
      success: (res) => {
        request({
          url: this.data.WEB + '/api/user/paybyorder',
          method: 'post',
          data: {
            // orderid: orderid,
            userid: userid,
            totalprice: allprice * 10
          },
          header: {
            'content-type': 'application/json',
            // Authorization: "Bearer " + accesstoken
          }
        }).then(res => {
          console.log(res.data)
          if (res.data.status == "success") {
            // console.log(res.data)
            var nonceStr = res.data.data.nonce_str
            var package2 = 'prepay_id=' + res.data.data.prepay_id

            var appid = res.data.data.appid
            var apisecret = res.data.data.apisecret
            var signType = 'MD5'
            var paySign = this.paysignMake(appid, apisecret, timeStamp, nonceStr, package2, signType)
            var that = this
            wx.requestPayment({
              timeStamp: timeStamp,
              nonceStr: nonceStr,
              package: package2,
              signType: signType,
              paySign: paySign,
              success(res) {
                console.log('成功', res)
                if (res.errMsg == 'requestPayment:ok') {
                  //修改订单状态
                  that.payChangeOrderStatus(orderid)
                  that.onShow()
                }
              },
              fail(res) {
                console.log('失败', res)
              }
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 100)

  },
  payChangeOrderStatus(orderid){
    // var userid = wx.getStorageSync(this.data.Userid)
    // var accesstoken = wx.getStorageSync(this.data.Token)
   request({
     url: this.data.WEB +'/api/user/paybyorchangestatus',
     method:'post',
     data:{
       orderid:orderid
     },
     header:{
       'conyent-type': 'applocation/json',
      //  Authorization: 'Bearer ' + accesstoken
     }
   }).then(res=>{
     console.log(res)
     if(res.data.status=='success'){
       this.onShow()
     }
   }).catch(err=>{
     console.log(err)
   })
  },
  //构造再次签名
  paysignMake(appid, apisecret,timeStamp,nonceStr,package2,signType){
    var stringA = 'appId=' + appid+'&nonceStr='+nonceStr+'&package='+package2+'&signType='+signType+'&timeStamp='+timeStamp
    var stringSignTemp = stringA + '&key=' + apisecret
    var sign=MD5(stringSignTemp).toUpperCase()
    console.log('stringSignTemp', stringSignTemp)
    console.log(sign)
    return sign
  },
  //提醒发货
  remind(e){
    console.log('提醒发货')
    
    var orderid = e.currentTarget.dataset.orderid
    var userid = wx.getStorageSync(this.data.Userid)
    console.log('userid', userid)
    // var accesstoken=wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/addreinfotomaker',
      method: 'post',
      data: {
        orderid: orderid,
        // userid:userid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      console.log(res.data)
      if (res.data.status == "success") {
        // 
  
        if (res.data.message == '请求成功'){
          wx.showToast({
            title: '提醒商家发货成功',
            icon: 'none',
            duration: 1000
          })
        }
         else if (res.data.message == '已回复') {
        wx.showToast({
          title: "商家回复内容：" + res.data.data,
          icon: 'none',
          duration: 1000
        })
      }
      }

      else{
        if (res.data.message =='已提醒'){
          wx.showToast({
            title: '已提醒商家发货',
            icon: 'none',
            duration: 1000
          })
        }

      }
    }).catch(err => {
      console.log(err)
    })
  },
  confirm(e){
    console.log(111)
    var orderid = e.currentTarget.dataset.orderid
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB +'/api/user/confirm',
      method: 'post',
      data: {
        orderid: orderid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      console.log(res.data)
      if(res.data.status=="success"){
        wx.showToast({
          title: '签收成功',
          icon: 'success',
          duration: 1000
        })
        this.onShow()
      }
    }).catch(err => {
      console.log(err)
    })
  }, 
  comment(e){

  },
  onClick(event) {
    //切换页面orderData清空 page=1
    this.setData({
      orderData: [],
      page: 1,
    })
    console.log('点击',event.detail);
    var index=event.detail.index
    this.setData({
      index:index
    })
    this.onShow()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.index)
    this.setData({
      index:options.index
    })
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
    wx.showLoading({
      title:'加载中',
      success: (res) => {
        var userid=wx.getStorageSync(this.data.Userid)
        console.log("当前页数",this.data.page)
        request({
          url: this.data.WEB + '/api/user/OrderSelPage?page=' + this.data.page + '&state=' + this.data.index +'&userid='+userid,
          method: 'get',
          header: {
            'content-type': 'application/json',
            // Authorization: "Bearer " + accesstoken
          }
        }).then(res=>{
          if(res.data.status=='success'){
            console.log(res.data.data.data)
            //构造数据
            var data=res.data.data.data
            for (var i = 0; i < data.length; i++) {
              if (data[i]['state'] == "1") {
                data[i]['orderState'] = '待付款'
              } else if (data[i]['state'] == "2") {
                data[i]['orderState'] = '商家处理中'
              } else if (data[i]['state'] == "3") {
                data[i]['orderState'] = '待签收'
              } else if (data[i]['state'] == "4") {
                data[i]['orderState'] = '待评价'
              } else if (data[i]['state'] == "0") {
                data[i]['orderState'] = '交易成功'
              }
              var allnumber = 0
              var allprice = 0
              for (var j = 0; j < data[i]['order'].length; j++) {
    
                allnumber = allnumber + data[i]['order'][j]['number'];
                allprice = allprice + Number(data[i]['order'][j]['price2']) * data[i]['order'][j]['number']
              }
              data[i]['allnumber'] = Number((allnumber).toFixed(2))
              data[i]['allprice'] = Number((allprice).toFixed(2))
            }
    
           
            var orderData = this.data.orderData
            for (var i = 0; i < data.length; i++) {
              orderData.push(data[i])
            }

            this.setData({
              orderData: orderData
            })
          }else{
            if (res.data.message =='暂无数据'){
              // this.setData({
              //   orderData: res.data.data
              // })
              if(this.data.orderData.length!=0){
                wx.showToast({
                  title: '数据已加载完',
                  icon:'none'
                })
              }else{
                wx.showToast({
                  title: '暂无数据',
                  icon: 'none'
                })
              }
            }
          }
         
        }).catch(err=>{
          console.log(err)
        })
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    },1000)

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
    this.setData({
      page: this.data.page + 1
    })
    this.onShow()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})