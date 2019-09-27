// 引入
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {login} from '../../request/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /* 点击授权 */
  handleGetUserInfo(e){
    this.wxLogin(e)
  },
  /* 登录凭证调用 */
  async wxLogin(e){
    let res = await login()
    console.log(res,e)
  }
})