// components/goodsTab/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题数据
    tabTitle: {
      type: Array,
      value: []
    },
    // tab切换索引
    currentIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChange(e){
      // console.log(e)
      const {index} = e.target.dataset
      // 触发事件
      this.triggerEvent('getTabIndex', {index})
    }
  }
})
