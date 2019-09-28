// 引入
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {request, requestPayment, showToast} from '../../request/index.js'
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
    // console.log(shoppingCartData)
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
  /* 支付按钮 */
  handleToPay(){
    this.wxTopay()
  },
  /* 支付逻辑 */
  async wxTopay(){
    try {
      // 需判断用户权限
      // 用户是否授权
      // 获得 token, 判断 token
      const token = wx.getStorageSync('token')
      // 不存在 token
      if(!token){
        // 跳到用户授权页
        wx.navigateTo({
          url: '/pages/auth/index'
        })
      }
      // 创建订单
      // 获得创建订单所需要的参数
      const {detailAddress} = this.data.address
      const {totalPrice} = this.data
      // const {id,buy_num,goods_price} = this.data.shoppingCartData
      let goods = []
      this.data.shoppingCartData.forEach(v => {
        goods.push({
          goods_id: v.id,
          goods_number: v.buy_num,
          goods_price: v.goods_price
        })
      })
  
      let orderParams = {
        order_price: totalPrice,
        consignee_addr: detailAddress,
        goods
      }
      // console.log(orderParams)
      // 调用接口, 获得订单编号
      const {order_number} = await request({
        url: '/my/orders/create',
        method: 'post',
        data: orderParams
      })
      // return
      // 预支付订单接口,获得返回的对象参数
      const {pay} = await request({
        url: '/my/orders/req_unifiedorder',
        method: 'post',
        data: {order_number}
      })
      // 调用微信支付api
      await requestPayment(pay)
      // 支付成功后的操作，查询订单的支付状态
      const message = await request({
        url: '/my/orders/chkOrder',
        method: 'post',
        data: {order_number}
      })
      // console.log(message)
      // 给出提示
      await showToast({title: message, mask: true})
        
      // 删除缓存中的对应支付的数据
      // 获得缓存数据
      let shoppingCartData = wx.getStorageSync('shoppingCartData')
      shoppingCartData = shoppingCartData.filter(v => {
        return !v.checked
      })
      // 重新存入缓存
      wx.setStorageSync('shoppingCartData', shoppingCartData);

      // 跳转至订单页
      wx.navigateTo({
        url: '/pages/order/index'
      })
    } catch (error) {
      console.log(error)
    }
  }
})