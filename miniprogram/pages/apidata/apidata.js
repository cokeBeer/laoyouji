// pages/apidata/apidata.js
const md5 = require('../../utils/md5.min.js')
const app=getApp()
const now = new Date();
const month = now.getMonth()+1 //月份需要+1
const day = now.getDate()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:"22.540503",
    longitude: "113.934528",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    const { latitude, longitude } = that.data
    const { mapKey, mapSecretKey}=app.globalData
    let SIG = md5("/ws/geocoder/v1?key=" + mapKey + "&location=" + latitude + "," + longitude + mapSecretKey)
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1',
      data: {
        key: mapKey,
        location: `${latitude},${longitude}`,
        sig: SIG
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
      }
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