// pages/match/match.js
let app=getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  addGroupId(){
    //将获取的聊天室id放入自己的用户系统
    console.log('调用addGroupId')
    db.collection('UserInfo').where({
      _openid: wx.getStorageSync('openid')
    }).update({
      data:{
        groupId:_.push({
          each:[wx.getStorageSync('province')+wx.getStorageSync('spot')],
          position:0,
        }),
      },
      success(res){
        console.log('更新用户groupId成功')
      }    
    })
  },
  MatchSpot(e){ 
    var that=this
    console.log('提交的景点信息',e)
    wx.setStorageSync('spot', e.detail.value.spot)
    wx.setStorageSync('province', e.detail.value.province)
    that.setData({
      province:wx.getStorageSync('province')
    })
    //通过spot和province查询数据库有没有已经录入该景点信息
    db.collection('ScenicSpots').where({
      province:wx.getStorageSync('province'),
      spot:wx.getStorageSync('spot')
    }).get({
      success(res){
        if(res.data.length>0){
          //说明聊天室里已经录入了该景点，将用户信息添加进user列表，取出聊天室id，user里的各用户数据并渲染出来
          //将isHide改为false，isNew改为false
          that.addGroupId()
          console.log('已有信息',res)
          that.setData({
            friends:res.data[0].users,
            groupId:res.data[0].groupId,
            isHide:true,
            isNew:false
          })
          console.log('friends',that.data.friends)
          app.globalData.userInfo.groupId.push(
            res.data[0].groupId
          )
          db.collection('ScenicSpots').where({
            province:wx.getStorageSync('province'),
            spot:wx.getStorageSync('spot')
          }).update({
            data:{
              users:_.push({
                each:[{
                  openid:wx.getStorageSync('openid'),
                  avatarUrl:app.globalData.userInfo.avatarUrl,
                  name:app.globalData.userInfo.name,
                  home:app.globalData.userInfo.home
                }],
                position:0,
              })
            }
          })
          //将用户信息录入该景点的共同关注用户列表里
        }
        else{
          //创建该景点记录，并将新建的groupId放入data，添加进globalData.userInfo.groupId列表，以及数据库里userInfo.groupId列表,将自己的用户信息添加进user列表
          //将isHide改为false
          db.collection('ScenicSpots').add({
            data:{
              province:wx.getStorageSync('province'),
              spot:wx.getStorageSync('spot'),
              users:[
                {openid:app.globalData.userInfo._openid,
                avatarUrl:app.globalData.userInfo.avatarUrl,
                name:app.globalData.userInfo.name,
                home:app.globalData.userInfo.home}],
              groupId:wx.getStorageSync('province')+wx.getStorageSync('spot')
            }
          })
          that.setData({
            groupId:wx.getStorageSync('province')+wx.getStorageSync('spot'),
            isHide:true
          })
          app.globalData.userInfo.groupId.push(
            wx.getStorageSync('province')+wx.getStorageSync('spot')
          )
          console.log('检验app添加groupId',app.globalData.userInfo)
          that.addGroupId()
        }
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    province:"",
    isHide:false,//在用户搜索获取数据后改为true，对页面进行渲染
    isNew:true,//景点是第一次搜索，返回新建聊天室链接与提示“您是该景点聊天室的发起人，等待其他同伴的加入吧”；否则改false
    groupId:"",//获取的聊天室groupId
    friends:[]//获取的共同关注成员列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:"login",
      success(res){
        console.log('res',res)
        wx.setStorageSync('openid', res.result.openid)
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

  },

  goChat: function(){
    wx.navigateTo({
      url: '/pages/room/room?chatRoomGroupId='+this.data.groupId,
    })
  }
})