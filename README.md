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

swiper 的坑：swiper默认高度 150px，需设置对应的 rpx

原稿图片的宽 / 原稿图片的高 = 变化后图片的宽 / 变化后图片的高

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

变化后图片的高 =  原稿图片的高  / 2 * 变化后图片的宽 / 3  / 原稿图片的宽 

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

### 4 封装调用接口 ###

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

**设置封装调用分类接口方法，设置变量接收数据**

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

