// pages/user/writeorder/writeorder.js
var app = getApp()
import request from '../../../service/network.js'
import MD5 from '../../../utils/md5.js'
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
    allprice2:0,//用于计算快递费
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
    express:0,
    sum:0,//订单证明材料提交成功个数
    meetname:'',//到店自取联系人姓名
    meetphone:'',//到店自取联系人电话
    phoneWarning:'',//手机号错误提示信息
  },
  //填写订单备注
  explainChange(event) {
    console.log(event.detail);
    this.data.explain = event.detail.value
    this.setData({
      explain: this.data.explain
    })
    console.log(this.data.explain)
  },
  //到店自取联系人姓名
  buyername(event){
    var meetname=event.detail
    console.log("联系人姓名",meetname)
    this.setData({
      meetname:meetname
    })
  },
  //到店自取联系人电话
  buyerphone(event){
    var meetphone=event.detail
    console.log("联系人电话",meetphone)
    this.setData({
      meetphone:meetphone
    })
  },
  //配送方式确认
  wayConfirm(e) {
    console.log(e.detail)
    this.data.deliverway = e.detail.value 
    var allprice=0
    if (e.detail.value =='到店自取'){
      this.setData({
        addressflage:false,
      })
      allprice=this.data.allprice2
    }else{
      this.setData({
        addressflage: true,
      })
      allprice = Number((this.data.allprice2 + Number(this.data.express)).toFixed(2))
      this.data.deliverway = this.data.deliverway+ ":" + this.data.express + "元"
    }
    console.log('deliverway', this.data.deliverway)
    console.log(typeof ("express",this.data.express))
    console.log(typeof ("allprice",this.data.allprice))
 
    console.log("加上快递费总价",allprice)
    this.setData({
      deliverway: this.data.deliverway ,
      wayinfor: this.data.deliverway
,      allprice: allprice
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
    console.log("上传图片总价",this.data.allprice)
    var that = this
    var piccount = this.data.piccount
    wx.chooseImage({
      success(res) {
        // console.log('上传的图片数据', res.tempFilePaths)
        // console.log('上传的图片数据长度', res.tempFilePaths.length)
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
    if (this.data.name == '请填写收件人' || this.data.phone == '手机号' || this.data.address == "请填写城市及详细地址") {
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
  jude2() {
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/;
 if (this.data.previewPicList.length == 0) {
      wx.showToast({
        title: '请上传证明材料',
        icon: 'none',
        duration: 1000
      })
      return false
    }else if (this.data.meetname == ''  ) {
      wx.showToast({
        title: '请填联系人姓名',
        icon: 'none',
        duration: 1000
      })
      return false;
    }else if(this.data.meetphone == ''){
      wx.showToast({
        title: '请填联系人电话',
        icon: 'none',
        duration: 1000
      })
      return false;
    }else if (this.data.meetphone.length!=11){
      wx.showToast({
        title: '手机号长度应为11为',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    else if (!myreg.test(this.data.meetphone)){
      wx.showToast({
        title: '请填写存在的手机号',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    else {
      return true
    }


  },
  //提交订单
  ordersubmit(e) {
    var allprice = e.currentTarget.dataset.allprice
    wx.setStorageSync("payprice",allprice)
    if (this.data.addressflage){//快递配送
      var flage = this.jude()
      if (flage) {
        this.addOrder(1)
      }
    }else{//到店自取
      var flage = this.jude2()
      if (flage) {
        this.addOrder(1)
      }
    }
 
  },
  //添加订单
  //先创建订单然后根据返回orderid上传证明材料，支付成功则修改订单状态并跳转页面，失败则跳转页面
  addOrder(status) {
    var arr = this.data.arr
    var name = this.data.name
    var phone = this.data.phone
    var deliverway = this.data.deliverway
    var address = this.data.address
    var allprice = this.data.allprice
    var explain = this.data.explain
    var userid = wx.getStorageSync(this.data.Userid)
    console.log("deliverway", deliverway)
    // var accesstoken = wx.getStorageSync(this.data.Token)
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
        state: status,
        explain: explain,
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      console.log(res.data)
      if (res.data.res == "success") {

        var orderid = res.data.result
        // this.payfor(orderid)
        //上传公章证明材料
        this.uploadsProvePic(orderid)
      }
    }).catch(err => {
      console.log(err)
    })

  },
  //构造再次签名
  paysignMake(appid,apisecret,timeStamp, nonceStr, package2, signType) {
    var stringA = 'appId=' + appid + '&nonceStr=' + nonceStr + '&package=' + package2 + '&signType=' + signType + '&timeStamp=' + timeStamp
    var stringSignTemp = stringA + '&key=' + apisecret
    var sign = MD5(stringSignTemp).toUpperCase()
    console.log('stringSignTemp', stringSignTemp)
    console.log(sign)
    return sign
  },
  //上传公章图片
  uploadsProvePic(orderid){
     var userid = wx.getStorageSync(this.data.Userid)
      // var accesstoken = wx.getStorageSync(this.data.Token)
      var len = this.data.previewPicList.length
      wx.showLoading({
        title:'请等待',
        success: (res) => {
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
                'accept': 'application/json'
              },
              formData: formData,
              success:res=> {
                var result = JSON.parse(res.data)
                if (result.res == 'success') {
                  sum++
                  if (sum == len) {   //上传订单信息成功   
                    console.log("上传成功")
                           this.setData({
                             sum:sum
                           }) 
                       this.payfor(orderid)//支付
                  }
                }
              }
            })
          }
        }
      });
      setTimeout(function () {
        wx.hideLoading()
      },2500)
    
  },
  //支付
  payfor(orderid){
    //支付
    var userid = wx.getStorageSync(this.data.Userid)
    var allprice = wx.getStorageSync("payprice")//订单总金额
    var timeStamp = String((new Date()).getTime())
    allprice = 1
        request({
          url: this.data.WEB + '/api/user/paybyorder',
          method: 'post',
          data: {
            userid: userid,
            totalprice: allprice * 10
          },
          header: {
            'content-type': 'application/json',
          }
        }).then(res => {
          // console.log(res.data)
          if (res.data.status == "success") {
            var nonceStr = res.data.data.nonce_str
            var package2 = 'prepay_id=' + res.data.data.prepay_id
            var appid = res.data.data.appid
            var apisecret = res.data.data.apisecret
            var signType = 'MD5'
            var paySign = this.paysignMake(appid,apisecret,timeStamp, nonceStr, package2, signType)
          var that=this
            //再次签名
            wx.requestPayment({
              timeStamp: timeStamp,
              nonceStr: nonceStr,
              package: package2,
              signType: signType,
              paySign: paySign,
              success(res) {
                console.log('成功', res)
                if (res.errMsg == 'requestPayment:ok') {
                    //支付成功
                  //修改订单状态

                  that.payChangeOrderStatus(orderid)
                }
              },
              fail(res) {
                console.log('失败', res)
                  wx.showToast({
                    title: '等待付款',
                    icon: 'success',
                    duration: 500
                  })
          
                setTimeout(function () {
                  wx.navigateBack({
                    url: '/pages/user/home/home'
                  })
                }, 500);
              }
            })
          }
        }).catch(err => {
          console.log(err)
        })
  },
  payChangeOrderStatus(orderid) {
    // var userid = wx.getStorageSync(this.data.Userid)
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/paybyorchangestatus',
      method: 'post',
      data: {
        orderid: orderid
      },
      header: {
        'conyent-type': 'applocation/json',
        // Authorization: 'Bearer ' + accesstoken
      }
    }).then(res => {
      console.log("修改订单状态",res)
      if (res.data.status == 'success') {
        // this.datarequest()
     
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
   datarequest(){
     var userid = wx.getStorageSync(this.data.Userid)
     // var accesstoken = wx.getStorageSync(this.data.Token)
     request({
       url: this.data.WEB + '/api/user/AffirmOrderSel2',
       method: 'post',
       data: {
         userid: userid
       },
       header: {
         'content-type': 'application/json',
         // Authorization: "Bearer " + accesstoken
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
         express: res.data['express'][0]['expressprice']
       })
       this.allpriceset()
     }).catch(err => {
       console.log(err)
     })
   },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.datarequest()
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
      allprice2:allprice,
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