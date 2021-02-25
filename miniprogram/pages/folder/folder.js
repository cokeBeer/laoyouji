// pages/folder/folder.js
const db=wx.cloud.database()
const _=db.command
Page({
  async checkUser() {
    //获取clouddisk是否有当前用户的数据，注意这里默认带了一个where({_openid:"当前用户的openid"})的条件
    const userData = await db.collection('clouddisk').get()
    console.log("当前用户的数据对象",userData)

    //如果当前用户的数据data数组的长度为0，说明数据库里没有当前用户的数据
    if(userData.data.length === 0){
      //没有当前用户的数据，那就新建一个数据框架，其中_id和_openid会自动生成
      return await db.collection('clouddisk').add({
        data:{
          //nickName和avatarUrl可以通过getUserInfo来获取，这里不多介绍
          "nickName": "",
          "avatarUrl": "",
          "albums": [ ],
          "folders": [ ]
        }
      })
    }else{
      this.setData({
        userData
      })
      console.log('用户数据',userData)
      this.getFiles()
    }
  },
  async formSubmit(e) {
    let foldersName = e.detail.value.name
    console.log('e.detail',e.detail)
    const folders = this.data.userData.data[0].folders
    folders.push({ foldersName: foldersName, files: [] })
    const _id= this.data.userData.data[0]._id
    return await db.collection('clouddisk').doc(_id).update({
      data: {
        folders: _.set(folders)
      }
    })
  },
  chooseMessageFile(){
    const files = this.data.files
    wx.chooseMessageFile({
      count: 2,
      success: res => {
        console.log('选择文件之后的res',res)
        let tempFilePaths = res.tempFiles
        for (const tempFilePath of tempFilePaths) {
          files.push({
            src: tempFilePath.path,
            name: tempFilePath.name
          })
        }
        this.setData({ files: files })
        console.log('选择文件之后的files', this.data.files)
      }
    })
  },
  uploadFiles(e) {
    const filePath = this.data.files[0].src
    const cloudPath = `cloudbase/${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}` + filePath.match(/\.[^.]+?$/)
    wx.cloud.uploadFile({
      cloudPath,filePath
    }).then(res => {
      this.setData({
        fileID:res.fileID
      })
    }).catch(error => {
      console.log("文件上传失败",error)
    })
  },
  addFiles(fileID) {
    const name = this.data.files[0].name
    const _id= this.data.userData.data[0]._id
    db.collection('clouddisk').doc(_id).update({
      data: {
        'folders.0.files': _.push({
          "name":name,
          "fileID":fileID
        })
      }
    }).then(result => {
      console.log("写入成功", result)
    }
    )
  },
  getFiles(){
    const _id= this.data.userData.data[0]._id
    db.collection("clouddisk").doc(_id).get()
    .then(res => {
      console.log('用户数据',res.data)
    })
    .catch(err => {
      console.error(err)
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    files:[],
    userData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkUser()
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