// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 问题各类
    questionTypeData:[
      {
        text: '功能建议'
      },
      {
        text: '购买遇到问题'
      },
      {
        text: '性能问题'
      },
      {
        text: '其他'
      }
    ],
    // tabTitle
    tabTitle: [
      {
        name: '体验问题'
      },
      {
        name: '商品、商家投诉'
      }
    ],
    // 
    currentIndex: 0
  },
  /* tab事件 */
  getTabIndex(e){
    this.setData({
      currentIndex: e.detail.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})