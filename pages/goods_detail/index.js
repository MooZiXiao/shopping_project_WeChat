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