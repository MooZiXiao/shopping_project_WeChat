// 引入
import {request} from '../../request/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 购物车数据
    shoppingCartData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    // 本地数据
    let shoppingCartData = wx.getStorageSync('shoppingCartData') || []
    // 设置
    this.setData({
      shoppingCartData
    })
  }
})