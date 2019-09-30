// 引入
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {request, showToast} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 问题各类
    questionTypeData:[
      {
        text: '功能建议'
      },
      {
        text: '购买遇到问题'
      },
      {
        text: '性能问题'
      },
      {
        text: '其他'
      }
    ],
    // tabTitle
    tabTitle: [
      {
        name: '体验问题'
      },
      {
        name: '商品、商家投诉'
      }
    ],
    // 
    currentIndex: 0,
    // 选择图片路径数据
    chooseImages: [],
    // textarea 值
    textareaVal: ''
  },
  // 图片数组
  uploadData: [],
  /* tab事件 */
  getTabIndex(e){
    this.setData({
      currentIndex: e.detail.index
    })
  },
  /* 选择图片 */
  handleUploadImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImages: [...this.data.chooseImages,...result.tempFilePaths]
        })
      },
      fail: (err) => {
        console.log(err)
      }
    });
  },
  /* 移除图片 */
  handleDelImg(e){
    // console.log(e)
    // 获得索引
    const {index} = e.currentTarget.dataset
    // 获得选择的图片数组
    let chooseImages = this.data.chooseImages
    // 删除对应索引的图片
    chooseImages.splice(index ,1)
    // 重新赋值
    this.setData({
      chooseImages
    })
  },
  /* textarea  */
  handleInput(e){
    this.setData({
      textareaVal: e.detail.value
    })
  },
  /* 提交按钮事件 */
  async handleSubmit(){
    let {textareaVal, chooseImages} = this.data

    // 非空判断
    if(!textareaVal.trim()){
      await showToast({title: '请输入您要反馈的内容', icon: 'none', mask: true})
      return
    }
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
      
    // 判断是否有图片
    if(chooseImages.length > 0){
      chooseImages.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          filePath: v,
          name: 'file',
          formData: {},
          success: (result) => {
            // console.log(result)
            let url = JSON.parse(result.data).url
            this.uploadData.push(url)
            // 所有图片上传完后触发  
            if (i === chooseImages.length - 1) {
              // 隐藏上传框
              wx.hideLoading();

              console.log("提交成功");
              
              // 提交成功后，重置页面
              this.setData({
                textareaVal: "",
                chooseImages: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });

            }
          },
          fail: (err) => {
            console.log(err)
          }
        });
      })
        
    }else{
      wx.hideLoading()
      // 返回到上一页
      wx.navigateBack({
        delta: 1
      });
        
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})