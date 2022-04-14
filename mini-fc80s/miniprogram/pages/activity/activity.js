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
        if (!c_user_info) {
            wx.showToast({
                title: `无法获取user_info`,
                icon: 'none'
            });
            return
        }
        this.setData({
            p_user_info: c_user_info,
        })

        var that = this;
        // TODO 直接从后端加载活动(放缓存若别人更新则无法显示新添加的活动)
        wx.request({
            url: 'http://127.0.0.1:8000/activity/get_team_acts/',
            header: { "content-type": "application/json" },
            method: "POST",
            data: {
                open_id: that.data.p_openid,
                nick_name: that.data.p_user_info.nickName
            },
            success: function (res) {
                console.log("res: ", res)
                that.setData({
                    tst_act_list: res.data.activities,
                })
            }
            ,fail: function (res) {
                // 请求失败弹出提示框 popup
                wx.showModal({
                    title: '错误',
                    content: "请求活动数据失败"
                });
            }
        })
        // TODO 提供下拉加载活动功能
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
