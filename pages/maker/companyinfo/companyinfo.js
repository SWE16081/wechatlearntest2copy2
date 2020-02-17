// pages/maker/companyinfo/companyinfo.js
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
    //提交的数据
    companyinfo: '',
    proveinfo: '',
    previewPicList: [],//预览图片数据
    piccount: 6,//设置图片上传数量
    cachetprivewHeight: 300,//公章上传预览图片高度
   viewshow:['true','false']
  },
  //填写公司信息
  infoinput(event){
    console.log("填写信息", event.detail.value)
    this.setData({
      companyinfo:event.detail.value
    })
  },
  //添加证明材料
  addprovepic(){
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
  delPrivewPic(event) {
    var index = event.currentTarget.dataset.index
    var arr = this.data.previewPicList
    arr.splice(index, 1)
    this.setData({
      previewPicList: arr
    })
  },
  //提交判断
  judge(){
    var companyinfo = this.data.companyinfo
    var previewPicList = this.data.previewPicList
    if (companyinfo == '') {
      wx.showToast({
        title: '请填写公司信息',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (previewPicList.length==0){
      wx.showToast({
        title: '请上传证明材料',
        icon: 'none',
        duration: 1000
      })
      return false
    }else{
      return true
    }
  },
  //确认提交
  affirm(){
    var flage=this.judge
    if(flage){
      // this.datasetBe()
      var userid = wx.getStorageSync(this.data.Userid)
      // var accesstoken = wx.getStorageSync(this.data.Token)
      var len = this.data.previewPicList.length
      console.log('len', len)
      var formData = {
        userid: userid,
        companyinfo: this.data.companyinfo,
      }
      wx.showLoading({
        title: '请等待',
        success:(res)=>{
          var sum = 0
          for (var i = 0; i < len; i++) {
            wx.uploadFile({
              url: this.data.WEB + '/api/maker/addMakerInfo', 
              filePath: this.data.previewPicList[i],
              name: 'file',
              method: 'post',
              header: {
                "Content-Type": "multipart/form-data",
                'accept': 'application/json',
                // 'Authorization': 'Bearer ' + accesstoken 
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
                      title: '添加成功',
                      duration: 500
                    })
                    setTimeout(function () {
                      wx.navigateBack({
                        url: '/pages/maker/companyinfoshow/companyinfoshow',
                      })
                    }, 500);
                  }
                }
              }
            })
          }
        }
      })
      setTimeout(function () {
        wx.hideLoading()
      },1500)
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