const app = getApp();

Page({
    data: {
        p_can_use: wx.canIUse('button.open-type.getUserInfo'),
        p_is_login: false,
    },
    // onShow 每次页面切换时调用
    onShow: function () {
        this.setData({
            isLogin: app.globalData.g_is_login
        })
    }
})