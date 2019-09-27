// pages/index/index.js
import {request} from '../../request/index.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /* 轮播图数据 */
    swiperData: [],
    /* 导航菜单 */
    catitemsData: [],
    /* 楼层菜单 */
    floorData: []
  },
  /* 调用主页轮播图的接口 */
  getSwiperData(){
    request({url: '/home/swiperdata'})
    .then((res) => {
      this.setData({
        swiperData: res
      })
    })
  },
  /* 调用导航菜单的接口 */
  getCatitemsData(){
    request({url: '/home/catitems'})
    .then((res) => {
      this.setData({
        catitemsData: res
      })
    })
  },
  /* 调用楼层的接口 */
  getFloorData(){
    request({url: '/home/floordata'})
    .then((res) => {
      console.log(res)
      this.setData({
        floorData: res
      })
    })
  },
  onLoad(){
    this.getSwiperData();
    this.getCatitemsData();
    this.getFloorData()
  }
})