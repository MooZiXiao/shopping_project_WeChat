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
