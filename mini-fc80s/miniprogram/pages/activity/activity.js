const app = getApp();

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isLogin: false,
    },
    // onShow 每次页面切换时调用
    onShow: function () {
        this.setData({
            isLogin: app.globalData.isLogin
        })
        console.log(this.data.isLogin)
    }
})