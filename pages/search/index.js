// 引入
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {request} from '../../request/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 搜索数据
    searchData: [],
    // 文本框数据
    inputVal: '',
    // 取消按钮
    isShowCancel: false
  },
  // 防抖变量
  timeId: -1,
  /* 输入框事件 */
  inputSearch(e){
    // console.log(e)
    // 获得输入框数据
    const {value} = e.detail
    // 调用接口
    // 当输入框有空格时
    if(!value.trim()){
      return
    }
    // 显示按钮
    this.setData({
      isShowCancel: true
    })
    // 防抖
    clearTimeout(this.timeId)
    // 设置定时
    this.timeId = setTimeout(() => {
      this.getSearchData(value)
    }, 1000)
  },
  /* 调用接口函数 */
  async getSearchData(value){
    const res = await request({url: '/goods/qsearch', data: {query: value}})
    this.setData({
      searchData: res
    })
  },
  /* 点击取消 */
  handleCancel(){
    this.setData({
      searchData: [],
      inputVal: '',
      isShowCancel: false
    })
  }
})