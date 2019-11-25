export default function request(options){
  return new Promise((resolve,reject)=>{
    wx.request({
      url: options.url,
      method: options.method || 'get',
      data: options.data || {},
      header:options.header,
      success: function (res) {
       resolve(res)//触发then
      },
      fail: function (err) {
       reject(err)//触发catch
      }
    })
  })
}