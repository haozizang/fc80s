const app = getApp();

Page({
    data: {
        // p_can_use: wx.canIUse('button.open-type.getUserInfo'),
        // 暂时用来测试的数据
        tst_act_list: [
            {
                "name": "act1",
                "time": "2024"
            },
            {
                "name": "act2",
                "time": "2027"
            },
        ],

        p_is_ready: false,
    },

    // onLoad 小程序启动时调用
    onLoad: function () {
        console.log("[activity.js] call onLoad")
        var c_is_ready = wx.getStorageSync("c_is_ready");
        if (!c_is_ready) {
            return
        }
        this.setData({
            p_is_ready: c_is_ready,
        })
        var c_user_info = wx.getStorageSync("c_user_info");
        console.log('user_info', c_user_info)
        if (c_user_info) {
            this.setData({
                p_user_info: c_user_info,
            })
        } else {
            console.warn("[activity.js] can't get user_info from local cache!")
        }
    },

    // onShow 每次页面切换时调用
    onShow: function () {
        if (app.globalData.g_is_ready) {
            this.setData({
                p_is_ready: true,
            })
        }
    },

    // 获取用户信息
    bindGetUserInfo: function (event) {
        let o = event.detail || {};
        if (o.userInfo) {
            wx.navigateTo({
                url: '/pages/post/post'
            });
        }
    },

    //获取当前滑块的index
    bindTabChange:function(e){
        const that = this;
        that.setData({
            cur_tab: e.detail.current
        })
    },

    //点击切换，滑块index赋值
    checkCurrent:function(e){
        const that = this;
        if (that.data.cur_tab === e.target.dataset.current){
            return false;
        } else {
            that.setData({
                cur_tab: e.target.dataset.current
            })
        }
    }
})
