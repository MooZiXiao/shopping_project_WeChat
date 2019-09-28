// pages/order/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 自定义tab
    tabTitle: [
      { name: '全部'}, 
      { name: '待付款'}, 
      { name: '待发货'}, 
      { name: '退款/退货'}
    ],
    // tab索引
    currentIndex: 0
  },
  // tab事件
  handleTabChange(e){
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