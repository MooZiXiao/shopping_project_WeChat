// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabTitle 
    tabTitle: [
      {
        name: '商品收藏'
      },
      {
        name: '品牌收藏'
      },
      {
        name: '店铺收藏'
      },
      {
        name: '浏览足迹'
      }
    ],
    // 
    currentIndex: 0,
    // 内容tab
    contentTab:[
      { 
        text: '全部'
      },
      {
        text: '正在热卖'
      },
      {
        text: '即将上线'
      }
    ],
    contentIndex: 0,
    // 收藏数据
    collectData: []
  },
  /* tab */
  getTabIndex(e){
    this.setData({
      currentIndex: e.detail.index
    })
  },
  /* 内容tab 事件 */
  handleChangeIndex(e){
    // console.log(e)
    this.setData({
      contentIndex: e.target.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const collectData = wx.getStorageSync('collect') || []
    this.setData({
      collectData
    })
  }
})