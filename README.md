## shopping_project_WeChat ##

### 1 项目目录结构 ###

```js
|--- shopping_project_WeChat
	 |--- components
	 |	  |--- indexSearch（首页搜索）
	 |--- pages
	 |	  |--- index （首页）
	 |	  |--- category（分类页面 ）
	 |	  |--- goods_list（商品列表页面 ）
	 |	  |--- goods_detail（商品详情页面) 
	 |	  |--- cart（购物车页面)   
	 |	  |--- collect（收藏页面）    
	 |	  |--- order（订单页面）
	 |	  |--- search（搜索页面）
	 |	  |--- user （个人中心页面）
	 |	  |--- feedback（意见反馈页面）
	 |	  |--- login（登录页面） 
	 |	  |--- auth（授权页面）
	 |	  |--- pay（结算页面）
	 |--- icons
	 |--- styles
	 |	  |--- iconfont.wxss（字体图标样式）
	 |--- request （调用接口封装）
	 |	  |--- index.js
```

### 2 自定义 tabBar ###

```js
"tabBar":{

    "color": "#666",	// 字体颜色

    "selectedColor": "#cf3a50",	// 激活后的字体颜色

    "list":[

      {

        "pagePath": "pages/index/index",	// 页面地址

        "text": "首页",			// 标签页的标题

        "iconPath": "icons/tab_home_nor@3x.png",	// 图标路径

        "selectedIconPath": "icons/tab_home_fill@3x.png"	// 激活后的图标路径

      }, ……

	]

}
```

### 3 首页 ###

#### 3.1 搜索 ####

创建 components/indexSearch 组件

```html
<view class="indexSearch">
    <navigator url="../search/index">搜索</navigator> 
</view>
```

pages/index/index	.json引入 	.wxml使用

```json
"usingComponents": {
	"indexSearch": "../../components/indexSearch/index"
}
```

```html
<!-- 搜索跳转开始 -->
<indexSearch></indexSearch>
<!-- 搜索跳转结束 -->
```

#### 3.2 轮播图 ####

设置获得轮播图数组，调用接口并将返回的数据进行赋值

```js
/* 调用主页轮播图的接口 */
getSwiperData(){
    wx.request({
        url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
        success: (res) => {
            this.setData({
                swiperData: res.data.message
            })
        }
    })
},
onLoad(){
    this.getSwiperData()
}
```

**swiper 的坑**：swiper默认高度 150px，需设置对应的 rpx

**原稿图片的宽 / 原稿图片的高 = 变化后图片的宽 / 变化后图片的高**

```css
swiper{
	// 750 / 340 = 750rpx / ?
	height: 340rpx;
}
```

#### 3.3 主页导航 ####

设置获得导航菜单数组，调用接口并将返回的数据进行赋值，与调用轮播图接口一致

#### 3.4 楼层 ####

同样地设置获得楼层的数组，调用接口将返回的数据赋值，分析返回的数据，通过双层循环（wx:for）实现页面结构

```html
<view class="indexFloorWrap">
    <view class="indexFloor" wx:for="{{floorData}}" wx:for-item="item1" wx:for-index="index1" wx:key="index1">
        <view class="indexFloorTitle">
            <image mode="widthFix" src="{{item1.floor_title.image_src}}"></image>
        </view>
        <view class="indexFloorItem">
            <navigator wx:for="{{item1.product_list}}" wx:for-item="item2" wx:for-index="index2" wx:key="name">
                <image mode="{{index2 === 0 ? 'widthFix' : 'scaleToFill'}}" src="{{item2.image_src}}"></image>
            </navigator>
        </view>
    </view>
</view>
```

需注意的是，设置样式时，需对图片设置自适应屏幕

公式 -- 原稿图片的宽 / 原稿图片的高 = 变化后图片的宽 / 变化后图片的高

楼层图片，一张占用着整个屏幕宽的 1/3，右边图片的高度是左边图片的 2 倍

则

**变化后图片的高 =  原稿图片的高  / 2 * 变化后图片的宽 / 3  / 原稿图片的宽** 

```css
// 图片容器
.indexFloorItem {
    overflow: hidden;
    border-right: solid 5rpx #fff;
    navigator {
        float: left;
        width: 33.33%;
        border-left: solid 5rpx #fff;
        &:nth-last-child(-n+4){
            height: 750rpx / 3 * 386 / 232 / 2;
            image{
                height: 100%;
            }
        }
        &:nth-last-child(-n+2){
            border-top: solid 5rpx #fff;
        }
    }
}
```

### 4 封装调用接口的库 ###

**request/index.js**

```js
export const request = (params) =>　{
    // params 是请求所需的参数对象
    // promise + wx.request
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
```

由于发送的接口路径都有相同的部分，可以提取，设置

加上 loading 效果，由于同时请求多个接口，需对 loading 隐藏进行设置，通过设置 requestTwice （请求的次数）来判断，设置正确显示

```js
// 同时发送异步请求的次数
let requestTwice = 0

export const request = (params) => {
    requestTwice ++
    // 加载
    wx.showLoading({
        title: '数据加载中...',
        mask: true
    })

    // promise + 调用
    return new Promise((resolve, reject) => {
        // 设置基准路径
        const baseUrl = 'https://api.zbztb.cn/api/public/v1'
        wx.request({
            ...params,
            // 覆盖url
            url: baseUrl + params.url,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                requestTwice --;
                requestTwice === 0 && wx.hideLoading()
            }
        })
    })
}
```

**使用**

pages/index/index.js

```js
import {request} from '../../request/index.js';

/* 调用主页轮播图的接口 */
getSwiperData(){
    request({url: '/home/swiperdata'})
    .then((res) => {
        this.setData({
            swiperData: res.data.message
        })
    })
}, 
(其它调用类似)
... 
```

### 5 分类 ###

分类组件的布局是上（搜索组件）下（左：导航菜单，右：内容）

#### 5.1 封装调用分类接口方法 ####

**设置封装调用分类接口方法，设置变量接收数据**

设置data变量，（cateMenu）接收左边菜单数据，（cateContent）接收右边数据

设置 cateData 接收返回的总数据（组件渲染不显示的数据，用不到的数据，定义在data外的全局变量大数据）

根据返回的数据，渲染结构

```js
 // 封装调用接口方法
getCateData(){
    request({url: '/categories'})
        .then((res) => {
        // 总数据
        this.cateData = res.data.message
        // 左边数据
        let cateMenu = this.cateData.map(v => { return v.cat_name })
        // 右边数据
        // 获得 第一项内容，如要获得其它，则根据右边菜单点击事件，点击对应项则显示对应的右边数据
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
    })
}
```

点击左边菜单项切换不同内容，设置每项菜单的点击事件（handleChange），给事件传入对应的索引（data-index="{{index}}"）

```html
<scroll-view scroll-y class="cateMenu">
    <view class="cateMenuItem {{currentIndex === index ? 'active' : ''}}" wx:for='{{cateMenu}}' wx:for-index='index' wx:key="index" bindtap="handleChange" data-index='{{index}}'>
        {{item}}
    </view>
</scroll-view>
```

通过点击事件（handleChange），设置当前点击索引变量（currentIndex），并将对应点击项事件传入的索引对 currentIndex 赋值，通过传入的索引设置右边数据

```js
handleChange(e){
    // 左边菜单索引变化 右边数据根据索引的变化 切换菜单时右边数据回到最前
    const {index} = e.currentTarget.dataset
    this.setData({
        currentIndex: index,
        // 通过索引大数据设置右边对应显示的数据
        cateContent: this.cateData[index].children,
        // 由于点击左边菜单，对右边数据滚动至最低部，再点击切换菜单，右边的滚动条并不会回到最上边，所以需要设置 scroll-view scroll-top="{{scrollTop}}",需设置 scrollTop 变量，通过菜单点击事件设置 scrollTop 
        scrollTop: 0
    })
}
```

#### **5.2 数据缓存** ####

在调用分类接口时，设置本地存储 cateData （总数据及存入的时间）

**设置 loadData 方法，1 判断是否有本地数据**

**1.1** 没有，则 重新调用获得分类接口的方法，

**1.2** 有，则 **还需判断 本地数据 是否过期**，

**1.2.1** 若过期则 重新调用获得分类接口的方法，

**1.2.2** 未过期，则将本地数据赋值给大数据（cateData），并根据大数据再设置左边数据，右边数据

最后，在 onLoad 事件 调用 loadData 方法

```js
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
}
```

### 6 商品列表 ###

#### 6.1 自定义tab ####

**创建** tab 组件 components/goodsTab/index

**引入 + 使用** pages/goods_list/index

pages/goods_list/index 中，设置要到标签页标题的数据 -- tabTitle[]

```html
<goodsTab tabTitle="{{tabTitle}}">
```

tab组件中，**设置属性** `tabTitle` 接收数据

```js
properties: {
    // 标题数据
    tabTitle: {
      type: Array,
      value: []
    }
}
```

tab组件渲染出标题后，需设置点击事件切换标题

则

1.需在 components/goodsTab/index 设置 索引 `currentIndex` 通过属性 ``currentIndex` ` 传到 tab组件

​	1.1 `currentIndex` 传到tab组件时，需设置 标题激活样式 -- active，在渲染的标题标签判断当前索引是否与  `currentIndex` 一致，一致则增加 active 样式

```html
<view class="goodsTabTitle">
    <view class="goodsTabTitleItem {{currentIndex === index ? 'active' : ''}}" wx:for='{{tabTitle}}' wx:key="name" bindtap="handleChange"
          data-index="{{index}}">{{item.name}}</view>
</view>
```

2.设置各个标题的点击事件并传入当前点击的标题索引 `data-index`，通过事件设置触发函数

```js
// 注意：组件中声明函数需在 methods 中
methods: {
    handleChange(e){
        // console.log(e)
        const {index} = e.target.dataset
        // 触发事件
        this.triggerEvent('getTabIndex', {index})
    }
}
```

3.在 components/goodsTab/index 设置对应的点击事件 `bindgetTabIndex`，通过该事件设置 `currentIndex`

```js
getTabIndex(e){
    this.setData({
        currentIndex: e.detail.index
    })
}
```

4.tab组件设置内容，则需加入插槽 slot

tab组件的完整代码

```html
<view class="goodsTab">
    <!-- 标题 -->
    <view class="goodsTabTitle">
        <view class="goodsTabTitleItem {{currentIndex === index ? 'active' : ''}}" wx:for='{{tabTitle}}' wx:key="name" bindtap="handleChange"
        data-index="{{index}}">{{item.name}}</view>
    </view>
    <!-- 内容 -->
    <view class="goodsTabCont">
        <slot></slot>
    </view>
</view>
```

5.components/goodsTab/index 内容块中加入判断显示对应标题的内容

完整代码

```html
<!-- 搜索组件开始 -->
<indexSearch></indexSearch>
<!-- 搜索组件结束 -->
<!-- tab组件开始 -->
<goodsTab tabTitle="{{tabTitle}}" currentIndex="{{currentIndex}}" bindgetTabIndex="getTabIndex">
    <view wx:if="{{currentIndex === 0}}">0</view>
    <view wx:elif="{{currentIndex === 1}}">1</view>
    <view wx:else>2</view>
</goodsTab>
<!-- tab组件结束 -->
```

#### 6.2 商品列表数据的渲染 ####

设置调用接口所需要的参数（data外定义）

```js
// 页面加载不显示的数据
queryParams:{
    // 查询参数
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
}
```

封装调用商品列表数据的接口方法

设置 goodData 变量接收调用接口返回的数据

```js
getGoodData(cid){
    this.queryParams.cid = cid
    // 调用接口传参
    request({url: '/goods/search', data: this.queryParams})
    .then(res => {
      // console.table(res.data.message.goods)
      this.setData({
        goodData: res.data.message.goods
      })
    })
}
```

在 onLoad(options) 获得传来的地址参数，并调用封装调用商品列表数据的接口方法

```js
onLoad: function (options) {
    // 获得地址参数
    // console.log(options)
    let cid = options.cid
    this.getGoodData(cid)
}
```

根据返回的数据，渲染结构

```html
<goodsTab tabTitle="{{tabTitle}}" currentIndex="{{currentIndex}}" bindgetTabIndex="getTabIndex">
    <view wx:if="{{currentIndex === 0}}">
        <view class="goodsItem" wx:for="{{goodData}}" wx:key="goods_id">
            <!-- 图片 -->
            <view class="goodsItemImg">
                <navigator>
                    <image mode="widthFix" src="{{item.goods_small_logo || 'http://img3.imgtn.bdimg.com/it/u=62131398,3721023975&fm=26&gp=0.jpg'}}"></image>
                </navigator>
            </view>
            <!-- 内容 -->
            <view class="goodsItemCont">
                <view class="goodsItemContTitle">{{item.goods_name}}</view>
                <view class="goodsItemContPrice">￥{{item.goods_price}}</view>
            </view>
        </view>
    </view>
    <view wx:elif="{{currentIndex === 1}}">1</view>
    <view wx:else>2</view>
</goodsTab>
```

