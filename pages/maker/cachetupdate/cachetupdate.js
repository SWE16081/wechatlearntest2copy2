// pages/maker/cachetupdate/cachetupdate.js

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
    cachetMianheight: parseInt(app.globalData.Height * 0.19),//公章信息尺寸价格view
    cachetscrollHeight: parseInt(app.globalData.Height * 0.19),//公章信息scroll高度
    cachetMianheight2: parseInt(app.globalData.Height * 0.09),//公章信息颜色view
    cachetscrollHeight2: parseInt(app.globalData.Height * 0.09),//公章信息scroll高度
    cachetprivewHeight: 120,//公章上传预览图片高度
    cachetkindData: [],//公章种类数据
    cachetData:[],//公章数据
    kindcolumns: [],
    // show:false,//公章种类弹出层
    cachetaddList: [1],//公章价格尺寸view个数
    cachetColorList: [1],//公章颜色view个数
    previewPicList: [],//预览图片数据
    uploadPicList: [],//图片上传数据
    piccount: 6,//设置图片上传数量
    //提交数据
    cachetKindInfo: '公章种类',
    cachetnameInput: '',
    priceInput: [],
    sizeInput: [],
    colorInput: [],
    picInput: [],
    cachetid:'',
    delflage:false,//更新数据前删除picpath完成标志
  },
  //公章种类取消
  Cancel(e) {
    console.log(111)
    this.onClose()

  },
  //公章种类确认
  Confirm(e) {
    console.log(e.detail)
    this.data.cachetKindInfo = e.detail.value
    console.log('deliverway', this.data.cachetKindInfo)
    this.setData({
      cachetKindInfo: this.data.cachetKindInfo
    })
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
  //弹出层数据设置
  popupDataSet() {
    var cachetkindData = this.data.cachetkindData
    var arr = []
    for (var i = 0; i < cachetkindData.length; i++) {
      arr[i] = cachetkindData[i]['cakindname']
    }
    console.log('arr', arr)
    this.setData({
      kindcolumns: arr
    })
  },
  //公章名称
  cachetNameClick(event) {
    console.log(event.detail.value);
        this.setData({
          cachetnameInput: event.detail.value
        })

  },
  //添加尺寸价格filed
  addcachetMian() {
    wx.showToast({
      title: '添加成功',
      duration: 1000,
      icon: 'none'
    })
    var arr = this.data.cachetaddList
    arr.push(1)
    this.setData({
      cachetaddList: arr,
    })
    console.log('添加尺寸价格filed', this.data.cachetaddList)
  },
  //添加颜色filed
  addcachetcolor() {
    wx.showToast({
      title: '添加成功',
      duration: 1000,
      icon: 'none'
    })
    var arr = this.data.cachetColorList
    arr.push(1)
    this.setData({
      cachetColorList: arr,
    })
    console.log('添加颜色filed', this.data.cachetColorList)
  },
  //价格点击
  cachetpriceClick(event) {
    var index = event.currentTarget.dataset.index
    if (event.detail.value != "") {
      var arr = {}
      arr['price'] = event.detail.value
      console.log('arr', arr)
      var data = this.data.priceInput
      data[index] = arr
      console.log('data', data)
      this.setData({
        priceInput: data
      })
      console.log('价格', this.data.priceInput)
    } else {
      var data = this.data.priceInput
      data[index] = arr
      data.splice(index, 1);
      console.log('data', data)
      this.setData({
        priceInput: data
      })
      console.log('价格', this.data.priceInput)
    }

  },
  //尺寸点击
  cachetsizeClick(event) {
    var index = event.currentTarget.dataset.index
    if (event.detail.value != "") {
      var arr = {}
      arr['size'] = event.detail.value
      console.log('arr', arr)
      var data = this.data.sizeInput
      data[index] = arr
      this.setData({
        sizeInput: data
      })
      console.log('尺寸', this.data.sizeInput)
    } else {
      var data = this.data.sizeInput
      data[index] = arr
      data.splice(index, 1);
      console.log('data', data)
      this.setData({
        sizeInput: data
      })
      console.log('尺寸', this.data.sizeInput)
    }

  },
  //颜色点击
  cachetcolorClick(event) {
    var index = event.currentTarget.dataset.index
    if (event.detail.value != "") {
      var arr = {}
      arr['color'] = event.detail.value
      var data = this.data.colorInput
      data[index] = arr
      this.setData({
        colorInput: data
      })
      console.log('颜色', this.data.colorInput)
    } else {
      var data = this.data.colorInput
      data[index] = arr
      data.splice(index, 1);//数组删除
      console.log('data', data)
      this.setData({
        colorInput: data
      })
      console.log('颜色', this.data.colorInput)
    }

  },
//上传图片
  addpic(event) {
    var index = event.currentTarget.dataset.index
    var that = this
    var piccount = this.data.piccount
    wx.chooseImage({
      success(res) {
        console.log('上传的图片数据', res.tempFilePaths)
        console.log('上传的图片数据长度', res.tempFilePaths.length)
        var uploadPicList = that.data.uploadPicList
        var previewPicList= that.data.previewPicList
        for (var i = 0; i < res.tempFilePaths.length;i++){
          previewPicList.push(res.tempFilePaths[i])
          uploadPicList.push(res.tempFilePaths[i])
        }
      
        if (res.tempFilePaths.length > piccount) {
          wx.showToast({
            title: '上传图片不能大于' + piccount + '张!',
            icon: 'none'
          })
        } else {
          that.setData({
            previewPicList: previewPicList,
            uploadPicList: uploadPicList
          })
        }

      }
    })
  },
  //删除预览图片
  delPrivewPic(event) {
    var index = event.currentTarget.dataset.index
    var arr = this.data.previewPicList
    var arr2 = this.data.uploadPicList
    arr.splice(index, 1)
    arr2.splice(index, 1)
    this.setData({
      previewPicList: arr,
      uploadPicList:arr2
    })
  },
  //确认判断
  judge() {
    var cachetKindInfo = this.data.cachetKindInfo
    var cachetnameInput = this.data.cachetnameInput
    var priceInput = this.data.priceInput
    var sizeInput = this.data.sizeInput
    var colorInput = this.data.colorInput
    var previewPicList = this.data.previewPicList
    console.log('公章价格', priceInput)
    if (cachetKindInfo == '') {
      wx.showToast({
        title: '请选择公章种类',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (cachetnameInput == '') {
      wx.showToast({
        title: '请填写公章名称',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (priceInput == "") {

      wx.showToast({
        title: '请填写公章价格',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (sizeInput.length < priceInput.length) {
      wx.showToast({
        title: '公章尺寸漏填',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (sizeInput.length > priceInput.length) {
      wx.showToast({
        title: '公章价格漏填',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (sizeInput == '') {
      wx.showToast({
        title: '请设置公章尺寸',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (colorInput == '') {
      wx.showToast({
        title: '请填写公章颜色',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (previewPicList == '') {
      wx.showToast({
        title: '请上传公章图片',
        icon: 'none',
        duration: 1000
      })
      return false
    } else {
      return true;
    }
  },
  //确认前数据设置
  datasetBe() {
    var priceInput = this.data.priceInput
    var sizeInput = this.data.sizeInput
    var colorInput = this.data.colorInput
    var arr = []
    for (var i = 0; i < priceInput.length; i++) {
      arr[i]['price'] = priceInput[i]
      console.log(arr[i])
    }

  },
  //删除要更新的picpath数据
  updatapicdel(){
    
  },
  //确认
  affirm() {
    console.log('确认')
    var flage = this.judge()
    console.log("判断",flage)
    if (flage) {

      var cachetid = this.data.cachetid
      // var accesstoken = wx.getStorageSync(this.data.Token)
      request({
        url: this.data.WEB + '/api/maker/delcachepicpath',
        method: 'post',
        data: {
          cachetid: cachetid
        },
        header: {
          'content-type': 'application/json',
          // Authorization: "Bearer " + accesstoken
        }
      }).then(res => {
        console.log("更新",res.data)
        if (res.data.status == 'success') {
          var userid = wx.getStorageSync(this.data.Userid)
          var uploadPicList = this.data.uploadPicList
          var len = uploadPicList.length
          console.log('len', len)
          var formData = {
            userid: userid,
            cachetKindInfo: this.data.cachetKindInfo,
            cachetnameInput: this.data.cachetnameInput,
            priceInput: JSON.stringify(this.data.priceInput),
            sizeInput: JSON.stringify(this.data.sizeInput),
            colorInput: JSON.stringify(this.data.colorInput),
            cachetid: this.data.cachetid,

          }
          console.log('formdata', formData)
          console.log('uploadPicList', this.data.uploadPicList)
          var sum = 0
          for (var i = 0; i < len; i++) {
            wx.uploadFile({
              url: this.data.WEB + '/api/maker/updatecachet', //仅为示例，非真实的接口地址
              filePath: uploadPicList[i],
              name: 'file',
              method: 'post',
              header: {
                "Content-Type": "multipart/form-data",
                'accept': 'application/json',
                // 'Authorization': 'Bearer ' + accesstoken //若有token，此处换上你的token，没有的话省略
              },
              formData: formData,
              success(res) {
                //do something
                console.log('上传回传数据', JSON.parse(res.data))
                var result = JSON.parse(res.data)
                if (result.status == 'success') {
                  sum++
                  console.log(sum)
                  if (sum == len) {
                    wx.showToast({
                      title: '修改成功',
                      duration: 500
                    })
                    setTimeout(function () {
                      wx.navigateBack({
                        url: "/pages/maker/cachetmake/cachetmake"
                      })
                    }, 500);
              
                  }
                }
              }
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  //页面公章种类数据请求
  KinddataRequest() {
    var userid = wx.getStorageSync(this.data.Userid)
    console.log('user', userid)
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/maker/selcakind2',
      method: 'post',
      data: {
        userid: userid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.status == 'success') {
        this.setData({
          cachetkindData: res.data.data
        })
        this.popupDataSet()
      } else {
        console.log('公章种类数据加载失败')
      }
    }).catch(err => {
      console.log(err)
    })
  },
  //公章数据请求
  cachetRequest(){
    var cachetid = this.data.cachetid
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/maker/selcachetby',
      method: 'post',
      data: {
        cachetid: cachetid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if(res.data.status=='success'){
        // console.log('公章数据', res.data.data)
        this.setData({
          cachetData: res.data.data,
          cachetKindInfo: res.data.data[0]['cakindname']
        })
        this.cachetInfoMake() //公章价格，尺寸，颜色,名称，数据初始化
        this.previewPicSet() //下载图片数据初始化 previewPicList
      }else{
        console.log('暂无数据')
      }
    }).catch(err => {
      console.log(err)
    })
  },
  //公章价格，尺寸，颜色,名称，数据初始化
  cachetInfoMake(){
    var cachetData=this.data.cachetData
    var cachetaddList = this.data.cachetaddList
    var cachetColorList = this.data.cachetColorList
    var previewPicList = this.data.previewPicList
    var cachetnameInput = cachetData[0]['cachettagname']
    var priceInput = cachetData[0]['cachetPrice']
    var sizeInput = cachetData[0]['cachetSize']
    var colorInput = cachetData[0]['cachetColor']
    if (cachetData[0]['cachetPicPath']!=null){
      for (var i = 0; i < cachetData[0]['cachetPicPath'].length; i++) {
        previewPicList[i] = this.data.WEB + '/' + cachetData[0]['cachetPicPath'][i]
      }
    }

    for (var i = 0; i < cachetData[0]['cachetColor'].length-1;i++){
      cachetColorList.push(1)
    }

    for (var i = 0; i < cachetData[0]['cachetPrice'].length - 1; i++) {
      cachetaddList.push(1)
    }
    console.log('cachetaddList', cachetaddList)
    console.log('cachetColorList', cachetColorList)
    console.log('previewPicList', previewPicList)
    this.setData({
      cachetaddList: cachetaddList,
      cachetColorList: cachetColorList,
      priceInput: priceInput,
      sizeInput: sizeInput,
      colorInput: colorInput,
      previewPicList: previewPicList,
      cachetnameInput: cachetnameInput,
    })
  },
  //下载图片数据初始化 uploadPicList
previewPicSet(){
  var previewPicList = this.data.previewPicList
  var uploadPicList = this.data.uploadPicList
  console.log('previewPicList', previewPicList)
  var cachetid = this.data.cachetid
  // var accesstoken = wx.getStorageSync(this.data.Token)
  var that=this
  var sum=0
  var len = previewPicList.length
  for(var i=0;i<len;i++){
    console.log('index',i)
    wx.downloadFile({
      url: previewPicList[i], 
      method: 'post',
      header: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + accesstoken 
      },
      data: {
        cachetid: cachetid,
        index:i   
      },
      success(res) {
        if (res.statusCode === 200) {
          console.log(res)
          console.log('下载的图片数据', res.tempFilePath)
          console.log('下载的图片数据', typeof (res.tempFilePath))
          uploadPicList[sum] = res.tempFilePath
          sum++
          console.log('sum', sum)
          if (sum == len) {
            console.log('uploadPicList', uploadPicList)
            that.setData({
              uploadPicList: uploadPicList
            })
            console.log('下载完成', that.data.uploadPicList)
          }
        }
      },
      fail(res){
        console.log('下载失败')
      }
    })
  }
 
 
},
//修改
  update(){
    wx.navigateTo({
      url: '/pages/maker/makerorder/makerorder?index=0',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var cachetid = options.cachetid
    this.setData({
      cachetid: cachetid
    })
    console.log('options', cachetid)
    this.cachetRequest()//公章数据请求

    this.KinddataRequest()//公章种类数据数据请求
    
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