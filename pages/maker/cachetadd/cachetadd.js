
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
    cachetkindData:[],//公章种类数据
    kindcolumns:[],
    // show:false,//公章种类弹出层
    cachetaddList:[1],//公章价格尺寸view个数
    cachetColorList:[1],//公章颜色view个数
    previewPicList:[],//预览图片数据
    piccount:6,//设置图片上传数量
    //提交数据
    cachetKindInfo: '公章种类',
    cachetnameInput:'',
    priceInput:[],
    sizeInput:[],
    colorInput:[],
    picInput:[],
  },
  //公章种类取消
Cancel(e){
  console.log(111)
  this.onClose()

},
//公章种类确认
Confirm(e){
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
popupDataSet(){
  var cachetkindData = this.data.cachetkindData
  var arr=[]
  for(var i=0;i<cachetkindData.length;i++){
    arr[i] = cachetkindData[i]['cakindname']
  }
  console.log('arr',arr)
  this.setData({
    kindcolumns:arr
  })
},
//公章名称
cachetNameClick(event){
  console.log(event.detail.value);
  //检验公章名称是否重复
  var userid=wx.getStorageSync(this.data.Userid)
  console.log('userid',userid)
  var accesstoken=wx.getStorageSync(this.data.Token)
  request({
    url: this.data.WEB + '/api/maker/checkrepeat',
    method: 'post',
    data: {
      userid: userid,
      cachetname: event.detail.value
    },
    header: {
      'content-type': 'application/json',
      Authorization: "Bearer " + accesstoken
    }
  }).then(res=>{
    console.log('公章名称check',res.data)
    if(res.data.status=="fail"){
      this.setData({
        cachetnameInput: event.detail.value
      })
  }else{
      wx.showToast({
        title: '公章名称重复',
        duration: 1000,
        icon: 'none'
      })
  }
  }).catch(err=>{
    console.log(err)
  })

},
//添加尺寸价格filed
addcachetMian(){
  wx.showToast({
    title: '添加成功',
    duration:1000,
    icon:'none'
  })
  var arr=this.data.cachetaddList
  arr.push(1)
  this.setData({
    cachetaddList:arr,
  })
},
//添加颜色filed
addcachetcolor(){
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
},
//价格点击
cachetpriceClick(event){
  var index=event.currentTarget.dataset.index
  if (event.detail.value!=""){
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
  }else{
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
cachetsizeClick(event){
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
cachetcolorClick(event){
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
//添加图片
addpic(event){
  // var index = event.currentTarget.dataset.index
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
delPrivewPic(event){
var index=event.currentTarget.dataset.index
var arr=this.data.previewPicList
arr.splice(index,1)
this.setData({
  previewPicList:arr
})
},
//确认判断
judge(){
  var cachetKindInfo = this.data.cachetKindInfo
  var cachetnameInput = this.data.cachetnameInput
  var priceInput = this.data.priceInput
  var sizeInput = this.data.sizeInput
  var colorInput = this.data.colorInput
  var previewPicList = this.data.previewPicList
  console.log('公章价格', priceInput)
  if (cachetKindInfo==''){
    wx.showToast({
      title: '请选择公章种类',
      icon:'none',
      duration:1000
    })
    return false
  } else if (cachetnameInput == ''){
    wx.showToast({
      title: '请填写公章名称',
      icon: 'none',
      duration: 1000
    })
    return false
  } else if (priceInput=="") {
   
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
  }  else if (sizeInput.length > priceInput.length) {
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
  }else{
    return true;
  }
},
//确认前数据设置
datasetBe(){
  var priceInput = this.data.priceInput
  var sizeInput = this.data.sizeInput
  var colorInput = this.data.colorInput
  var arr=[]
  for (var i = 0; i < priceInput.length;i++){
    arr[i]['price']=priceInput[i]
    console.log(arr[i])
  }

},
//确认
affirm(){
  console.log('确认')
  var flage = this.judge()
  if (flage){
    // this.datasetBe()
    var userid = wx.getStorageSync(this.data.Userid)
    var accesstoken = wx.getStorageSync(this.data.Token)
    var len = this.data.previewPicList.length
    console.log('len', len)
    var formData = {
      userid: userid,
      cachetKindInfo: this.data.cachetKindInfo,
      cachetnameInput: this.data.cachetnameInput,
      priceInput: JSON.stringify(this.data.priceInput),
      sizeInput: JSON.stringify(this.data.sizeInput),
      colorInput: JSON.stringify(this.data.colorInput),
    }
 var sum=0
    for (var i = 0; i < len; i++) {
      wx.uploadFile({
        url: this.data.WEB + '/api/maker/addcachet', //仅为示例，非真实的接口地址
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
          if(result.status=='success'){
             sum++
             console.log(sum)
            if (sum == len) {
              wx.showToast({
                title: '添加成功',
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
},

 //页面公章种类数据请求
KinddataRequest() {
    var userid = wx.getStorageSync(this.data.Userid)
    console.log('user', userid)
    var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/maker/selcakind2',
      method: 'post',
      data: {
        userid: userid
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if(res.data.status=='success'){
        this.setData({
          cachetkindData: res.data.data
        })
        this.popupDataSet()
      }else{
        console.log('公章种类数据加载失败')
      }

    }).catch(err => {
      console.log(err)
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.KinddataRequest()
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