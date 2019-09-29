// 引入
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {request} from '../../request/index.js'
// pages/order/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 全部订单
    allOrderData: [],
    // 未付款订单
    nonPayOrderData: [],
    nonSendOrderData: [],
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
    this.getOrderData()
    this.getNonPayOrderData()
    this.getNonSendOrderData()
  },
  /* 调用订单接口 */
  async getOrderData(){
    const {orders} = await request({
      url: '/my/orders/all',
      data: {type: 1}
    })
    this.setData({
      allOrderData: orders
    })
  },
  /* 调用订单接口 */
  async getNonPayOrderData(){
    const {orders} = await request({
      url: '/my/orders/all',
      data: {type: 2}
    })
    this.setData({
      nonPayOrderData: orders
    })
  },
  /* 调用订单接口 */
  async getNonSendOrderData(){
    const {orders} = await request({
      url: '/my/orders/all',
      data: {type: 3}
    })
    this.setData({
      nonSendOrderData: orders
    })
  }
})