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
  // 页面加载不显示的数据
  queryParams:{
    // 查询参数
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // tab切换
  getTabIndex(e){
    this.setData({
      currentIndex: e.detail.index
    })
  },
  // 调用商品接口
  getGoodData(cid){
    this.queryParams.cid = cid
    // 调用接口传参
    request({url: '/goods/search', data: this.queryParams})
    .then(res => {
      // console.table(res.data.message.goods)
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