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
     |--- lib
	 |	  |--- runtime
	 |	  	   |--- runtime.js
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

#### 4.1 promise 优化 ####

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

#### 4.2 再次优化 - ES7 ####

简化 request.js 封装返回的数据，使用该封装来调用接口返回数据都包含(res.data.message)

```js
success: (res) => {
    resolve(res.data.message)
}
```

则使用该封装来调用接口返回数据，数据便是对应成功返回的数据：如商品列表调用

```js
const {goods, total} = res
```

使用 ES7  async - await

则需要创建 runtime.js 插件，否则会报出 **regeneratorRuntime** 的错误

runtime.js 插件内容，需在 [regenerator/packages/regenerator-runtime/runtime.js]( https://github.com/facebook/regenerator/blob/5703a79746fffc152600fdcef46ba9230671025a/packages/regenerator-runtime/runtime.js) Copy

最后，在调用封装 request.js 的地方，同样地引入该插件

```js
import regeneratorRuntime from '../../lib/runtime/runtime.js';
```

async - await 的使用，如商品列表

```js
async getGoodData(){
    // 调用接口传参
    const res = await request({url: '/goods/search', data: this.queryParams})

    const {goods, total} = res

    // 总页数
    this.total = Math.ceil(total / this.queryParams.pagesize)
    // 旧数据,上拉触底时显示的数据应该是之前的加上当前页的数据
    const oldData = this.data.goodData
    // 设置数据
    this.setData({
        goodData: [...oldData, ...goods]
    })
    // console.log(goods, this.total)

    // 关闭下拉刷新
    wx.stopPullDownRefresh()
}
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
getGoodData(){
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
    this.queryParams.cid = cid
    this.getGoodData(cid)
}
```

根据返回的数据，渲染结构

```html
<!-- tab组件开始 -->
<goodsTab tabTitle="{{tabTitle}}" currentIndex="{{currentIndex}}" bindgetTabIndex="getTabIndex">
    <view wx:if="{{currentIndex === 0}}">
        <view class="goodsItem" wx:for="{{goodData}}" wx:key="goods_id">
            <navigator url="/pages/goods_detail/index?goods_id={{item.goods_id}}">
                <!-- 图片 -->
                <view class="goodsItemImg">
                    <image mode="widthFix" src="{{item.goods_small_logo || 'http://img3.imgtn.bdimg.com/it/u=62131398,3721023975&fm=26&gp=0.jpg'}}"></image>
                </view>
                <!-- 内容 -->
                <view class="goodsItemCont">
                    <view class="goodsItemContTitle">{{item.goods_name}}</view>
                    <view class="goodsItemContPrice">￥{{item.goods_price}}</view>
                </view>
            </navigator>
        </view>
        <!-- 上拉触底显示 -->
        <view class="ReachBottomTip" wx:if="{{isBtmShow}}">------ 嗯哼,本宝宝也是有底线的 -----</view>
    </view>
    <view wx:elif="{{currentIndex === 1}}">1</view>
    <view wx:else>2</view>
</goodsTab>
<!-- tab组件结束 -->
```

#### 6.3 上拉触底滚动下一页 ####

设置变量 total 总页数，在调用接口时计算出总页数

```js
// getGoodData 方法中
// 总页数
this.total = Math.ceil(total / this.queryParams.pagesize)
```

通过上拉触底事件，判断传入的参数页数（pagenum）是否大于 总页数

是，则没有数据了，需给出提示 （wx.showToast）

否，则 传入的参数页数自增，并调用获得商品列表的参数（此时显示有bug）

bug：上拉触底下一页时只会显示当前页的数据，并不会显示之前加上当前页的数据

解决：在调用接口方法中，设置显示的列表数据为：之前页的数据 + 当前页数据

```js
getGoodData(){
    // 调用接口传参
    request({url: '/goods/search', data: this.queryParams})
        .then(res => {
        // console.table(res.data.message.goods)
        const {goods, total} = res.data.message
        // 总页数
        this.total = Math.ceil(total / this.queryParams.pagesize)
        // 旧数据,上拉触底时显示的数据应该是之前的加上当前页的数据
        const oldData = this.data.goodData
        // 设置数据
        this.setData({
            goodData: [...oldData, ...goods]
        })
        console.log(goods, this.total)
    })
}
```

设置在页面触底时没有数据时，在页面显示 ‘嗯哼,本宝宝也是有底线的’ 的文字

则

1.在data中设置变量 isBtmShow: false 

2.在页面上加上显示该行文字的结构，并设置判断 isBtmShow

3.在触底没有数据时，设置 isBtmShow: true

```html
view class="ReachBottomTip" wx:if="{{isBtmShow}}">------ 嗯哼,本宝宝也是有底线的 -----</view>
```

```js
// 触底提示显隐(data中)
isBtmShow: false,
```

上拉触底全部代码

```js
// 上拉触底
onReachBottom: function() {
    // 判断是否还有下一页
    if(this.queryParams.pagenum >= this.total){
        // 提示
        wx.showToast({
            title: '你将失去你的宝宝.........没有更多数据了噢..........',
            icon: 'none'
        })
        // 显示
        this.setData({
            isBtmShow: true
        })
    }else{
        // 还有
        this.queryParams.pagenum++
        this.getGoodData()
    }
}
```

#### 6.4 下拉刷新 ####

在页面配置中设置 **enablePullDownRefresh: true** ，设置下拉样式 **backgroundTextStyle：“drak”**

设置下拉刷新事件 onPullDownRefresh

```js
// 下拉刷新
onPullDownRefresh(){
    // 重置页码
    this.queryParams.pagenum = 1
    // 重置数据
    this.setData({
        goodData: []
    })
    // 调用接口
    this.getGoodData()
}
```

bug：页面数据加载完成时，下拉刷新并没有同步关闭

解决：在调用商品列表接口的方法中，设置 获得数据成功时关闭下拉刷新

```js
// getGoodData 中
// 关闭下拉刷新
wx.stopPullDownRefresh()
```

### 7 商品详情 ###

#### 7.1 商品轮播图 ####

同首页轮播图一样设置，略

#### 7.2 商品图片预览 ####

设置图片点击事件及传入的当前图片地址 （data-current="{{item.pics_mid}}"）

```html
<view class="detailSwiper">
    <swiper autoplay indicator-dots circular bindtap="handleTap">
        <swiper-item wx:for="{{detailData.pics}}" wx:key="pics_id">
            <image mode="widthFix" src="{{item.pics_mid}}" data-current="{{item.pics_mid}}"></image>
        </swiper-item>
    </swiper>
</view>
```

调用 wx.previewImage API 获得所需的参数，传入参数即可

```js
handleTap(e){
    // console.log(this.data.detailData,e)
    const {current} = e.target.dataset
    const urls = this.data.detailData.pics.map(v => v = v.pics_mid)
    wx.previewImage({
        current, // 当前图片路径
        urls // 图片数组
    })
}
```

#### 7.3 商品详情数据渲染 ####

注意：富文本区域的渲染用 rich-text

```html
<!-- 价格开始 -->
<view class="detailPrice">￥ {{detailData.goods_price}}</view>
<!-- 价格结束 -->
<!-- 商品名字及收藏开始 -->
<view class="detailTitle">
    <view class="detailName">{{detailData.goods_name}}</view>
    <view class="detailCollect">
        <text class="iconfont icon-shoucang collectIcon"></text>
        <text>收藏</text>
    </view>
</view>
<!-- 商品名字及收藏结束 -->
<!-- 图文详情开始 -->
<view class="detailInfo">
    <view class="detailInfoTitle">图文详情</view>
    <rich-text nodes="{{detailData.goods_introduce}}"></rich-text>
</view>
<!-- 图文详情结束 -->
```

#### 7.4 底部工具栏 ####

自定义工具栏：联系客服 - 分享 - 购物车 - 加入购物车 - 立即购买

注意：

1.联系客服、分享，其实是 button 属性设置

2.导航至购物车，需设置 navigator 属性 open-type 为跳转到 tabBar 页面的合法值（switchTab）

```html
<!-- 底部工具栏开始 -->
<view class="btmToolBar">
    <view class="btmToolBarItem contact">
        <button open-type="contact"></button>
        <text class="iconfont icon-kefu btmToolBarIcon"></text>
        <text>联系客服</text>
    </view>
    <view class="btmToolBarItem share">
        <button open-type="share"></button>
        <text class="iconfont icon-yixianshi- btmToolBarIcon"></text>
        <text>分享</text>
    </view>
    <navigator open-type="switchTab" url="/pages/cart/index" class="btmToolBarItem shoppingCart">
        <text class="iconfont icon-gouwuche btmToolBarIcon"></text>
        <text>购物车</text>
    </navigator>
    <view class="btmToolBarItem addCart">
        <text>加入购物车</text>
    </view>
    <view class="btmToolBarItem rightBuy">
        <text>立即购买</text>
    </view>
</view>
<!-- 底部工具栏结束 -->
```

#### 7.5 加入购物车 ####

点击加入购物车，设置对应的点击事件

事件需处理操作：

1.需设置购物车所需的数据，将数据追加到数组中，并设置本地存储

2.在设置本地存储前，2.1需判断本地是否有数据

2.2获得商品数据

2.3根据本地的数据，判断本地数据是否包含该商品数据，通过 findIndex 判断对应商品id返回存储在本地的索引(index)

2.4判断 索引 

2.4.1若 index === -1时，则表示不存在该商品数据，则需将数据追加到本地

2.4.2否则，根据索引将存储在本地的对应商品的数据的购买数量自增

```js
/* 加入购物车 */
handleAddCart(){
    // 将购物车所需的参数收集，存储至本地
    // 在存储本地时，需判断是否有数据，没有则为  []
    // 存储时，需判断本地是否有一致数据，若有，则 数量 + 1

    // 获得商品数据
    const {detailData} = this.data
    // console.log(this.data) 

    // 判断是否有本地数据
    let cartData = wx.getStorageSync('shoppingCartData') || [];
    // 判断本地是否包含该商品数据，返回index
    let index = cartData.findIndex(v => v.id === detailData.goods_id)

    // 判断是否 index
    if(index === -1){
        // 不存在该商品数据
        cartData.push({
            id: detailData.goods_id,
            goods_name: detailData.goods_name,
            goods_small_logo: detailData.goods_small_logo,
            goods_price: detailData.goods_price,
            buy_num: 1
        })

        // 提示 添加成功
        wx.showToast({
            title: '商品添加成功噢...',
            mask: true
        })
    }else{
        // 存在
        // 提示 添加成功, 防止用户频繁点击添加
        wx.showToast({
            title: '商品添加成功噢...',
            mask: true
        })
        cartData[index].buy_num ++
    }
    // 存储至本地
    wx.setStorageSync('shoppingCartData', cartData)
}
```

#### 7.6 收藏功能 ####

加入点击收藏事件

收藏的逻辑是：

**若该商品在缓存中已收藏，则移除该商品在缓存中的数据（即取消收藏）**

**若未收藏，则将该商品数据追加到缓存中**

1. 将该商品加到缓存中（collect）

   1.1 先获得缓存中（collect）的数据，及该商品数据

   1.2 根据 goods_id 找出缓存中是否包含该商品数据的索引

   1.3 判断 索引

   ​	1.3.1 索引 === -1（不存在）则为收藏，需将商品追加到缓存中，并提示

   ​	1.3.2 否则是取消收藏操作，根据 索引 移除在缓存中该商品数据，并提示

   ```js
   /* 点击收藏 */
   async handleCollect(){
       // 获得该商品详情的数据
       let {detailData} = this.data
       // 获得缓存中的收藏的数据
       let localCollectData = wx.getStorageSync('collect') || []
       // 判断缓存中是否存在该商品详情的数据
       let index = localCollectData.findIndex(v => v.goods_id === detailData.goods_id)
   
       if(index !== -1){
           // 存在
           localCollectData.splice(index, 1)
           // 提示
           await showToast({title: '取消收藏', icon: 'none', mask: true})
       }else{
           localCollectData.push(detailData)
           // 提示
           await showToast({title: '收藏成功', mask: true})
       }
       // 将对应商品存入缓存
       wx.setStorageSync('collect', localCollectData)
   }
   ```

2. 设置收藏图标是否高亮显示

   2.1 设置一个布尔值变量 isCollect: false

   2.2 在对应图标根据 布尔值变量切换样式的类选择器

   2.3 在点击收藏事件中

   ​	2.3.1 当索引 === -1 设置 布尔值变量为 true

   ​	2.3.2 否则，设置 布尔值变量为 false

   ​	2.3.3 设置 收藏是否高亮显示，页面重加载时的正确显示

   ​	在 调用详情的接口方法，判断本地是否存在该商品数据，是则高亮，否则相反

   **页面设置**

   ```html
   <view class="detailCollect" bindtap='handleCollect'>
       <text class="iconfont {{isCollect ? 'icon-shoucang1' : 'icon-shoucang'}} collectIcon"></text>
       <text>收藏</text>
   </view>
   ```

   **点击收藏事件**

   ```js
   if(index !== -1){
       // 存在
       localCollectData.splice(index, 1)
       // 提示
       await showToast({title: '取消收藏', icon: 'none', mask: true})
       // 未收藏显示
       this.setData({isCollect: false})
   }else{
       localCollectData.push(detailData)
       // 提示
       await showToast({title: '收藏成功', mask: true})
       // 收藏显示
       this.setData({isCollect: true})
   }
   ```

   **调用详情的方法**

   ```js
    /* 设置调用详情的接口方法 */
   async getDetailData(goods_id){
       const res = await request({url: '/goods/detail', data:{goods_id}})
       // console.table(res.data.message)
       this.setData({
           detailData: res
       })
   
       // 是否收藏
       // 获得该商品详情的数据
       let {detailData} = this.data
       // 获得缓存中的收藏的数据
       let localCollectData = wx.getStorageSync('collect') || []
       // 判断缓存中是否存在该商品详情的数据
       let index = localCollectData.findIndex(v => v.goods_id === detailData.goods_id)
   
       this.setData({
           isCollect: index === -1 ? false : true
       })
   }
   ```

### 8 购物车 ###

#### 8.1 购物车页面结构 ####

添加地址 + 地址显示 + 购物车数据结构渲染 + 工具栏 

#### 8.2 收货地址逻辑 ####

通过 API 来获得收货地址	--	wx.getSetting、wx.openSetting、wx.chooseAddress

若是只用 wx.chooseAddress，当第一次获得通讯地址权限时，按取消后，再按则无法触发

在 request.js 封装调用异步 API 方法

```js
// 当前设置
export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        }); 
    })
}

// 打开设置 调起客户端小程序设置界面，返回用户设置的操作结果
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        }); 
    })
}

// 用户收货地址
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        }); 
    })
}
```

cart/index.js 

点击获得**收货地址**按钮

获得当前设置的状态，通过判断该状态是否等于 false, 是，则调用打开设置的异步方法

调用获得用户收货地址的异步方法，设置渲染结构所需数据，赋值给设置接收的变量，并保存至本地

```js
async handleGetAddress(){
    try{
        // 点击获得用户当前设置
        const res1 = await getSetting()
        // 获得设置的状态
        let auth = res1.authSetting['scope.address']
        // 判断状态，若是 false, 打开设置
        if(auth === false){
            await openSetting()
        }
        // 收货地址信息
        const res2 = await chooseAddress()
        // 设置 详细收获地址
        res2.detailAddress = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo
        // 赋值
        this.setData({
            address: res2
        })
        // 存入本地
        wx.setStorageSync("cartAddress", res2);
    }
    catch(error){
        return
    }
}
```

通过使用 页面显示 的生命周期 加载数据

注意：address在data中定义为空对象，而在获得本地数据时，address没有数据时，则为空字符串，不需要使用开关思想 （||），否则渲染的时候会出错

```js
onShow: function (options) {
    // 本地数据
    let shoppingCartData = wx.getStorageSync('shoppingCartData') || [];
    let address = wx.getStorageSync('cartAddress')
    // 设置
    this.setData({
        shoppingCartData, address
    })
}
```

#### 8.3 计算总价及总数量 ####

通过设置一个函数来计算总价及总数量 - getTotalPriceAndNum()

在 onShow 调用该函数并传入购物车数据

通过确认复选框的选中，来计算勾选了的总价及总数量

```js
/* 计算总价及总数 */
getTotalPriceAndNum(cartData){
    // 默认全选选中状态, 若一个未选中则全选不勾选
    let isAllChecked = true
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
        }else{
            isAllChecked = false
        }
    })

    // 赋值
    this.setData({
        totalPrice,
        totalNum,
        isAllChecked
    })
}
```

#### 8.4 单选勾选逻辑 ####

设置单选勾选事件及传入对应的点击的索引

```html
<checkbox-group bindchange="handleCheckBox" data-index="{{index}}"><checkbox checked="{{item.checked}}"></checkbox></checkbox-group>
```

通过该事件(handleCheckBox)，获得点击的索引。

获得购物车数据，通过索引 对 对应的索引数据里的checked属性取非，设置是否勾选中

然后重新赋值、存入本地

最后再计算对应的总价及总数量

```js
/* 单选 */
handleCheckBox(e){
    // 点击对应的复选项，更改对应的 checked
    // 对应点击的索引
    const {index} = e.target.dataset
    // 购物车数据
    const {shoppingCartData} = this.data
    // 根据索引修改
    shoppingCartData[index].checked = !shoppingCartData[index].checked
    // 重新赋值
    this.setData({
        shoppingCartData
    })
    // 本地
    wx.setStorageSync("shoppingCartData", shoppingCartData)
    // 重新计算
    this.getTotalPriceAndNum(shoppingCartData)
}
```

#### 8.5 全选逻辑 ####

设置全选点击事件(handleAllCheckBox)

获得购物车数据，遍历每一项，将每一项的 checked 为是否选中的全选变量（isAllChecked）取反

更新数据、存入本地、再计算

 ```js
/* 全选 */
handleAllCheckBox(){
    let {shoppingCartData, isAllChecked} = this.data
    // 遍历数据
    shoppingCartData.forEach(v => {
        v.checked = !isAllChecked
    })
    // 重新赋值
    this.setData({
        shoppingCartData,
        isAllChecked: !isAllChecked
    })
    // 本地
    wx.setStorageSync("shoppingCartData", shoppingCartData)
    // 重新计算
    this.getTotalPriceAndNum(shoppingCartData)
}
 ```

#### 8.6 购买数量的加减 ####

通过 加、减按钮添加点击事件，并传入引入及运算的规则

获得购物车数据

通过判断运算规则的值 operator

若是 -1，还需要考虑当 购买数量等于 1时的情况

等于 1时，则判断条件就加多一条条件：购物车数据对应项的购买数量等于1

则为 删除 操作，应弹窗提示，这里 在 request.js 封装 弹窗(showModal)的异步方法

最后，根据索引对购物车数据对应项进行删除操作

若是 1，则 购物车数据对应项的购买数量 + 1

```js
async handleChangeNum(e){
    // 获得点击的索引及运算
    const {index, operator} = e.target.dataset
    // 获得购物车数据
    const {shoppingCartData} = this.data

    // 判断是加还是减
    // 若是减，当 购买数量为 1 时，应提示是否删除
    if(operator === -1 && shoppingCartData[index].buy_num === 1){
        // 减
        const res = await showModal({title: '删除提示', content: '您确定要残忍删除该商品吗？'})
        if(res){
            // 确定
            shoppingCartData.splice(index, 1)
        }else{
            // 取消
            return
        }
    }
    else{
        // 加
        shoppingCartData[index].buy_num += operator
    }

    // 重新赋值
    this.setData({
        shoppingCartData
    })
    // 本地
    wx.setStorageSync("shoppingCartData", shoppingCartData)
    // 重新计算
    this.getTotalPriceAndNum(shoppingCartData)
}
```

 bug：当商品全部删除后，全选还是勾选的

解决：在赋值前，判断 购物车数据长度是否为0

```js
isAllChecked = cartData.length === 0 ? false : isAllChecked

// 赋值
this.setData({
    totalPrice,
    totalNum,
    isAllChecked
})
```

#### 8.7 结算处理 ####

点击 结算 按钮

判断购买总数等于0情况处理，即用户未添加商品，给予提示

判断地址等于空情况处理，即用户未填收货地址，给予提示

前边两种情况都不符合，跳转至结算页面

```js
async handleCartPay(){
    const {totalNum, address} = this.data
    // 判断购物数据是否为空
    if(totalNum === 0){
        await showToast({
            title: '您还没有选购商品噢...',
            icon: 'none'
        })
        return
    }
    // 判断收货地址是否填写
    if(address === ''){
        await showToast({
            title: '您还没有增加收货地址噢...',
            icon: 'none'
        })
        return
    }

    // 跳转
    wx.navigateTo({
        url: '/pages/pay/index',
    })
}
```

全选按钮处理：当购买总数等于0时，禁止点击

```html
 wx:hidden="{{totalNum === 0 ? 'disabled' : 'disabled=false'}}"
```

### 9 支付 ###

#### 9.1 支付页面结构 ####

在监听页面显示事件中，通过过滤缓存中的数据 **checked === true** 获得支付页面商品数据

#### 9.2 授权页面 ####

使用 button 设置 `open-type='getUserInfo'`  结合 `bindgetuserinfo` 获取到用户信息，获得调用后台接口所需要的参数

调用 `wx.login(Object object)` 接口获取登录凭证（code）

调用后台接口，通过 post 方式，传入对应的参数，获得 token，并将 token 存到缓存中

```js
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
    // 调用接口所需参数存入对象中
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
```

#### 9.3 支付页面-支付逻辑 ####

点击 支付按钮 调用 封装的支付逻辑 的方法

支付逻辑方法 - wxTopay （async-await + try-catch）

1. 判断是否存在 token, 否则 跳转至 授权页

2. 创建订单 - 调用创建订单接口，获得订单编号

   2.1 获得创建订单所需的参数，将所需的参数存入一个对象中

   2.2 调用创建订单接口，通过 post 方式，传入该对象

3. 调用预支付订单接口，传入 获得的  --  订单编号，获得返回的对象参数（pay）

4. 调用微信支付api，传入 获得的 对象参数（pay）

5. 调用查看订单的支付状态接口，传入 --  订单编号，返回一个提示信息（message)

6. 提示showToast

7. 删除在缓存中支付了的商品数据

   7.1 可根据 filter方法，筛选缓存中 checked === false 的数据

   7.2 重置缓存中的数据

8. 1 跳转至订单页

```js
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
```

由于调用以上的后台接口都需要在请求头传入token，且它们的 url 有个共同点，即都包含着 ‘/my/’

​	 /my/orders/create

​	/my/orders/req_unifiedorder

​	/my/orders/chkOrder

所以可以在封装的 request.js 中设置，若 url 存在 ‘/my/’，则加入请求头

```js
export const request = (params) => {
    requestTwice ++
    // 加载
    wx.showLoading({
        title: '数据加载中...',
        mask: true
    })

    // 设置 请求头 
    // 若 params.header 为undefined, 展开 undefied 为空对象
    let header = {...params.header}
    // 获得 token
    const token = wx.getStorageSync('token')
    // 查找 url 是否包含 /my,有则加入token
    if(params.url.includes('/my/')){
        header = { ...params.header, ...{Authorization: token}}
    }

    // promise + 调用
    return new Promise((resolve, reject) => {
        // 设置基准路径
        const baseUrl = 'https://api.zbztb.cn/api/public/v1'
        wx.request({
            ...params,
            // 覆盖url
            url: baseUrl + params.url,
            header,
            success: (res) => {
                resolve(res.data.message)
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

#### 9.4 点击支付遇到的bug ####

在 request.js 中，封装的 showToast 方法，没有设置成功时的回调

在扫完支付二维码时，提示了支付成功后，并没有执行提示下面的代码

**没有加成功时的回调**

```js
export const showToast = (params) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            ...params
        })
    })
}
```

**修改**

```js
export const showToast = (params) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            ...params,
            success: (result) => {
                resolve(result)
            }
        })
    })
}
```

### 10 商品搜索 ###

使用 bindinput 获得 输入框输入的内容

调用搜索接口，由于使用 async-await 异步调用接口，async 不能加在 bindinput绑定的事件（inputSearch），否则会出错，所以 封装个方法（getSearchData）来调用搜索接口

通过 bindinput绑定的事件（inputSearch）获得 输入的内容，使用封装调用搜索接口的方法（getSearchData）传入 输入的内容参数

设置个防抖变量（data外），通过一次性定时器来处理防抖bug

设置个布尔值变量（isShowCancel），来设置 取消按钮的显示与隐藏

```js
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
```

### 11 订单 ###

#### 11.1 自定义tab ####

#### 11.2 订单结构渲染 ####

### 12 个人中心 ###

#### 12.1 页面结构 ####

#### 12.2 头像显示 ####

### 13 用户反馈 ###

#### 13.1 页面结构 ####

#### 13.2 反馈图片选择 ####

设置 图片选择 按钮，并且上传的图片显示区域在上传按钮后面，创建图片显示的组件（uploadImg），通过遍历 选择图片 数组，将每一项（item）传值传到 组件中（uploadImg）

选择图片通过 wx.chooseImage() api

```html
<view class="questionContent">
    <textarea placeholder="请描述一下您的问题..."></textarea>
	// 按钮 + 图片显示区域
    <view class="questionUploadImgWrap">
        <button class="questionUploadImgBtn" bindtap="handleUploadImg">+</button>
        <view class="questionUploadImg" wx:for="{{chooseImages}}" wx:key='*this'>
            <uploadImg src="{{item}}"></uploadImg>
        </view>
    </view>
</view>
```

```js
// 选择图片按钮事件
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
}
```

