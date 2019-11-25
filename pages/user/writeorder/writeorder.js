// pages/user/writeorder/writeorder.js
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
    informationHeight: parseInt(app.globalData.Height * 0.14),
    cachetlistHeight: parseInt(app.globalData.Height * 0.15),
    inforUpdateHeight: parseInt(app.globalData.Height * 0.03),
    otherinforListHeight: parseInt(app.globalData.Height * 0.05),
    inforfootHeight: parseInt(app.globalData.Height * 0.08),
    picHeight: parseInt(app.globalData.Height * 0.12),
    mainheight: parseInt(app.globalData.Height * 0.82),
    cachetprscrollHeight: 110,//公章上传scroll-view预览图片高度
    cachetprivewHeight: 100,//公章上传预览图片高度
    shopcar: [],
    allnumber: 0,//一共 买的数量
    previewPicList: [],//预览图片数据
    //提交的数据
    arr: [],//要买的购物车shopcarid
    name: '',
    phone: '',
    deliverway: '',
    allprice: 0,//总价
    address: '',
    explain: '',
    //立即购买提交数据
    cachetid: 0,
    nameinput: '',
    sizeinput: '',
    colorinput: '',
    numinput: '',
    priceinput: '',
    picPathinput: '',
    wayinfor: '请选择配送方式',
    wayList: ['快递配送', '到店自取'],
    previewPicFlage: false,//预览图片显示
    addressflage:true,//地址显示
  },
  //填写订单
  explainChange(event) {
    console.log(event.detail);
    this.data.explain = event.detail.value
    this.setData({
      explain: this.data.explain
    })
    console.log(this.data.explain)
  },
  //配送方式确认
  wayConfirm(e) {
    console.log(e.detail)
    this.data.deliverway = e.detail.value
    if (e.detail.value =='到店自取'){
      this.setData({
        addressflage:false,
      })
    }else{
      this.setData({
        addressflage: true,
      })
    }
    console.log('deliverway', this.data.deliverway)
    this.setData({
      deliverway: this.data.deliverway,
      wayinfor: this.data.deliverway
    })
    this.onClose()
  },
  //配送方式取消
  wayCancel() {
    console.log(111)
    this.onClose()
  },
  //弹出层显示
  showPopup() {
    this.setData({ show: true });
  },
  //弹出层隐藏
  onClose() {
    this.setData({ show: false });
  },
  //修改个人信息
  inforUpdate() {
    wx.navigateTo({
      url: '/pages/user/addresslist/addresslist',
    })
  },
  //上传公章证明材料
  addpic() {
    var that = this
    var piccount = this.data.piccount
    wx.chooseImage({
      success(res) {
        console.log('上传的图片数据', res.tempFilePaths)
        console.log('上传的图片数据长度', res.tempFilePaths.length)
        var previewPicList = that.data.previewPicList
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          previewPicList.push(res.tempFilePaths[i])
        }
        that.setData({
          previewPicFlage: true
        })
        if (res.tempFilePaths.length > piccount) {
          wx.showToast({
            title: '上传图片不能大于' + piccount + '张!',
            icon: 'none'
          })
        } else {
          that.setData({
            previewPicList: previewPicList
          })
        }

      }
    })
  },
  //删除预览图片
  delPrivewPic(event) {
    var index = event.currentTarget.dataset.index
    var arr = this.data.previewPicList
    arr.splice(index, 1)
    if (arr.length == 0) {
      this.setData({
        previewPicFlage: false
      })
    }
    this.setData({
      previewPicList: arr
    })
  },
  //提交判断
  jude() {
    if (this.data.name == '' || this.data.phone == '' || this.data.address == "") {
      wx.showToast({
        title: '请填写收件人信息',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (this.data.deliverway == "") {
      wx.showToast({
        title: '请填选择配送方式',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if(this.data.previewPicList.length== 0) {
      wx.showToast({
        title: '请上传证明材料',
        icon: 'none',
        duration: 1000
      })
      return false
    } else {
      return true
    }


  },
  //提交订单
  ordersubmit() {
    var arr = this.data.arr
    var name = this.data.name
    var phone = this.data.phone
    var deliverway = this.data.deliverway
    var address = this.data.address
    var allprice = this.data.allprice
    var explain = this.data.explain
    var userid = wx.getStorageSync(this.data.Userid)
    var accesstoken = wx.getStorageSync(this.data.Token)
    var flage = this.jude()
    if (flage) {
      request({
        url: this.data.WEB + '/api/user/OrderAdd',
        method: 'post',
        data: {
          userid: userid,
          arr: arr,
          name: name,
          phone: phone,
          address: address,
          deliverway: deliverway,
          totalprice: allprice,
          state: 1,
          explain: explain,
        },
        header: {
          'content-type': 'application/json',
          Authorization: "Bearer " + accesstoken
        }
      }).then(res => {
        if (res.data.res == "success") {

          var orderid=res.data.result
          this.uploadsProvePic(orderid)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  //上传公章图片
  uploadsProvePic(orderid){
     var userid = wx.getStorageSync(this.data.Userid)
      var accesstoken = wx.getStorageSync(this.data.Token)
      var len = this.data.previewPicList.length
      console.log('len', len)
      var formData = {
        orderid:orderid
      }
      var sum = 0
      for (var i = 0; i < len; i++) {
        wx.uploadFile({
          url: this.data.WEB + '/api/user/OrderAddProve', //仅为示例，非真实的接口地址
          filePath: this.data.previewPicList[i],
          name: 'file',
          method: 'post',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            'Authorization': 'Bearer ' + accesstoken //若有token，此处换上你的token，没有的话省略
          },
          formData: formData,
          success(res) {
            //do something
            console.log('上传回传数据', JSON.parse(res.data))
            var result = JSON.parse(res.data)
            if (result.res == 'success') {
              sum++
              console.log(sum)
              if (sum == len) {
               // wx.setStorageSync('sallprice', 0)//用于提交订单后清楚购物车总价
                wx.showToast({
                  title: '购买成功',
                  icon: 'success',
                  duration: 500
                })
                setTimeout(function () {
                  wx.navigateBack({
                    url: '/pages/user/home/home'
                  })
                }, 500);
              }
            }
          }
        })
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

    var userid = wx.getStorageSync(this.data.Userid)
    var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/AffirmOrderSel2',
      method: 'post',
      data: {
        userid: userid
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      console.log('从购物车结算数据格式', res.data)
      var sum = 0;
      for (var i = 0; i < res.data['shopcar'].length; i++) {
        sum = sum + res.data['shopcar'][i]['number']
      }
      this.setData({
        allnumber: sum,
        shopcar: res.data,
        name: res.data['address']['name'],
        phone: res.data['address']['phone'],
        address: res.data['address']['city'] + res.data['address']['address'],
      })
      this.allpriceset()
    }).catch(err => {
      console.log(err)
    })


  },
  //设置合计
  allpriceset() {
    var data = this.data.shopcar['shopcar']
    var allprice = 0
    var arr = []
    for (var i = 0; i < data.length; i++) {
      var money = data[i]['number'] * data[i]['price']
      allprice = Number((allprice + money).toFixed(2))
      arr[i] = data[i]['shopcarid']
    }
    this.setData({
      allprice: allprice,
      arr: arr
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