// pages/maker/updatecompanyinfo/updatecompanyinfo.js
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
    previewPicList: [],//预览图片数据
    uploadPicList:[],
    piccount: 6,//设置图片上传数量
    cachetprivewHeight: 300,//公章上传预览图片高度

  },
  //填写公司信息
  infoinput(event) {
    console.log("填写信息", event.detail.value)
    this.setData({
      companyinfo: event.detail.value
    })
  },
  //添加证明材料
  addprovepic() {
    console.log("添加证明材料")
    var that = this
    var piccount = this.data.piccount
    wx.chooseImage({
      success(res) {
        console.log('上传的图片数据', res.tempFilePaths)
        console.log('上传的图片数据长度', res.tempFilePaths.length)
      
        var uploadPicList = that.data.uploadPicList
        var previewPicList = that.data.previewPicList
        for (var i = 0; i < res.tempFilePaths.length; i++) {
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
      uploadPicList: arr2
    })
    console.log("删除后的图片",this.data.uploadPicList)
  },
  //提交判断
  judge() {
    var companyinfo = this.data.companyinfo
    var previewPicList = this.data.previewPicList
    if (companyinfo == '') {
      wx.showToast({
        title: '请填写公司信息',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (previewPicList.length == 0) {
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
  //确认提交
  affirm() {
    console.log("提交")
    var flage = this.judge
    if (flage) {
      var userid = wx.getStorageSync(this.data.Userid)
      // var accesstoken = wx.getStorageSync(this.data.Token)
      var len = this.data.uploadPicList.length
      request({
        url: this.data.WEB + '/api/maker/UpdateDelMakerInfo',
        method: 'post',
        data: {
          userid: userid
        },
        header: {
          'content-type': 'application/json',
          // Authorization: "Bearer " + accesstoken
        }
      }).then(res => {
        console.log("更新删除",res.data)
        if (res.data.status == 'success') {
          var formData = {
            userid: userid,
            companyinfo: this.data.companyinfo,
          }
          console.log("更新公司具体信息", this.data.companyinfo)
          var sum = 0
          for (var i = 0; i < len; i++) {
            wx.uploadFile({
              url: this.data.WEB + '/api/maker/UpdateMakerInfo',
              filePath: this.data.uploadPicList[i],
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
                      title: '修改成功',
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
      }).catch(err => {
        console.log(err)
      })
  
     
    
    }
  },
  //公司数据请求
  dataRequest() {
    var userid = wx.getStorageSync(this.data.Userid)
    // var accesstoken = wx.getStorageSync(this.data.Token)
    request({
      url: this.data.WEB + '/api/maker/selMakerInfo',
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
        console.log('公司信息', res.data.data)
        var companyinfodata = res.data.data[0]
        for (var i = 0; i < companyinfodata.proveinfo.length;i++){
          companyinfodata.proveinfo[i] = this.data.WEB + "/" + companyinfodata.proveinfo[i]
        }
        this.setData({
          companyinfo: companyinfodata.companyinfo,
          previewPicList: companyinfodata.proveinfo
        })
        this.previewPicSet() //下载图片数据初始化 previewPicList
      } else {
        this.setData({
          showFlage: false
        })
        console.log('暂无数据')
      }
    }).catch(err => {
      console.log(err)
    })
  },
  previewPicSet() {
    console.log("图片下载中")
    var previewPicList = this.data.previewPicList
    var uploadPicList = this.data.uploadPicList
    console.log('previewPicList', previewPicList)
    // var accesstoken = wx.getStorageSync(this.data.Token)
    var that = this
    var sum = 0
    var len = previewPicList.length
    for (var i = 0; i < len; i++) {
      console.log('index', i)
      wx.downloadFile({
        url: previewPicList[i],
        method: 'post',
        header: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ' + accesstoken
        },
        // data: {
        //   cachetid: cachetid,
        //   index: i
        // },
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
        fail(res) {
          console.log('下载失败')
        }
      })
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dataRequest()
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