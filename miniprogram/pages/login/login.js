// pages/login/login.js
let app=getApp()
const db = wx.cloud.database()
Page({
   // 用户登录方法
userLogin:function(name,photo){
  var That = this;
  wx.login({
    success: res => {
      wx.request({
        url: 'https://api.weixin.qq.com/sns/jscode2session', 
        data:{code:res.code,name:name,photo:photo},
        success: res => {
          console.log('res',res)
          app.globalData.userInfo=wx.getStorageSync('userInfo')
          console.log('app.userInfo',app.globalData.userInfo)   
          //调用云函数获取openid
          wx.cloud.callFunction({
            name:"login",
            success(res){
              wx.setStorageSync('openid', res.result.openid)
            }
          }),
          //使用openid判断是否已经注册过
          db.collection('UserInfo').where({
            _openid: wx.getStorageSync('openid')
          }).get({
            success(res){
              if(res.data.length > 0){
                That.setData({
                  hasRegistered: true  //将hasRegistered更新为true
                })
              }
          //已注册，更新用户信息；没注册，新增用户
          if(That.data.hasRegistered){
            That.updateUser()
          }else{
            That.addUser()
          }
            }
          })
        }
      })
    }
  })
},
// 用户授权方法
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮      
      wx.setStorageSync('userInfo', e.detail.userInfo)//缓存用户信息
      var that = this;
      var name = e.detail.userInfo.nickName;//获取姓名
      var photo = e.detail.userInfo.avatarUrl;//获取头像
      //授权成功后执行登录方法；
      this.userLogin(name,photo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false,
        userInfo:e.detail,
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  //新增用户，并将hasReigstered设置为true
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
        lat:app.globalData.lat,
        lon:app.globalData.lon
      },
      success(res){
        that.setData({
          hasRegistered: true
        })
        console.log("新增用户成功",res)
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
  //更新用户数据
  updateUser(){
    db.collection('UserInfo').where({
      _openid: wx.getStorageSync('openid')
    }).update({
      data:{
        name: wx.getStorageSync('userInfo').nickName,
        gender: wx.getStorageSync('userInfo').gender,
        city: wx.getStorageSync('userInfo').city,
        province: wx.getStorageSync('userInfo').province,
        country: wx.getStorageSync('userInfo').country,
        avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
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
    hasRegistered: false,//判断用户是否是新用户
    isHide: false,//判断用户是否授权登录过，如果登录过则为false，授权也隐藏，直接进入主页
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 获取昵称和头像，**这里看需求因为这里需要将昵称和头像传送给后台所以需要；**
              wx.setStorageSync('userInfo', res.userInfo)//缓存用户信息
              var name = res.userInfo.nickName;
              var photo = res.userInfo.avatarUrl;
              that.setData({
                userInfo:res.userInfo
              })
              //调取登录按钮
              that.userLogin(name,photo);
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
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