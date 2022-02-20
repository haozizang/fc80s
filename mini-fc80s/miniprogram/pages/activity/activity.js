const app = getApp();

Page({
    data: {
        p_can_use: wx.canIUse('button.open-type.getUserInfo'),
        p_is_ready: false,
    },

    // onLoad 小程序启动时调用
    onLoad: function () {
        console.log("call onLoad")
        var c_is_ready = wx.getStorageSync("c_is_ready");
        if (!c_is_ready) {
            return
        }
        this.setData({
            p_is_ready: c_is_ready,
        })
    },

    // onShow 每次页面切换时调用
    onShow: function () {
    },

    // 获取用户信息
    bindGetUserInfo: function (event) {
        let o = event.detail || {};
        if (o.userInfo) {
            wx.navigateTo({
                url: '/pages/post/post'
            });
        }
    }
})