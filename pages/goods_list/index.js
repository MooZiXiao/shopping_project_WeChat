// 引入
import regeneratorRuntime from '../../lib/runtime/runtime.js';
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
    // 触底提示显隐
    isBtmShow: false,
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
  // 总页数
  total: 0,
  // tab切换
  getTabIndex(e){
    this.setData({
      currentIndex: e.detail.index
    })
  },
  // 调用商品接口
  async getGoodData(){
    // 调用接口传参
    const res = await request({url: '/goods/search', data: this.queryParams})
    
    const {goods, total} = res

    // 总页数
    this.total = Math.ceil(total / this.queryParams.pagesize)
    // 旧数据,上拉触底时显示的数据应该是之前的加上当前页的数据
    const oldData = this.data.goodData
    // 设置数据
    this.setData({
      goodData: [...oldData, ...goods]
    })
    // console.log(goods, this.total)
    
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获得地址参数
    if(options.query){
      this.queryParams.query = options.query
    }
    // console.log(options)
    if(options.cid){
      let cid = options.cid
      // 赋值参数的cid
      this.queryParams.cid = cid
    }

    this.getGoodData()
  },
  // 上拉触底
  onReachBottom: function() {
    // 判断是否还有下一页
    if(this.queryParams.pagenum >= this.total){
      // 提示
      wx.showToast({
        title: '你将失去你的宝宝.........没有更多数据了噢..........',
        icon: 'none'
      })
      // 显示
      this.setData({
        isBtmShow: true
      })
    }else{
      // 还有
      this.queryParams.pagenum++
      this.getGoodData()
    }
  },
  // 下拉刷新
  onPullDownRefresh(){
    // 重置页码
    this.queryParams.pagenum = 1
    // 重置数据
    this.setData({
      goodData: []
    })
    // 调用接口
    this.getGoodData()
  }
})