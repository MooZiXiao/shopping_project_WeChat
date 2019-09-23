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
    currentIndex: 0
  },
  // 分类总数据 不存入data中
  cateData: [],
  // 封装调用接口方法
  getCateData(){
    request({url: '/categories'})
    .then((res) => {
      // console.table(res.data.message)
      // 总数据
      this.cateData = res.data.message
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
    })
  },
  // 切换菜单
  handleChange(e){
    // 左边菜单索引变化 右边数据根据索引的变化
    const {index} = e.currentTarget.dataset
    this.setData({
      currentIndex: index,
      cateContent: this.cateData[index].children
    })
  },
  onLoad(){
    this.getCateData()
  }
})