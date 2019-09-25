// 引入
import {request} from '../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品详情数据
    detailData: []
  },
  /* 设置调用详情的接口方法 */
  getDetailData(goods_id){
    request({url: '/goods/detail', data:{goods_id}})
    .then(res => {
      console.table(res.data.message)
      this.setData({
        detailData: res.data.message
      })
    })
  },
  /* 图预览 */
  handleTap(e){
    // console.log(this.data.detailData,e)
    const {current} = e.target.dataset
    const urls = this.data.detailData.pics.map(v => v = v.pics_mid)
    wx.previewImage({
      current, 
      urls
    })
  },
  /* 加入购物车 */
  handleAddCart(){
    // 将购物车所需的参数收集，存储至本地
    // 在存储本地时，需判断是否有数据，没有则为  []
    // 存储时，需判断本地是否有一致数据，若有，则 数量 + 1

    // 获得商品数据
    const {detailData} = this.data
    console.log(this.data) 

    // 判断是否有本地数据
    let cartData = wx.getStorageSync('shoppingCartData') || [];
    // 判断本地是否包含该商品数据，返回index
    let index = cartData.findIndex(v => v.id === detailData.goods_id)

    // 判断是否 index
    if(index === -1){
      // 不存在该商品数据
      cartData.push({
          id: detailData.goods_id,
          goods_name: detailData.goods_name,
          goods_small_logo: detailData.goods_small_logo,
          goods_price: detailData.goods_price,
          buy_num: 1
      })
      
      // 提示 添加成功
      wx.showToast({
        title: '商品添加成功噢...',
        mask: true
      })
    }else{
      // 存在
      // 提示 添加成功, 防止用户频繁点击添加
      wx.showToast({
        title: '商品添加成功噢...',
        mask: true
      })
      cartData[index].buy_num ++
    }
    // 存储至本地
    wx.setStorageSync('shoppingCartData', cartData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {goods_id} = options
    // 调用接口
    // console.log(goods_id)
    this.getDetailData(goods_id)
  }
})