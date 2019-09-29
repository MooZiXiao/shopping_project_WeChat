// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 头像
    userInfo: [],
    // 收藏
    collect: []
  },
  /* 点击头像按钮 */
  handleGetUserInfo(e){
    // console.log(e)
    const token = wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      })
    }

    // 获得 用户 头像
    const {userInfo} = e.detail
    // 缓存
    wx.setStorageSync("userInfo", userInfo);
      
    this.setData({
      userInfo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 本地个人信息
    const userInfo = wx.getStorageSync("userInfo") || [];
    // 本地收藏数据
    const collect = wx.getStorageSync('collect') || []
    this.setData({
      userInfo,
      collect
    })
  }
})