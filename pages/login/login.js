// pages/login/login.js
let app=getApp()
const db = wx.cloud.database()
Page({
   // 新用户的信息授权，并将获取到的信息先缓存
  getUserProfile(e){
    let that=this
    wx.getUserProfile({
      desc:'用于完善用户您的资料',
      success: (res) => {
        console.log('申请到的用户数据',res.userInfo)
        wx.setStorageSync('userInfo', res.userInfo)
        that.setData({
          first:false
        })
      }
    })
  },
  UserInput(e){
    console.log('提交的数据信息：',e.detail.value)
    wx.setStorageSync('UserSubmit', e.detail.value)
    this.addUser()
    this.setData({
      isHide:false
    })
  },

  //新增用户
  addUser(){
    let that = this
    db.collection('UserInfo').add({
      data:{
        name: wx.getStorageSync('userInfo').nickName,
        gender: wx.getStorageSync('userInfo').gender,
        city: wx.getStorageSync('userInfo').city,
        province: wx.getStorageSync('userInfo').province,
        country: wx.getStorageSync('userInfo').country,
        avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
        home:wx.getStorageSync('UserSubmit').home,
        spot1:wx.getStorageSync('UserSubmit').spot1,
        spot2:wx.getStorageSync('UserSubmit').spot2,
        spot3:wx.getStorageSync('UserSubmit').spot3,
        lat:app.globalData.lat,
        lon:app.globalData.lon
      },
      success(res){
        console.log("新增用户成功",res)
        //获取该用户数据的_id
        db.collection('UserInfo').where({
          _openid: wx.getStorageSync('openid')
        }).get({
          success:res=>{
            console.log('数据库获取用户信息为',res)
            app.globalData.counterID=res.data[0]._id
            app.globalData.userInfo=res.data[0]
            that.setData({
              userInfo:res.data[0]
            })
          }
        })
      }
    })
  },
  //更新用户数据
  updateUser(){
    db.collection('UserInfo').where({
      _openid: wx.getStorageSync('openid')
    }).update({
      data:{
        lat:app.globalData.lat,
        lon:app.globalData.lon
      },
      success(res){
        console.log("更新用户信息成功",res)
        //获取该用户数据的_id
        db.collection('UserInfo').where({
          _openid: wx.getStorageSync('openid')
        }).get({
          success:res=>{
            app.globalData.counterID=res.data[0]._id
          }
        })
      }
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    isHide: false,//判断用户是否授权登录过，如果登录过则为false，授权也隐藏，直接进入主页
    first:true,//在新用户同意信息授权后设置为false进入其他信息提交页面
    userInfo: {}//存储用户信息，包括昵称头像，常住地，推荐景点，位置信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查看是否为新用户
    wx.login({
      success: res => {
         //调用云函数获取openid
         wx.cloud.callFunction({
          name:"login",
          success(res){
            console.log('res',res)
            wx.setStorageSync('openid', res.result.openid)
          }
        }),
        //使用openid判断是否已经注册过
        db.collection('UserInfo').where({
          _openid: wx.getStorageSync('openid')
        }).get({
          success(res){
            if(res.data.length > 0){
              //说明数据库内存有该用户数据，将用户的userInfo存入缓存，并存入该页面的data和全局的globaldata中，
              //并改变isHide为false，即不显示登录页面，同时只对用户位置数据做更新
              console.log('获取的已有用户信息',res.data[0])
              wx.setStorageSync('userInfo', res.data[0])
              that.setData({
                userInfo:res.data[0],
                isHide:false
              })
              app.globalData.userInfo=res.data[0]
              that.updateUser()
            }
            else{
              //否则修改isHide为true显示授权登录页面，向用户申请信息授权
              that.setData({
                isHide:true
              })
            }
          }
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