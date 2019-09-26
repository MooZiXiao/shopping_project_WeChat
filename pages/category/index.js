import regeneratorRuntime from '../../request/runtime.js';
import {request} from '../../request/index.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左边菜单
    cateMenu: [],
    // 右边数据
    cateContent: [],
    // 激活当前索引
    currentIndex: 0,
    // 菜单切换时滚动条加到最前边
    scrollTop: 0
  },
  // 分类总数据 不存入data中
  cateData: [],
  // 封装调用接口方法
  async getCateData(){
    const res = await request({url: '/categories'})
    // console.table(res.data.message)
    // 总数据
    this.cateData = res
    // 左边数据
    let cateMenu = this.cateData.map(v => { return v.cat_name })
    // 右边数据
    let cateContent = this.cateData[0].children
    console.log(cateContent)
    // 设置数据
    this.setData({
      cateMenu,
      cateContent
    })
    // 设置本地存储总数据
    wx.setStorageSync('catesData',
      {data: this.cateData, time: Date.now()}
    )
  },
  // 获取缓存的数据
  dataLoad(){
    let storage = wx.getStorageSync('catesData')
    // 判断是否有本地数据
    if(storage){
      // 判断数据是否过期
      if(Date.now() - storage.time > 1000 * 60){
        this.getCateData()
      }else{
        // 未过期
        this.cateData = storage.data
        let cateMenu = this.cateData.map(v => {return v.cat_name})
        let cateContent = this.cateData[0].children
        this.setData({
          cateMenu,
          cateContent
        })
      }
    }else{
      this.getCateData()
    }
  },
  // 切换菜单
  handleChange(e){
    // 左边菜单索引变化 右边数据根据索引的变化 切换菜单时右边数据回到最前
    const {index} = e.currentTarget.dataset
    this.setData({
      currentIndex: index,
      cateContent: this.cateData[index].children,
      scrollTop: 0
    })
  },
  onLoad(){
    this.dataLoad()
  }
})