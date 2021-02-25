// app.js
App({

  onLaunch: function () {
    let that=this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'yingyingying-7gw8jn4452265e97',
        traceUser: true,
      })
    }
    wx.getLocation({
      success: function(res) {
      that.globalData.lat = res.latitude;
      that.globalData.lon = res.longitude;
      },
      fail() {
      wx.showModal({
       title: '提醒',
       content: '您拒绝了位置授权，将无法使用大部分功能，点击确定重新获取授权',
       success(res) {
       //如果点击确定
       if (res.confirm) {
        wx.openSetting({
        success(res) {
         //如果同意了位置授权则userLocation=true
         if (res.authSetting["scope.userLocation"]) {
         that.onLoad()
         }
        }
        })
       }
       }
      })
      }
     })
    //  ||为逻辑与，就是声明logs为获取缓存里的logs记录，没有时就为空数组
  //   var logs = wx.getStorageSync('logs') || []

  //   //unshift()是数组的操作方法，它会将一个或多个元素添加到数组的开头，这样最新的记录就放在数组的最前面，
  //   //这里是把Date.now()获取到的时间戳放置到数组的最前面
  //   logs.unshift(Date.now())

  //  //将logs数据存储到缓存指定的key也就是logs里面
  //   wx.setStorageSync('logs', logs)
  //   console.log(logs)
  //   console.log(Date.now())
  },

  globalData: {
    lat:"",
    lon:"",
    mapKey:"OGKBZ-Y3UKD-YUA4D-PSQTI-P3ZTO-E2BBU",
    mapSecretKey:"BmfbeDycbhcUiIsZFUcllDepAGn5V2S9",
    juheKey:"4ca8e9d06779d084677e79f3e8dbe948",
    heweatherKey:"3228f06d131a451b86eab302fbb9bb1a",
    userInfo:{},
    counterID:"",
    tcbData:{

      title:"云开发训练营",
  
      year:2019,
  
      company:"腾讯Tencent"
  
    }
  }

})
