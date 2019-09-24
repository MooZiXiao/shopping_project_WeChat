// 引入
import {request} from '../../request/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 接口返回的数据
    goodData: [],
    // tab标题
    tabTitle: [
      {name: '综合'},
      {name: '销量'},
      {name: '价格'}
    ],
    // 当前点击的tab
    currentIndex: 0
  },
  // tab切换
  getTabIndex(e){
    this.setData({
      currentIndex: e.detail.index
    })
  },
  // 调用商品接口
  getGoodData(cid){
    request({url: '/goods/search', cid})
    .then(res => {
      console.table(res.data.message.goods)
      this.setData({
        goodData: res.data.message.goods
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获得地址参数
    // console.log(options)
    let cid = options.cid
    this.getGoodData(cid)
  },
})