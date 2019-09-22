## shopping_project_WeChat ##

### 1 项目目录结构 ###

|---- shopping_project_WeChat

​	|---- components

​			|---- indexSearch（首页搜索）

​	|---- pages

​			|---- index （首页）

​			|---- category（分类页面 ）

​			|---- goods_list（商品列表页面 ）

​			|---- goods_detail（商品详情页面) 

​			|---- cart（购物车页面)   

​			|---- collect（收藏页面）    

​			|---- order（订单页面）

​			|---- search（搜索页面）

​			|---- user （个人中心页面）

​			|---- feedback（意见反馈页面）

​			|---- login（登录页面） 

​			|---- auth（授权页面）

​			|---- pay（结算页面）

​	|---- icons

​	|---- styles

​			|---- iconfont.wxss（字体图标样式）

### 2 自定义 tabBar ###

"tabBar":{

​    "color": "#666",	// 字体颜色

​    "selectedColor": "#cf3a50",	// 激活后的字体颜色

​    "list":[

​      {

​        "pagePath": "pages/index/index",	// 页面地址

​        "text": "首页",			// 标签页的标题

​        "iconPath": "icons/tab_home_nor@3x.png",	// 图标路径

​        "selectedIconPath": "icons/tab_home_fill@3x.png"	// 激活后的图标路径

​      }, ……

​	]

}

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

