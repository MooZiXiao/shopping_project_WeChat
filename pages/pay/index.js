// 引入
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {getSetting, openSetting, chooseAddress, showModal, showToast} from '../../request/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 购物车数据
    shoppingCartData: [],
    // 收货地址信息
    address: {},
    // 总价
    totalPrice: 0,
    // 总数
    totalNum: 0,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 本地数据
    let shoppingCartData = wx.getStorageSync('shoppingCartData') || [];
    // 勾选的数据
    shoppingCartData = shoppingCartData.filter( v =>  v.checked === true)
    console.log(shoppingCartData)
    let address = wx.getStorageSync('cartAddress')
    // 设置
    this.setData({
      shoppingCartData, address
    })

    // 调用计算总价及数量的方法,传入数据
    this.getTotalPriceAndNum(shoppingCartData)
  },
  /* 计算总价及总数 */
  getTotalPriceAndNum(cartData){
    // 总价, 复选框选中状态的价格相加
    let totalPrice = 0
    // 总数, 复选框选中状态的数量相加
    let totalNum = 0

    // 遍历数据
    cartData.forEach(v => {
      // 是否选中
      if(v.checked){
        totalPrice += v.buy_num * v.goods_price
        totalNum += v.buy_num
      }
    })

    // 赋值
    this.setData({
      totalPrice,
      totalNum
    })
  },
})