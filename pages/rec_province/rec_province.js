// pages/rec_province/rec_province.js
const db = wx.cloud.database()
const _ = db.command
Page({
  getData(){
    var that=this
    db.collection('RecSpots').where({
      province:wx.getStorageSync('province'),
    })
    // .field({
    //   _id:false,
    //   chatroom:false,
    //   comments:false,
    //   image:true,
    //   intro:false,
    //   name:true,
    //   province:false,
    //   route:false,
    //   tips:false
    // })
    .get({
      success(res){
        console.log('res',res.data)
        if(res.data.length>0){
          that.setData({
            spots:res.data
          })
        }
        console.log('spots',that.data.spots)
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    spots:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.name)
    wx.setStorageSync('province', options.name)
    this.getData()
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