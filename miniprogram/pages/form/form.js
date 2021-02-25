// pages/form/form.js
Page({
  buttonSetTitle(e){
    console.log(e)
    wx.setNavigationBarTitle({
      title: "button触发修改的标题"
    })
  },
  setNaivgationBarTitle(e) {
    console.log(e)
    const navtitle = e.detail.value.navtitle
    wx.setNavigationBarTitle({
      title:navtitle
    })
  },
  inputSubmit:function(e){
    console.log('提交的数据信息:',e.detail.value)
  },
  formSubmit: function (e) {
  console.log('表单携带的数据为：', e.detail.value)
  const gamecheck=e.detail.value.gamecheck
  console.log('直接打印的gamecheck',gamecheck)
  console.log('拓展运算符打印的gamecheck',...gamecheck)
  },
  valueChanged(e) {
    this.setData({
      initvalue: e.detail.value
    })
  },
  colorChanging(e) {
    console.log(e)
    let color = e.currentTarget.dataset.color
    let value = e.detail.value;
    this.setData({
      [color]: value
    })
  },
  bindDateChange: function (e) {
    console.log('picker组件的value', e.detail.value)
  },
  /**
   * 页面的初始数据
   */
  data: {
    pickerdate:"2019-8-31",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title:"onLoad触发修改的标题"
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