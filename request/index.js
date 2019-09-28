// 同时发送异步请求的次数
let requestTwice = 0

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

// 弹窗
export const showModal = (params) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            ...params,
            success: (res) => {
                resolve(res.confirm)
            },
            fail: (err) => {
                reject(err)
            }
        }); 
    })
}

// 提示
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
  
// 获取登录凭证
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout:10000,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
           
    })
}

// 微信支付 api
export const requestPayment = (params) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...params,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
           
    })
}