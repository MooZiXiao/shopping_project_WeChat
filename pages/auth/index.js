// 引入
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {login, request} from '../../request/index.js'
Page({
  /* 点击授权 */
  handleGetUserInfo(e){
    this.wxLogin(e)
  },
  /* 登录凭证调用 */
  async wxLogin(e){
    // console.log(e)
    // 获取用户信息
    const {encryptedData,rawData,iv,signature} = e.detail
    // 获得登录返回的code
    const {code} = await login()
    // 调用接口所需参数
    let queryParams = {
      encryptedData,rawData,iv,signature,code
    }
    // 调用接口传入以上参数返回token
    const {token} = await request({
      url: '/users/wxlogin',
      method: 'post',
      data: queryParams
    })
    
    // 存储到缓存
    wx.setStorageSync('token', token);
    // 返回上一页
    wx.navigateBack({
      delta: 1
    });
  }
})