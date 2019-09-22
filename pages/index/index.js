// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /* 轮播图数据 */
    swiperData: [],
    /* 导航菜单 */
    catitemsData: []

  },
  /* 调用主页轮播图的接口 */
  getSwiperData(){
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
      success: (res) => {
        // console.table(res.data.message)
        this.setData({
          swiperData: res.data.message
        })
      }
    })
  },
  /* 调用导航菜单的接口 */
  getCatitemsData(){
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/catitems',
      success: (res) => {
        // console.table(res.data.message)
        this.setData({
          catitemsData: res.data.message
        })
      }
    })
  },
  onLoad(){
    this.getSwiperData();
    this.getCatitemsData()
  }
})