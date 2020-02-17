// pages/user/home/home.js
import request from '../../../service/network.js'
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animation: {},
    animation2: {},
    mainmodelshow: false,//模态框
    mainmodelshow2: false,//模态框
    WEB: app.globalData.web,//网站路径
    Token: app.globalData.Token,//存储token的storage名字
    Role: app.globalData.Role,//存储role的storage名字
    Userid: app.globalData.UserID,
    Height: app.globalData.Height,
    Width: app.globalData.Width,
    swiperHeight: parseInt(app.globalData.Height * 0.35),//最上面图片swiper高度
    contInforHeight: parseInt(app.globalData.Height * 0.15),//相关信息view高度
    makecachetHeight: parseInt(app.globalData.Height * 0.3),//制作公章view高度
    cachetModelHeight: parseInt(app.globalData.Height * 0.7),//公章制作弹出框高度
    shopcarHeight: parseInt(app.globalData.Height * 0.1),//购物车底栏高度
    shopcarModelHeight: parseInt(app.globalData.Height * 0.4),//购物车展示底部弹出框高度
    mainmodel2Height: parseInt(app.globalData.Height-150),//模态框高度
    cachetHeight: parseInt(app.globalData.Height * 0.15),//购物车中商品高度
    picHeight: parseInt(app.globalData.Height * 0.12),//购物车中商品图片高度
    //相关信息上部跳转图片大小
    InforPicHeight: parseInt(app.globalData.Height * 0.03),
    //底部shopcarBar zindex的值
    Zindex:2,
    //购物车底部弹出框显示flage
    shopcarFlage:false,
    //顶部swiper图片数据
    swipevrData:  [],
      //公司相关介绍信息
    information:'',
    cachetkindData:[],//公章种类数据
    cachet:[],//公章表数据
  
    currentindex: 0,//数组最外层的指针
    currentPriceindex: 0,//数组内层与cachetPrice同级的指针
    //提交的数据
    kindinput: '',
    sizeinput: '',
    colorinput: '',
    picPathinput: '',
    numinput: 1,
    priceinput: 0,
    cachetinfo:'',//公章刻字内容
    //要提交的cachetid,cachetkindid
    cachetid: -1,
    cachetkindid: -1,
    //按钮字体颜色样式
    beforebgcolor: '#ffffff',
    afterbgcolor: '#38c172',
    beforefocolor: '#000000',
    afterfocolor: '#ffffff',
    //选择弹出框出发的次数,第二次出发后保留点击数据
    // windowShowcount: 1,//?
    //选中公章数量
    allnumber:0,
    //合计
    allprice:0,
    //底部购物栏显示判断flage
    shopcarshow:false,
    shopcarData:[],//购物车数据cachetInfo
    activeNames:'',
    // cachetKindGuide:'公章种类说明，包括这系列公章的用途',//公章种类说明

  },

  //更多信息
  moreinfo(){
    wx.navigateTo({
      url: '/pages/user/companyinfo/companyinfo',
    })
  },
  // 禁止底层页面滚动
  preventscroll() {
    return
  },

//点击选择公章
cachetclick(event){
    var cachetkindid = event.currentTarget.dataset.cachetkindid
    //加载公章选择数据
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/selcadetail',
      method: 'post',
      data: {
        cachetKindid: cachetkindid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if(res.data.status=='success'){
        var result = res.data.data
        console.log('公章数据result', result)
        this.setData({
          cachet: result,
        })
        this.choosetrigger()
        // var currentindex = this.data.currentindex
        // console.log('公章解释', this.data.cachet[currentindex]['cachetExplain'])
        // console.log('公章解释', this.data.cachet.currentindex)
      }else{
        console.log('暂无数据')
      }
 
    }).catch(err => {
      console.log(err)
    })
    
  },
  //公章详细信息
  detailClick(event){
    console.log("详细信息展示",event.detail)
    this.setData({
      activeNames: event.detail
    });
  },
  //数组增加flage判断按钮是否选中
  arrayadd(data, name, value) {
    var arr = Object.values(data)
    for (var j = 0; j < arr.length; j++) {
      arr[j][name] = value
    }
    return arr
  },
  arrayadd2($data, $name, $value, $value2) {
    var arr = Object.values($data)
    for (var j = 0; j < arr.length; j++) {
      if (j == 0) {
        arr[j][$name] = $value2
      } else {
        arr[j][$name] = $value
      }
    }
    return arr
  },
  //动态改变kind
  kindchange(e) {
    console.log('点击了种类按钮')
    var index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      currentindex: index,
      currentPriceindex: 0//改变价格数组的指针
    })
    var result = this.data.cachet
    var bebgcolor = this.data.beforebgcolor
    var afbgcolor = this.data.afterbgcolor
    var befocolor = this.data.beforefocolor
    var affocolor = this.data.afterfocolor
    // console.log('1',result)
    for (var i = 0; i < result.length; i++) {
      if (i == index) {//当前按钮为点击按钮
        if (result[i]['namebgColor'] == bebgcolor && result[i]['namefoColor'] == befocolor) {//未选中状态
          result[i]['namebgColor'] = afbgcolor
          result[i]['namefoColor'] = affocolor
          //获取点击的数据
          this.setData({
            picPathinput: result[index]['cachetPicPath'][0],
            kindinput: result[index]['cachettagname'],
            cachetid: result[index]['cachetid'],
            cachetkindid: result[index]['cachetKindid'],
            priceinput: result[index]['cachetPrice'][this.data.currentPriceindex].price,
            sizeinput: '',
            colorinput: '',
          })
       
          console.log('点击了', this.data.kindinput)
          console.log('点击了', this.data.cachetid)
        } else {
          result[i]['namebgColor'] = bebgcolor
          result[i]['namefoColor'] = befocolor
          //获取点击的数据
          this.setData({
            picPathinput: '',
            kindinput: '',
            cachetid: -1,
            cachetkindid: -1
          })
          console.log('取消点击了', this.data.kindinput)
          console.log('取消点击了', this.data.cachetid)
        }
      } else {
        // console.log(111)
        result[i]['namebgColor'] = bebgcolor
        result[i]['namefoColor'] = befocolor
      }
    }
    // console.log('2',result)
    this.setData({
      cachet: result
    })
    // if (result.length >= 2) {//只有一个种类不用恢复数据
      this.btnstateback()
    // }

  },
  //动态改变价格
  sizechange(e) {
    // console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    this.setData({
      currentPriceindex: index,
    })
    var result = this.data.cachet
    var bebgcolor = this.data.beforebgcolor
    var afbgcolor = this.data.afterbgcolor
    var befocolor = this.data.beforefocolor
    var affocolor = this.data.afterfocolor
    // console.log(this.data.currentindex)
    var arr = result[this.data.currentindex]['cachetSize']
    for (var j = 0; j < arr.length; j++) {
      if (j == index) {//当前按钮为点击按钮
        if (arr[j]['sizebgColor'] == bebgcolor && arr[j]['sizefoColor'] == befocolor) {//未选中状态
          arr[j]['sizebgColor'] = afbgcolor
          arr[j]['sizefoColor'] = affocolor
          //获取点击的数据
          this.setData({
            sizeinput: result[this.data.currentindex]['cachetSize'][index].size,
            priceinput: result[this.data.currentindex]['cachetPrice'][index].price,
            // colorinput: '',
          })
          console.log('点击了', this.data.sizeinput)
        } else {
          arr[j]['sizebgColor'] = bebgcolor
          arr[j]['sizefoColor'] = befocolor
          //获取点击的数据
          this.setData({
            sizeinput: ''
          })
          console.log('取消点击了', this.data.sizeinput)
        }
      }
      else {
        // console.log(111)
        arr[j]['sizebgColor'] = bebgcolor
        arr[j]['sizefoColor'] = befocolor
      }

    }
    result[this.data.currentindex]['cachetSize'] = arr;
    // console.log(result)
    this.setData({
      cachet: result
    })
  },
  //颜色按钮变化
  colorchange(e) {
    // console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var result = this.data.cachet

    var bebgcolor = this.data.beforebgcolor
    var afbgcolor = this.data.afterbgcolor
    var befocolor = this.data.beforefocolor
    var affocolor = this.data.afterfocolor
    var arr = result[this.data.currentindex]['cachetColor']
    for (var j = 0; j < arr.length; j++) {
      if (j == index) {//当前按钮为点击按钮
        if (arr[j]['colorbgColor'] == bebgcolor && arr[j]['colorfoColor'] == befocolor) {//未选中状态
          arr[j]['colorbgColor'] = afbgcolor
          arr[j]['colorfoColor'] = affocolor
          //获取点击的数据
          this.setData({
            colorinput: result[this.data.currentindex]['cachetColor'][index].color
          })
          console.log('点击了', this.data.colorinput)
        } else {
          arr[j]['colorbgColor'] = bebgcolor
          arr[j]['colorfoColor'] = befocolor
          //获取点击的数据
          this.setData({
            colorinput: ''
          })
          console.log('取消点击了', this.data.colorinput)
        }
      } else {
        console.log(111)
        arr[j]['colorbgColor'] = bebgcolor
        arr[j]['colorfoColor'] = befocolor
      }
    }
    result[this.data.currentindex]['cachetColor'] = arr;
    // console.log(result)
    this.setData({
      cachet: result
    })
  },
  //数量减少
  nummuni() {
    if (this.data.numinput != 0) {
      this.setData({
        numinput: this.data.numinput - 1
      })
    }
  },
  //数量增加
  numadd() {
    this.setData({
      numinput: this.data.numinput + 1
    })
  },
  //按钮状态恢复
  btnstateback() {
    var result = this.data.cachet
    var bebgcolor = this.data.beforebgcolor
    var afbgcolor = this.data.afterbgcolor
    var befocolor = this.data.beforefocolor
    var affocolor = this.data.afterfocolor
    for (var i = 0; i < result.length; i++) {
      result[i]['cachetSize'] = this.arrayadd(result[i]['cachetSize'],
        'sizebgColor', bebgcolor, afbgcolor);
      result[i]['cachetSize'] = this.arrayadd(result[i]['cachetSize'],
        'sizefoColor', befocolor, affocolor);
      result[i]['cachetColor'] = this.arrayadd(result[i]['cachetColor'],
        'colorbgColor', bebgcolor);
      result[i]['cachetColor'] = this.arrayadd(result[i]['cachetColor'],
        'colorfoColor', befocolor);
    }
    this.setData({
      cachet: result,

    })
  },
  //按钮状态初始化
  btnstatefirst() {
    var that =this
    var result = that.data.cachet
    var bebgcolor = this.data.beforebgcolor
    var afbgcolor = this.data.afterbgcolor
    var befocolor = this.data.beforefocolor
    var affocolor = this.data.afterfocolor
    for (var i = 0; i < result.length; i++) {
      result[i]['cachetSize'] = this.arrayadd(result[i]['cachetSize'],
        'sizebgColor', bebgcolor, afbgcolor);
      result[i]['cachetSize'] = this.arrayadd(result[i]['cachetSize'],
        'sizefoColor', befocolor, affocolor);
      result[i]['cachetColor'] = this.arrayadd(result[i]['cachetColor'],
        'colorbgColor', bebgcolor);
      result[i]['cachetColor'] = this.arrayadd(result[i]['cachetColor'],
        'colorfoColor', befocolor);
      result[i]['namebgColor'] = bebgcolor
      result[i]['namefoColor'] = befocolor
 
    }
    this.setData({
      cachet: result,
      numinput: 1
    })
    console.log('数据初始化', this.data.cachet)
    console.log('数据初始化',result)
  },
  cachetContent(event) {
    console.log('正在输入',event.detail)
    this.setData({
      cachetinfo:event.detail
    })
},
  //选择公章底部弹窗页面触发
  choosetrigger: function () {
    // //设置底部shopcarBar zindex的值--
    // this.setData({//设置定时器使得底部弹出框关闭的时候从shopcarBar上方消失
    //   Zindex: 0
    // })
    var animationtest = wx.createAnimation({
      duration: 100,
      timingFunction: "liner", 
    })
    // 第2步：这个动画实例赋给当前的动画实例 
    this.animationtest = animationtest;
    // 第3步：执行第一组动画 
    animationtest.opacity(0).scale(0.7,0.7).step();
    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animation: animationtest.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animationtest.opacity(1).scale(1,1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animation: animationtest
      })
    }.bind(this), 200)//settime中this无法使用所以用bind(this)
    // 显示 
      this.setData({
        mainmodelshow: true
      });
      this.btnstatefirst()//按钮状态初始化
  },
  //选择公章底部弹窗页面关闭
  chooseclose: function () {
    // this.setData({
    //   Zindex:2
    // })
    var animationtest = wx.createAnimation({
      duration: 100,
      timingFunction: "ease", //线性 
    })
    this.animationtest = animationtest;

    // animationtest.opacity(1).scale(1, 1).step();
    // this.setData({
    //   animation: animationtest.export()
    // })
    // setTimeout(function () {
      // 执行第二组动画 
      animationtest.opacity(0).scale(0.7, 0.7).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animation: animationtest
      })
    // }.bind(this), 300)

    // 隐藏

    this.setData({
      mainmodelshow: false,
      currentindex: 0,//数组最外层的指针
      currentPriceindex: 0,//数组内层与cachetPrice同级的指针
      kindinput: '',
      sizeinput: '',
      colorinput: '',
      picPathinput: '',
      numinput: 1,
      priceinput: 0,
    });

    

  },
  //购买 加入购物车条件判断
  judge() {
    var kinddata = this.data.kindinput
    var sizedata = this.data.sizeinput
    var colordata = this.data.colorinput
    var numdata = this.data.numinput
    var cachetinfo = this.data.cachetinfo
    console.log("刻字内容", cachetinfo)
    if (kinddata == '') {
      console.log('sss')
      wx.showToast({
        title: '请选择产品',
        duration: 1000,
        mask: true,
      })
      return false
    }
    else if (sizedata == '') {
      wx.showToast({
        title: '请选择尺寸',
        duration: 1000,
        mask: true,
      })
      return false
    }
    else if (cachetinfo == '') {
      wx.showToast({
        title: '请填写刻字内容',
        duration: 1000,
        mask: true,
      })
      return false
    }
    else if (colordata == '') {
      wx.showToast({
        title: '请选择颜色',
        duration: 1000,
        mask: true,
      })
      return false
    }
    else if (numdata == 0) {
      wx: wx.showToast({
        title: '请选择数量',
        duration: 1000,
        mask: true,
      })
      return false
    } else {
      return true
    }
  },
  //加入购物车
  affirm() {
    var judge = this.judge()
    if (judge) {
      // console.log('判断成功')
      var userid = wx.getStorageSync(this.data.Userid)
      // var accesstoken = wx.getStorageSync(this.data.Token)
      // console.log('ass', this.data.WEB + '/api/user/addshopcar')
      var cachetid = this.data.cachetid
      var cachetname = this.data.kindinput
      var cachetsize = this.data.sizeinput
      var cachetcolor = this.data.colorinput
      var number = this.data.numinput
      var cachetkindid = this.data.cachetkindid
      var price = this.data.priceinput
      var picpath = this.data.picPathinput
      var cachetinfo = this.data.cachetinfo
      console.log('userid', userid)
      console.log('cachetname', cachetname)
      console.log('WEB', this.data.WEB)
      request({
        url: this.data.WEB + '/api/user/addshopcar',
        method: 'post',
        data: {
          buyerid: userid,
          cachetid: cachetid,
          cachetname: cachetname,
          cachetsize: cachetsize,
          cachetcolor: cachetcolor,
          number: number, 
          cachetinfo: cachetinfo,
          cachetkindid: cachetkindid,
          price: price,
          picpath: picpath
        },
        header: {
          'content-type': 'application/json'
          // Authorization: "Bearer " + accesstoken
        }
      }).then(res => {
        console.log("加入购物车",res)
        if (res.data.status == 'success') {
          console.log('seccuess')
          // this.onShow()
          this.getShopcarData()
          //清空提交的数据
          this.setData({
            kindinput: '',
            sizeinput: '',
            colorinput: '',
            picPathinput: '',
            numinput: 1,
            priceinput: 0,
            // shopcarFlage:true,
          })
     
          this.chooseclose()
          wx.showToast({
            title: '选择成功',
            icon: 'success',
            duration: 1000
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }

  },
  //购物车底部弹出框触发
  shopcartrigger(){
    console.log('购物车点击')
    var flage = this.data.shopcarFlage
    console.log('购物车底部栏',flage)
    if (!flage) {//底部弹出框未触发
    flage=true
      //设置底部shopcarBar zindex的值
      this.setData({
        Zindex: 2,
        shopcarFlage:flage
      })
      var animationtest = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out',
      })
      animationtest.translateY(-this.data.shopcarModelHeight - 60).step()
      this.setData({
        animation2: animationtest.export(),
        mainmodelshow2: true
      })
    }else{
      flage = false
      this.setData({
        shopcarFlage: flage
      })
      this.shopcarclose()
    }
   
  },
  //购物车底部弹出框关闭
  shopcarclose(){
    // setTimeout(function () {
    // }, 100);
    var animationtest = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out',
    })
    animationtest.translateY(0).step()
    this.setData({
      animation2: animationtest.export(),
      mainmodelshow2: false
    })
    
  },
  //
  //购物车数量减少
  minusNum(e) {
   
    var shopdata = this.data.shopcarData
    var index = e.currentTarget.dataset.index
    var number = 1
    var shopcarid = shopdata[index]['shopcarid']
    // var accesstoken = wx.getStorageSync(this.data.Token)
    var allprice = this.data.allprice
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
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.res == "success") {
        this.getShopcarData()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  //购物车数量增加
  addNum(e) {
    var shopdata = this.data.shopcarData
    var index = e.currentTarget.dataset.index
    var number = 1
    var shopcarid = shopdata[index]['shopcarid']
    // var accesstoken = wx.getStorageSync(this.data.Token)
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
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if (res.data.res == "success") {
        // wx.showLoading({
        //   title: '加载中',
        //   duration: 300
        // })

        this.getShopcarData()
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
  //下单
orderbuy(){
  if (this.data.allnumber== 0) {
      wx.showToast({
        title: '请选择要买到的公章',
      })
    } else {
      wx.navigateTo({
        url: '/pages/user/writeorder/writeorder' ,
      })
    }
},
//清空购物车
delAll(){
  var userid = wx.getStorageSync(this.data.Userid)
  // var accesstoken = wx.getStorageSync(this.data.Token)
  request({
    url: this.data.WEB + '/api/user/alldelete2',
    method: 'post',
    data: {
      buyerid: userid
    },
    header: {
      'content-type': 'application/json',
      // Authorization: "Bearer " + accesstoken
    }
  }).then(res => {
    if (res.data.res == "success") {
      this.getShopcarData()
    }
  }).catch(err => {
    console.log(err)
  })
},
  //数据初始化
dataset(){
  var shopcarData=this.data.shopcarData
  var sum=0,allprice=0
  for (var i = 0; i < shopcarData.length;i++){
    sum = sum + shopcarData[i]['number']
    var money = shopcarData[i]['number'] * shopcarData[i]['price']
    allprice =Number((allprice + money).toFixed(2))
  } 
  if(sum==0){//购物车没有数据
    this.setData({
      shopcarshow:false,
      shopcarFlage:false
    })
    //购物车没有东西--关闭底部弹窗
    var animationtest = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out',
    })
    animationtest.translateY(0).step()
    this.setData({
      animation2: animationtest.export(),
      mainmodelshow2: false
    })
  }else{
    this.setData({
      shopcarshow: true,
      // shopcarFlage: true
    })
    this.setData({
      allprice: allprice,
      allnumber:sum
    })
  }
},
  //请求购物车数据
  getShopcarData(){

    var userid = wx.getStorageSync(this.data.Userid)
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/selshopcar2',
      method: 'post',
      data: {
        userid: userid
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {

       console.log('购物车数据',res.data)
      //每一次数据更新时更新全选状态
      this.setData({
        shopcarData: res.data,
      })
      this.dataset()
      console.log(this.data.shopcarFlage)
      // this.dataMake()//数据初始化
      // console.log('初始化', this.data.shopcarData)
    }).catch(err => {
      console.log(err)
    })
  },
  //公司相关信息请求
  companydata(){
    var userid = wx.getStorageSync(this.data.Userid)
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/selmakerInfo',
      method: 'post',

      header: {
        'content-type': 'application/json',
      }
    }).then(res => {
      console.log('asdasd',res.data.data[0])
      if(res.data.status=='success'){
        var companyinfo = res.data.data[0]['companyinfo']
        if (companyinfo.length > 50) {
          companyinfo=companyinfo.substring(0, 50) + '...'
        } 
        this.setData({
          information:companyinfo,
          swipevrData: res.data.data[0]['proveinfo']
        })
      }
  
    }).catch(err => {
      console.log(err)
    })
  },
  //请求公章种类数据
  updatedata: function () {
    var userid=wx.getStorageSync(this.data.Userid)
    console.log('user',userid)
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/maker/selcakind',
      method: 'post',
      // data:{
      //   userid: userid
      // },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      if(res.data.status=='success'){
        // console.log('公章种类数据', res.data)
        this.setData({
          cachetkindData: res.data.data,
        })
      }
      else{
        //数据出错页面
        
      }

    }).catch(err => {
      console.log(err)
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
  onShow: function () {
    //公司相关信息请求
    this.companydata()
    //请求公章种类数据
    this.updatedata()
    // //添加购物车成功，请求购物车数据
    this.getShopcarData()
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
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})