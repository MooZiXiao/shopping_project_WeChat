// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /* 轮播图数据 */
    swiperData: []
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
  onLoad(){
    this.getSwiperData()
  }
})