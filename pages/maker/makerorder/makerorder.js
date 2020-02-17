// pages/maker/makerorder/makerorder.js
var app = getApp()
import request from '../../../service/network.js'
import MD5 from '../../../utils/md5.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    index2:'',//订单状态
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
    infoData:[],
    show:false,//弹出层
    backinfolist:['正在配送','制作中','客户较多'],
    // backinfo:'回复信息内容'
    page: 1,//订单分页请求的页数，默认为第一页
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
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/OrderDelete',
      method: 'post',
      data: {
        orderid: orderid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
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
  //配送方式确认
  wayConfirm(e) {
    console.log(e.detail)
    var index = wx.getStorageSync('popindex')
    this.data.orderData[index]['backinfo'] = e.detail.value
    this.setData({
      orderData: this.data.orderData
    })
    this.onClose()
  },
  //配送方式取消
  wayCancel() {
    console.log(111)
    this.onClose()
  },
  //弹出层显示
  showPopup(e) {
    var index = e.currentTarget.dataset.index
    console.log('index',index)
    wx.setStorageSync('popindex',index)
    this.data.orderData[index]['show']=true
    this.setData({ orderData:this.data.orderData });
  },
  //弹出层隐藏
  onClose() {
    var index = wx.getStorageSync('popindex')
    this.data.orderData[index]['show'] = false
    this.setData({ orderData: this.data.orderData });
  },
  confirm(e) {
    console.log(111)
    var orderid = e.currentTarget.dataset.orderid
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/confirm',
      method: 'post',
      data: {
        orderid: orderid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
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
  //回复消息填写判断
  infojudge(){
    if (this.data.backinfo=='回复信息内容'){
      wx.showToast({
        title: '请选择回复信息',
        icon:'none',
        duration:1000
      })
      return false;
    }else{
      return true
    }
  },
  //消息回复 修改消息状态，重新请求数据将infodata设为空
  infoback(e){
    var flage=this.infojudge()
    if(flage){
      var orderid = e.currentTarget.dataset.orderid
      var backinfo = e.currentTarget.dataset.backinfo
      var userid = wx.getStorageSync(this.data.Userid)
      // var accesstoken = wx.getStorageSync(this.data.Token)
      request({
        url: this.data.WEB + '/api/maker/infoback',
        method: 'post',
        data: {
          orderid: orderid,
          backinfo: backinfo,
          userid:userid
        },
        header: {
          'content-type': 'application/json',
          // Authorization: "Bearer " + accesstoken
        }
      }).then(res => {
        if (res.data.status == "success") {
          wx.showToast({
            title: '回复成功',
            icon: 'success',
            duration: 1000
          })
          this.setData({
            infoData:[]
          })
          this.onShow()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  //确认发货,修改订单状态，重新请求数据将orderdata设为空
  affirmSend(e){
    var orderid = e.currentTarget.dataset.orderid
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/maker/affirmsend',
      method: 'post',
      data: {
        orderid: orderid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.status == "success") {
        wx.showToast({
          title: '修改成功',
          duration:500
        })
        this.setData({
          orderData:[]
        })
        this.onShow()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  onClick(event) {
    //切换页面orderData清空 page=1
     this.setData({
       orderData:[],
       page:1,
     })

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
   //数据请求
    datarequest(){
      wx.showLoading({
        title: '加载中',
        success: (res) => {
          var userid = wx.getStorageSync(this.data.Userid)
          // var accesstoken = wx.getStorageSync(this.data.Token)
          console.log("状态", this.data.index2)
          request({

            url: this.data.WEB + '/api/maker/orderselpage?page=' + this.data.page + '&state=' + this.data.index2 + '&userid=' + userid,
            method: 'get',
            // data: {
            //   state: this.data.index2,
            //   userid: userid,
            // },
            header: {
              'content-type': 'application/json',
              // Authorization: "Bearer " + accesstoken
            }
          }).then(res => {
            console.log("订单数据请求", res.data)
            if (res.data.status == 'success') {
              console.log(res.data.data.data)
              var data = res.data.data.data
              for (var i = 0; i < data.length; i++) {
                if (data[i]['state'] == "2") {
                  data[i]['orderState'] = '请尽快发货'
                } else if (data[i]['state'] == "3") {
                  data[i]['orderState'] = '等待签收'
                } else if (data[i]['state'] == "0") {
                  data[i]['orderState'] = '交易完成'
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
            } else {
              if (res.data.message == '暂无数据') {
                if (this.data.orderData.length != 0) {
                  wx.showToast({
                    title: '数据已加载完',
                    icon: 'none'
                  })
                } else {
                  wx.showToast({
                    title: '暂无数据',
                    icon: 'none'
                  })
                }
              }
            }

          }).catch(err => {
            console.log(err)
          })
        }
      })

      setTimeout(function () {
        wx.hideLoading()
      }, 1000)

    },
    //消息数据请求
    infodatarequest(){
    
        wx.showLoading({
          title: '加载中',
          success: (res) => {
            var userid = wx.getStorageSync(this.data.Userid)
            // var accesstoken = wx.getStorageSync(this.data.Token)
            request({
              url: this.data.WEB + '/api/maker/selinfopage?page=' + this.data.page + '&userid=' + userid,
              method: 'get',
              // data:{
              //   userid: userid
              // },
              header: {
                'content-type': 'application/json',
                // Authorization: "Bearer " + accesstoken
              }
            }).then(res => {
              console.log(res.data.data.data)
              if (res.data.status == 'success') {
                var data = res.data.data.data

                for (var i = 0; i < data.length; i++) {
                  data[i]['remindinfoid'] = MD5(String(data[i]['remindinfoid']))
                  data[i]['backinfo'] = '回复信息内容'
                  data[i]['show'] = false
                }

                var infoData = this.data.infoData
                for (var i = 0; i < data.length; i++) {
                  infoData.push(data[i])
                }

                this.setData({
                  infoData: infoData
                })
              } else {
                if (res.data.message == '暂无数据') {
                  if (this.data.infoData.length != 0) {
                    wx.showToast({
                      title: '数据已加载完',
                      icon: 'none'
                    })
                  } else {
                    wx.showToast({
                      title: '暂无数据',
                      icon: 'none'
                    })
                  }
                }

              }

            }).catch(err => {
              console.log(err)
            })
          }
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 1000)

    },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.index2!='4'){
      this.datarequest()
    }else{
      this.infodatarequest()
    }
   
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
    if (this.data.index2 != '4') {
      this.datarequest()
    } else {
      this.infodatarequest()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})