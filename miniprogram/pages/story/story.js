// pages/story/story.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    body:"",
    image:"",
    share_url:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let stories_id=options.id
    let that = this
    wx.request({
      url: 'https://news-at.zhihu.com/api/4/news/'+stories_id,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        let title = res.data.title
        let body=res.data.body
        let image=res.data.image
        let share_url=res.data.share_url
        that.setData({
          title,body,image,share_url
        })
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