// pages/user/shopcar/shopcar.js
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
    delWidth: parseInt(app.globalData.Width * 0.15),//删除区域宽度
    movableareaWdith: parseInt(app.globalData.Width - 16),//movablearea区域宽度
    movableViewWidth: parseInt(app.globalData.Width * 1.15 - 16),//movable-view区域宽度==删除区域宽度+cache区域宽度
    kindheight: parseInt(app.globalData.Height * 0.05),
    cachetHeight: parseInt(app.globalData.Height * 0.15),
    picHeight: parseInt(app.globalData.Height * 0.12),
    mainheight: parseInt(app.globalData.Height * 0.76),
    shopcarData: [],
    // 合计
    allprice: 0,
    allchoose: false,
    //判断进入购物车次数
    count: 1,
  },

  //种类checkbox
  kindchooseChange(e) {
    // console.log(e.detail.value)
    var fatherindex = e.currentTarget.dataset.fatherindex//外层数组索引
    var accesstoken = wx.getStorageSync(this.data.Token)
    var userid = wx.getStorageSync(this.data.Userid)
    var data = this.data.shopcarData
    var cachetKindid = data[fatherindex]['cachetKindid']
    var kindchoosed = data[fatherindex]['kindchoosed']
    var allprice = this.data.allprice
    if (kindchoosed) {//取消选中
      kindchoosed = false
      // allprice=allprice-
      var sum = 0;//改变总价
      for (var i = 0; i < data[fatherindex]['cachet'].length; i++) {
        sum = sum+data[fatherindex]['cachet'][i]['price'] * data[fatherindex]['cachet'][i]['number']
      }
      allprice = Number((allprice-sum).toFixed(2));
      if(allprice<=0)
      allprice=0
    } else {//选中
      kindchoosed = true
      var sum = 0;
      for (var i = 0; i < data[fatherindex]['cachet'].length; i++) {
        if (!data[fatherindex]['cachet'][i]['checkboxchoose']){//kind下面的checkbox没有选中加上其价格
          sum = sum + data[fatherindex]['cachet'][i]['price'] * data[fatherindex]['cachet'][i]['number']
        }
      }
      allprice = Number((allprice + sum).toFixed(2))
    }
    request({
      url: this.data.WEB + '/api/user/kindchoose',
      method: 'post',
      data: {
        userid: userid,
        cachetKindid: cachetKindid,
        kindchoosed: kindchoosed
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      console.log(11)
      if (res.data.res =="success") {
        wx.showLoading({
          title: '加载中',
          duration: 300
        })
        this.datarequest(allprice)
      }
    }).catch(err => {
      console.log(err)
    })

  },
  //公章checkbox
  cachetchooseChange(e) {
    var fatherindex = e.currentTarget.dataset.fatherindex
    var caindex = e.currentTarget.dataset.caindex
    var data = this.data.shopcarData
    var shopcarid = data[fatherindex]['cachet'][caindex]['shopcarid']
    var checkboxchoose = data[fatherindex]['cachet'][caindex]['checkboxchoose']
    var cachetKindid = data[fatherindex]['cachetKindid']
    var accesstoken = wx.getStorageSync(this.data.Token)
    var userid = wx.getStorageSync(this.data.Userid)
    var allprice=this.data.allprice
    if (checkboxchoose) {//取消选中
      checkboxchoose=false
      //改变总价
      var sum = data[fatherindex]['cachet'][caindex]['price'] * data[fatherindex]['cachet'][caindex]['number']
      allprice = Number((allprice - sum).toFixed(2))
      // toFixed(2)//四舍五入指定小数位 toFixed结果类型为string
    } else {//选中
      checkboxchoose = true
      var sum = data[fatherindex]['cachet'][caindex]['price'] * data[fatherindex]['cachet'][caindex]['number']
      allprice = Number((allprice+sum).toFixed(2))
    }
    request({
      url: this.data.WEB + '/api/user/checkboxchoose',
      method: 'post',
      data: {
        userid: userid,
        cachetKindid: cachetKindid,
        checkboxchoose: checkboxchoose,
        shopcarid: shopcarid
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.res =="success") {
        wx.showLoading({
          title: '加载中',
          duration: 300
        })
        this.datarequest(allprice)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  //滑动改变
  handleMovableChange: function (e) {
    //e.detail x轴方向的偏移
    console.log('滑动改变', e.detail)
    var shopdata = this.data.shopcarData
    var fatherindex = e.currentTarget.dataset.fatherindex//外层数组索引
    var index = e.currentTarget.dataset.index//内层数组索引
    this.data.shopcarData[fatherindex]['cachet'][index]['currentX'] = e.detail.x;//记录手指刚开始触摸的位置
  },
  //滑动结束
  handleTouchend: function (e) {
    var shopdata = this.data.shopcarData
    var fatherindex = e.currentTarget.dataset.fatherindex//外层数组索引
    var index = e.currentTarget.dataset.index//内层数组索引
    // this.isMove = true;
    console.log('移动结束', this.data.shopcarData[fatherindex]['cachet'][index]['currentX'])
    if (this.data.shopcarData[fatherindex]['cachet'][index]['currentX'] < -this.data.delWidth * 0.5) {//向左移动距离大于删除区域宽度
      this.data.shopcarData[fatherindex]['cachet'][index]['x'] = -this.data.delWidth;
      this.setData({
        shopcarData: this.data.shopcarData
      });
    } else {
      this.data.shopcarData[fatherindex]['cachet'][index]['x'] = 0
      this.setData({
        shopcarData: this.data.shopcarData
      });
    }
  },
  handleTouchestart: function (e) {
    console.log('滑动开始', e)
  },
  //数量减少
  minusNum(e) {
    var shopdata = this.data.shopcarData
    var fatherindex = e.currentTarget.dataset.fatherindex//外层数组索引
    var index = e.currentTarget.dataset.caindex//内层数组索引
    var number =1
    var shopcarid = shopdata[fatherindex]['cachet'][index]['shopcarid']
    var accesstoken = wx.getStorageSync(this.data.Token)
    var allprice=this.data.allprice
    request({
      url: this.data.WEB + '/api/user/scChangeNum',
      method: 'post',
      data: {
        way: 'minus',
        shopcarid: shopcarid,
        number: number
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.res == "success") {
        wx.showLoading({
          title: '加载中',
          duration: 300
        })
        if (shopdata[fatherindex]['cachet'][index]['checkboxchoose'])
        {
          var sum = shopdata[fatherindex]['cachet'][index]['price'] * number
          allprice = Number((allprice - sum).toFixed(2))
        }
        this.datarequest(allprice)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  //数量增加
  addNum(e) {
    var shopdata = this.data.shopcarData
    var fatherindex = e.currentTarget.dataset.fatherindex//外层数组索引
    var index = e.currentTarget.dataset.caindex//内层数组索引
    var number = 1
    var shopcarid = shopdata[fatherindex]['cachet'][index]['shopcarid']
    var accesstoken = wx.getStorageSync(this.data.Token)
    var allprice = this.data.allprice
    request({
      url: this.data.WEB + '/api/user/scChangeNum',
      method: 'post',
      data: {
        way: 'add',
        shopcarid: shopcarid,
        number: number
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.res == "success") {
        wx.showLoading({
          title: '加载中',
          duration: 300
        })
        
        if (shopdata[fatherindex]['cachet'][index]['checkboxchoose']) {
          var sum = shopdata[fatherindex]['cachet'][index]['price'] * number
          allprice = Number((allprice+sum).toFixed(2))
        }
        this.datarequest(allprice)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  //单个删除
  delcachet(e) {
    var shopcarid = e.currentTarget.dataset.shopcarid
    var fatherindex = e.currentTarget.dataset.fatherindex
    var caindex = e.currentTarget.dataset.caindex
    var accesstoken = wx.getStorageSync(this.data.Token)
    var allprice=this.data.allprice
    var userid = wx.getStorageSync(this.data.Userid)
    var data=this.data.shopcarData
    request({
      url: this.data.WEB + '/api/user/delshopcar',
      method: 'post',
      data: {
        shopcarid: shopcarid,
        userid:userid,
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.res == "success") {
        wx.showLoading({
          title: '加载中',
          duration: 300
        })
    
        if (data[fatherindex]['cachet'][caindex]['checkboxchoose'] ){
          var sum = data[fatherindex]['cachet'][caindex]['price'] * data[fatherindex]['cachet'][caindex]['number']
          allprice = Number((allprice - sum).toFixed(2))
          
        }
        this.datarequest(allprice)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  //全选
  allchoose() {
    var allprice=this.data.allprice
    var shopcar = this.data.shopcarData
    var userid=wx.getStorageSync(this.data.Userid)
    var accesstoken = wx.getStorageSync(this.data.Token)
    var allchoose=this.data.allchoose
    if (allchoose) {//取消全选
      allchoose = false
      allprice = 0
    } else {//全选
      allchoose = true
      var sum = 0;
      for (var i = 0; i < shopcar.length; i++) {
        for (var j = 0; j < shopcar[i]['cachet'].length; j++) {
          if (!shopcar[i]['cachet'][j]['checkboxchoose']) {
            sum = sum + shopcar[i]['cachet'][j]['price'] * shopcar[i]['cachet'][j]['number']
          }
        }
      }
      allprice = Number((allprice+sum).toFixed(2))
    }
    request({
      url: this.data.WEB + '/api/user/allchoose',
      method: 'post',
      data: {
        buyerid: userid,
        allchoose: allchoose
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      console.log(111222)
      if (res.data.res == "success") {
        wx.showLoading({
          title: '加载中',
          duration: 300
        })
        this.datarequest(allprice)
      //   this.setData({
      //     allchoose:allchoose
      //   })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  //查看选中的公章
  checkChoosed(){
    var data = this.data.shopcarData
    var arr = []
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i]['cachet'].length; j++) {
        if (data[i]['cachet'][j]['checkboxchoose']) {
          arr.push(data[i]['cachet'][j]['shopcarid'])
        }
      }
    }
    return arr
  },
  //全部删除
  alldel(){
    var arr = this.checkChoosed()
    console.log(arr);
    var userid = wx.getStorageSync(this.data.Userid)
    var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/alldelete',
      method:'post',
      data:{
        arr:arr,
        buyerid:userid
      },
      header:{
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res=>{
      if(res.data.res=="success"){
        var allprice=0;
        this.datarequest(allprice)
      }
    }).catch(err=>{
      console.log(err)
    })


  },
  //结算
  countMoney(){
    //设定flage用于确认订单页面的不同数据请求，立即购买与加入购入购物车购买的数据请求划分
    wx.setStorageSync('writeorderReq', 2)
    var arr = this.checkChoosed()
    console.log('加入购物车传递数组格式',typeof(arr))
    console.log('加入购物车传递数组格式', arr)
    var allprice=this.data.allprice
    console.log(arr)
    if(arr.length==0){
      wx.showToast({
        title: '请选择要买到的公章',
      })
    }else{
      wx.navigateTo({
        url: '/pages/user/writeorder/writeorder?arr=' + arr + '&allprice=' + allprice,
      })
    }
 
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  ////数据初始化
  dataMake() {
    var data = this.data.shopcarData
    for (var i = 0; i < data.length; i++) {
      // data[i]['kindchoosed']=false;
      var arr = data[i]['cachet']
      for (var j = 0; j < arr.length; j++) {
        // arr[j]['checkboxchoose']=false
        arr[j]['x'] = 0
        arr[j]['currentX'] = 0
      }
      data[i]['cachet'] = arr
    }
    this.setData({
      shopcarData: data
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function () {
    var sallprice = wx.getStorageSync('sallprice')//用于提交订单后清楚购物车总价
    console.log('sallprice',sallprice)
    if(sallprice!=null&&sallprice==0){
      wx.setStorageSync('sallprice', 1)
      this.setData({
        allprice:0
      })
    }
    if(this.data.count==1){
      this.setData({
        count: this.data.count + 1
      })
      wx.showLoading({
        title: '加载中',
        duration: 1000
      })
      //第一层次加载，将checkbox状态设为false
      this.allchooseReq()
      console.log(111)
      this.datarequest(0)
    }
    else{
    var flage = wx.getStorageSync('allprice')//用于修改添加购物车后allprice=0
      if(flage==1){
        this.setData({
          allprice:0
        })
        wx.setStorageSync('allprice', 0)//用于修改添加购物车后allprice=0
      }
      var allprice=this.data.allprice
    this.datarequest(allprice)
    }
   

  },
  //数据请求
  datarequest(allprice) {
    var userid = wx.getStorageSync(this.data.Userid)
    var accesstoken = wx.getStorageSync(this.data.Token)
    //请求数据
    request({
      url: this.data.WEB + '/api/user/selshopcar',
      method: 'post',
      data: {
        userid: userid
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      console.log('res', res.data)
      //每一次数据更新时更新全选状态
      var allchoose
      if(res.data.length==0){
        allchoose = false
      }else{
        var arr = res.data
        var k = 0;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i]['kindchoosed']) {
            k++
          }
        }
        console.log('kk', k)
        if (k == arr.length) {
          console.log(k)
          allchoose = true
        } else {
          allchoose = false
        }
      }
     
      
      this.setData({
        shopcarData: res.data,
        allchoose:allchoose,
         allprice: allprice
      })
      this.dataMake()//数据初始化
      console.log('初始化', this.data.shopcarData)
    }).catch(err => {
      console.log(err)
    })
  },
  allchooseReq() {
    var userid = wx.getStorageSync(this.data.Userid)
    var accesstoken = wx.getStorageSync(this.data.Token)
    //请求数据
    request({
      url: this.data.WEB + '/api/user/checkboxFlase',
      method: 'post',
      data: {
        userid: userid
      },
      header: {
        'content-type': 'application/json',
        Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      console.log(res.data)
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
    console.log('')
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