// pages/makerIndex/makerIndex.js
import request from '../../../service/network.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animation: {},
    mainmodelshow: false,//模态框
    WEB: app.globalData.web,//网站路径
    Token: app.globalData.Token,//存储token的storage名字
    Role: app.globalData.Role,//存储role的storage名字
    Userid: app.globalData.UserID,
    Height: app.globalData.Height,
    Width: app.globalData.Width,
    headHeight: parseInt(app.globalData.Height * 0.35),//最上面图片swiper高度
    contInforHeight: parseInt(app.globalData.Height * 0.25),//消息view高度
    InforSwiperHeight: parseInt(app.globalData.Height * 0.12),//消息swiper高度
    makeHeight: parseInt(app.globalData.Height * 0.3),//制作公章view高度
    Height2: parseInt(app.globalData.Height * 1.1),//main 高度
    //tabbar选中项
    active:0,
    //用于tab切换显单页面显示不同
    tabshow:[true,false],
    //右上角数字提醒
    waitSend: '',
    waitGet: '',
    waitComment: '',
    message:'',
    ModelHeight: parseInt(app.globalData.Height * 0.35),//弹出框高度
    expressFlage:true,//用于判断是否设置快递费用，默认没有设置
    exPrice:0,//快递费用
  },
  //点击快递费用
  expressinput(event){
    console.log("快递费用点击", event.detail)
    this.setData({
      exPrice: event.detail
    })
  },
  
 //尚未设置快递费用 数据查询
  expressPrice(){
    var userid = wx.getStorageSync(this.data.Userid)
    request({
      url: this.data.WEB + '/api/maker/expressSel',
      method: 'post',
      data: {
        userid: userid
      },
      header: {
        'content-type': 'application/json',
        // Authorization:'Bearer '+accesstoken,
      }
    }).then(res=>{
      console.log(res.data)
      var exPrice = res.data.data[0].expressprice
      console.log("exprice",exPrice)
      if(exPrice!=""){
        this.setData({
          expressFlage:false,
          exPrice: exPrice
        })
      }else{
        this.setData({
          expressFlage: true
        })
      }
    }).catch(err=>{
      console.log(err)
    })
    this.modeltrigger()
  },
  //快递费用提交
  exaffirm(){
    var userid = wx.getStorageSync(this.data.Userid)
    var expressFlage = this.data.expressFlage
    console.log("expressFlage", expressFlage)
    if(expressFlage){
      request({
        url: this.data.WEB + '/api/maker/expressAdd',
        method: 'post',
        data: {
          userid: userid,
          expressprice:this.data.exPrice
        },
        header: {
          'content-type': 'application/json',
          // Authorization:'Bearer '+accesstoken,
        }
      }).then(res => {
        console.log(res.data)
        if(res.data.status="success"){
          wx.showToast({
            title: '添加成功',
            duration:1000
          })
          this.expressPrice()
          this.modelclose()
        }
      }).catch(err => {
        console.log(err)
      })

    }else{
      var userid = wx.getStorageSync(this.data.Userid)
      request({
        url: this.data.WEB + '/api/maker/expressUpdate',
        method: 'post',
        data: {
          userid: userid,
          expressprice: this.data.exPrice
        },
        header: {
          'content-type': 'application/json',
          // Authorization:'Bearer '+accesstoken,
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.status = "success") {
          wx.showToast({
            title: '修改成功',
            duration: 1000
          })
          this.expressPrice()
          this.modelclose()
        }
      }).catch(err => {
        console.log(err)
      })
      this.modeltrigger()
    }
  },
  //弹出框触发
  modeltrigger: function () {
    var animationtest = wx.createAnimation({
      duration: 100,
      timingFunction: "liner",
    })
    // 第2步：这个动画实例赋给当前的动画实例 
    this.animationtest = animationtest;
    // 第3步：执行第一组动画 
    animationtest.opacity(0).scale(0.7, 0.7).step();
    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animation: animationtest.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animationtest.opacity(1).scale(1, 1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animation: animationtest
      })
    }.bind(this), 200)//settime中this无法使用所以用bind(this)
    // 显示 
    this.setData({
      mainmodelshow: true
    });
  },
  //选择公章底部弹窗页面关闭
  modelclose: function () {
    var animationtest = wx.createAnimation({
      duration: 100,
      timingFunction: "ease", //线性 
    })
    this.animationtest = animationtest;
    // 执行第二组动画 
    animationtest.opacity(0).scale(0.7, 0.7).step();
    // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
    this.setData({
      animation: animationtest
    })

    this.setData({
      mainmodelshow: false,
    });
  },
  // 禁止底层页面滚动
  preventscroll() {
    return
  },
  //订单类型条数信息请求
  orderListDataReq(){
    // var accesstoken=wx.getStorageSync(this.data.Token)
    var userid=wx.getStorageSync(this.data.Userid)
    request({
      url:this.data.WEB+'/api/maker/orderLenSel',
      method:'post',
      data:{
        userid:userid
      },
      header:{
        'content-type':'application/json',
        // Authorization:'Bearer '+accesstoken,
      }
    }).then(res=>{
      console.log('订单消息条数')
      if(res.data.status="success"){
        this.setData({
          waitSend:res.data.data[0],
          waitGet: res.data.data[1],
          waitComment: res.data.data[2],
          // message: res.data.data[3]
        })
      }
      else{
        this.setData({
          waitPay: '',
          waitSend: '',
          waitGet: '',
          waitComment: '',
        })
      }
    }).catch(err=>{
      console.log(err)
    })

  },
  //消息条数请求
  inforListReq(){
    // var accesstoken = wx.getStorageSync(this.data.Token)
    var userid = wx.getStorageSync(this.data.Userid)
    request({
      url: this.data.WEB + '/api/maker/selinfolen',
      method: 'post',
      data:{
        userid:userid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: 'Bearer ' + accesstoken,
      }
    }).then(res => {
      console.log(res.data.data)
      if (res.data.status = "success") {
        this.setData({
          message: res.data.data
        })
      }
      else {
        this.setData({
          waitPay: '',
          waitSend: '',
          waitGet: '',
          waitComment: '',
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },

  //查看公章详情
  cachetdetailClick(){
    wx.navigateTo({
      url: '/pages/maker/cachetmake/cachetmake',
    })
  },
  //切换首页与我的
  onChange(event) {
    console.log(event.detail);
    for(var i=0;i<this.data.tabshow.length;i++){
      if (i == event.detail){
        this.data.tabshow[i]=true;
      }else{
        this.data.tabshow[i] = false;
      }
    } this.setData({
      active: event.detail,
      tabshow: this.data.tabshow
    })

  },

  //处理订单
  doneOrder(){
    wx.navigateTo({
      url: '/pages/maker/makerorder/makerorder?index=2',
    })
  },
  seeAllorder() {
    wx.navigateTo({
      url: '/pages/maker/makerorder/makerorder?index=0',
    })
  },
  //公司信息
  companyInfo(){
    wx.navigateTo({
      url: '/pages/maker/companyinfoshow/companyinfoshow',
    })
  },
  //退出登录
  dropLogin() {
    //清除缓存
    wx.clearStorage()
    wx.reLaunch({
      url: '/pages/navigate/navigate',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // this.
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
    //设置storage 防止页面刷新  纪录上一次点击的cachetkind数据
    wx.setStorageSync('cachetkindid', '')
    console.log("刷新")
    this.orderListDataReq()
    this.inforListReq()
    // console.log("刷新")
    // this.orderListDataReq()
    // this.inforListReq()
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