// pages/user/cachetdetail/cachetdetail.js
var app=getApp()
import request from '../../../service/network.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animation:{},
    animation2:{},
    mainmodelshow:false,//模态框
    mainmodelshow2: false,//模态框2
    WEB: app.globalData.web,
    Token: app.globalData.Token,
    Role: app.globalData.Role,
    Userid: app.globalData.UserID,
    Height: app.globalData.Height,
    Width:app.globalData.Width,
    chooHeight: parseInt(app.globalData.Height*0.6),//选择弹出框
    paraHeight: parseInt(app.globalData.Height*0.6),//参数弹出框
    cachet:[],//公章表数据
    //最高最低价格
    mimiprice:0,
    maxprice:0,
    currentindex:0,//数组最外层的指针
    currentPriceindex: 0,//数组内层与cachetPrice同级的指针
    swiperUrl:[],
    //提交的数据
    kindinput:'',
    sizeinput:'',
    colorinput:'',
    picPathinput:'',
    numinput:1,
    priceinput:0,
    //要提交的cachetid,cachetkindid
    cachetid: -1,
    cachetkindid: -1,
    //按钮字体颜色样式
    beforebgcolor:'#dedede',
    afterbgcolor:'rgba(255, 51, 0, 0.87)',
    beforefocolor:'#000000',
    afterfocolor:'#ffffff',
    //选择弹出框出发的次数,第二次出发后保留点击数据
     windowShowcount:1,
   
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    // console.log(options)
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/user/selcadetail',
      method: 'post',
      data: {
        cachetKindid: options.param
      },
      header: {
        'content-type': 'application/json',
        // Authorization: "Bearer " + accesstoken
      }
    }).then(res => {
      var result = res.data
      console.log('result',result)
      //查找价格的最大值与最小值
      var price=[]
      for(var i=0;i<result.length;i++){
        // console.log(result[i])
        var arr = result[i]['cachetPrice']
        //初始化提交的价格
        this.setData({
          priceinput: arr[0]['price']
        })
        for (var j = 0; j < arr.length;j++){
          price = price.concat(parseInt(arr[j]['price']))
     
        }
      }
      var arr = this.numsort(price)
      this.setData({
        cachet: result, 
        mimiprice: arr[0],
        maxprice: arr[arr.length-1],
      })
      // console.log('result',result);
      // console.log('111',result)
      var datares=this.data.cachet
      console.log(this.data.cachet)
      var imgurl=[]//获取轮播图的图片数据
      for(var i=0;i<datares.length;i++){
        imgurl=imgurl.concat(datares[i].cachetPicPath)
      }
      this.setData({
        swiperUrl:imgurl
      })
    }).catch(err => {
      console.log(err)
    })
  },
 //排序
 numsort(arr){
   var min,temp;
   for(var i=0;i<arr.length-1;i++){
     min=i
     for(var j=i+1;j<arr.length;j++){
       if(arr[j]<arr[min]){
          min=j;
       }
     }
     temp=arr[i]
     arr[i]=arr[min]
     arr[min]=temp
   }
   return arr
 },

  //数组增加flage判断按钮是否选中
  arrayadd($data,$name,$value){
    var arr = Object.values($data)
    for (var j = 0; j < arr.length; j++) {
      // if (j == 0) {
      //   arr[j][$name] = $value2
      // } else {
        arr[j][$name] = $value
      // }
    }
    return arr
  },
  arrayadd2($data, $name, $value,$value2) {
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
  kindchange(e){
    // console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    this.setData({
      currentindex:index,
      currentPriceindex: 0//改变价格数组的指针
    })
    var result=this.data.cachet
    var bebgcolor=this.data.beforebgcolor
    var afbgcolor=this.data.afterbgcolor
    var befocolor=this.data.beforefocolor
    var affocolor=this.data.afterfocolor
    // console.log('1',result)
    for(var i=0;i<result.length;i++){
      if(i==index){//当前按钮为点击按钮
        if (result[i]['namebgColor'] == bebgcolor && result[i]['namefoColor'] == befocolor) {//未选中状态
          result[i]['namebgColor'] = afbgcolor
          result[i]['namefoColor'] = affocolor
          //获取点击的数据
          this.setData({
            picPathinput: result[index]['cachetPicPath'][0]['src'],
            kindinput: result[index]['cachettagname'],
            cachetid: result[index]['cachetid'],
            cachetkindid: result[index]['cachetKindid'],
            priceinput: result[index]['cachetPrice'][this.data.currentPriceindex].price,
          })
          // console.log('点击了', this.data.kindinput)
          // console.log('点击了', this.data.cachetid)
        } else{
          result[i]['namebgColor'] = bebgcolor
          result[i]['namefoColor'] = befocolor
          //获取点击的数据
          this.setData({
            picPathinput:'',
            kindinput: '',
            cachetid:-1,
            cachetkindid:-1
          })
          // console.log('取消点击了', this.data.kindinput)
          // console.log('取消点击了', this.data.cachetid)
        }
      }else{
        // console.log(111)
        result[i]['namebgColor'] = bebgcolor
        result[i]['namefoColor'] = befocolor
      }
    }
    // console.log('2',result)
    this.setData({
      cachet:result
    })
    if (result.length>=2){//只有一个种类不用恢复数据
      this.btnstateback()
    }
   
  },
  //动态改变价格
  sizechange(e){
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
      for(var j=0;j<arr.length;j++){
          if(j==index){//当前按钮为点击按钮
            if (arr[j]['sizebgColor'] == bebgcolor && arr[j]['sizefoColor'] == befocolor) {//未选中状态
                arr[j]['sizebgColor'] = afbgcolor
                arr[j]['sizefoColor'] = affocolor
              //获取点击的数据
              this.setData({
                sizeinput: result[this.data.currentindex]['cachetSize'][index].size,
                priceinput: result[this.data.currentindex]['cachetPrice'][index].price,
              })
              console.log('点击了', this.data.sizeinput)
            } else{
                  arr[j]['sizebgColor'] = bebgcolor
                  arr[j]['sizefoColor'] = befocolor
                  //获取点击的数据
                  this.setData({
                    sizeinput:''
                  })
                  console.log('取消点击了', this.data.sizeinput)
            }
          }
          else{
            // console.log(111)
                arr[j]['sizebgColor'] = bebgcolor
                arr[j]['sizefoColor'] = befocolor
          }
       
          }
    result[this.data.currentindex]['cachetSize'] = arr;
    // console.log(result)
    this.setData({
      cachet:result
    })
  },
  //颜色按钮变化
  colorchange(e){
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
          }else{
            arr[j]['colorbgColor'] = bebgcolor
            arr[j]['colorfoColor'] = befocolor
            //获取点击的数据
            this.setData({
              colorinput:''
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
  nummuni(){
      if (this.data.numinput!=0){
        this.setData({
          numinput: this.data.numinput - 1
        })
      }
  },
  //数量增加
  numadd(){
      this.setData({
        numinput: this.data.numinput+1
      })
  },
  //按钮状态恢复
  btnstateback(){
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
   btnstatefirst(){
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
      //  if (i == 0) {
      //    result[i]['namebgColor'] = afbgcolor
      //    result[i]['namefoColor'] = affocolor
      //  } else {
         result[i]['namebgColor'] = bebgcolor
         result[i]['namefoColor'] = befocolor
      //  }
     }
     this.setData({
       cachet: result,
       numinput: 1
     })
   },

  // 禁止底层页面滚动
  preventscroll() {
    return
  },
  //选择公章底部弹窗页面触发
  choosetrigger: function () {
    var animationtest = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out',
    })
    animationtest.translateY(-this.data.chooHeight).step()
    this.setData({
      animation: animationtest.export(),
      mainmodelshow:true
    })
    //
   //按钮状态初始化
    if (this.data.windowShowcount==1){
      this.btnstatefirst()
      this.setData({
        windowShowcount: this.data.windowShowcount+1
      })
    }
    
    // console.log('change', this.data.cachet)
  },
  //选择公章底部弹窗页面关闭
  chooseclose:function(){
    var animationtest = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out',
    })
    animationtest.translateY(0).step()
    this.setData({
      animation: animationtest.export(),
      mainmodelshow:false
    })
    
  },
  //参数详情底部弹窗触发
  proparamtrigger: function () {
    var animationtest = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out',
    })

    animationtest.translateY(-this.data.paraHeight).step()
    this.setData({
      animation2: animationtest.export(),
      mainmodelshow2: true
    })
  },
  //参数详情底部弹窗关闭
  proparamclose: function () {
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
//购买 加入购物车条件判断
   judge(){
     var kinddata = this.data.kindinput
     var sizedata = this.data.sizeinput
     var colordata = this.data.colorinput
     var numdata = this.data.numinput
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
     }else{
       return true
     }
   },

  //加入购物车
  addToCar(){
    var judge=this.judge()
    if(judge){
      // console.log('判断成功')
      var userid=wx.getStorageSync(this.data.Userid)
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
      console.log(picpath)
     
      request({
        url: this.data.WEB +'/api/user/addshopcar',
        method:'post',
        data:{
          buyerid:userid,
          cachetid: cachetid,
          cachetname: cachetname,
          cachetsize: cachetsize,
          cachetcolor: cachetcolor,
          number: number,
          cachetkindid: cachetkindid,
          price: price,
          picpath: picpath
        },
        header:{
          'content-type':'application/json',
          // Authorization:"Bearer "+accesstoken
        }
      }).then(res=>{
        console.log(res.data)
        if(res.data.res=='success'){
          console.log('seccuess')
          //弹窗次数归零
          this.setData({
            windowShowcount:1
          })
          wx.setStorageSync('allprice',1)//用于修改添加购物车后allprice=0
          wx.showToast({
            title: '添加购物车成功',
             duration: 1000,
             mask: true,
          })
          //清空提交的数据
          this.setData({
            kindinput: '',
            sizeinput: '',
            colorinput: '',
            picPathinput: '',
            numinput: 1,
            priceinput: 0,
          })
          this.chooseclose()
        }
      }).catch(err=>{
        console.log(err)
      })
    }
    
  },
  //立刻购买
  buyNow(){
    var judge = this.judge()
    if(judge){
      // var userid = wx.getStorageSync(this.data.Userid)
      // var accesstoken = wx.getStorageSync(this.data.Token)
      //声明对象
      var arr=
      {
        "cachetid": this.data.cachetid,
        "cachetname":this.data.kindinput,
        "sizeinput": this.data.sizeinput,
        "colorinput": this.data.colorinput,
        "numinput": this.data.numinput,
        "priceinput": this.data.priceinput,
        "picPathinput": this.data.picPathinput,
      }
      console.log('arr之前',arr)
      arr=JSON.stringify(arr)
      console.log('arraaa',typeof(arr))
      console.log(arr)
      //设定flage用于确认订单页面的不同数据请求
      wx.setStorageSync('writeorderReq',1)
      //弹窗次数归零
      this.setData({
        windowShowcount: 1
      })
      this.setData({
        kindinput: '',
        sizeinput: '',
        colorinput: '',
        picPathinput: '',
        numinput: 1,
        priceinput: 0,
      })
      this.chooseclose()
      //跳转确认订单页面
      wx.navigateTo({
        url: '/pages/user/writeorder/writeorder?arr='+arr,
      })
     
    }
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