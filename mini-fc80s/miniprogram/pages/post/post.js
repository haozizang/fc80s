
const app = getApp();

Page({
    data: {
        // 解决textarea组件在表单提交时无法获取内容的BUG
        content: '',
        // 保存用户信息
        userInfo: {},
        // 内容大小限制为200字符
        contentSize: 0,
        // 活动集合
        scenes: ["练习赛", "比赛", "团建"],
        // 默认的活动
        scene_ind: 0,
        // 上传文件-文件列表
        files: [],
        fileID: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 当前版本不支持小程序云函数
        if (!wx.cloud) {
            wx.showModal({
                title: '提示',
                content: '微信版本过低，请升级微信'
            });
            return;
        }

        wx.setNavigationBarTitle({
            title: '发起活动'
        });

        // 获取用户信息
        wx.getUserInfo({
            lang: 'zh_CN',
            success: this.getUserInfoSuccess
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**
     * 选择活动
     */
    bindSceneChange: function(e) {
        // console.log('Scenes:', e.detail.value);
        this.setData({
            scene_ind: e.detail.value,
            fileID: ''
        })
    },
    
    /**
     * 提交数据
     */
    bindSubmit: function(e){
        if(!app.globalData.g_is_ready) {
            wx.showModal({
                title: '提示',
                content: '发布失败，请先登录'
            });
            return;
        }
        console.log('event: ', e)
        let data = e.detail ? e.detail.value : {};
        let userInfo = this.data.userInfo;
        // 解决textarea组件在表单提交时无法获取内容的BUG
        data.content = this.data.content;
        // 图片
        data['fileID'] = this.data.fileID;
        // 增加用户信息
        data['nickName'] = userInfo.nickName;
        data['avatarUrl'] = userInfo.avatarUrl;
        data['city'] = userInfo['city'];
        data['country'] = userInfo['country'];
        data['gender'] = userInfo['gender'];
        data['language'] = userInfo['language'];
        // 检验表单数据
        if (data['max_mem'] < 0 || data['max_mem'] > 1000){
            wx.showToast({
                title: '超出报名上限（1~1000）',
                icon: 'none'
            });
            return;
        }
        if(!data['act_name']) {
            wx.showToast({
                title: data['scene_ind'] == 0 ? '请输入比赛主题' : '请输入活动名称',
                icon: 'none'
            });
            return;
        }
        if (parseInt(data['scene_ind']) === 1 && !data['fee']) {
            wx.showToast({
                title: '请输入活动费用',
                icon: 'none'
            });
            return;
        }
        if (!data['content']) {
            wx.showToast({
                title: data['scene_ind'] == 0 ? '请输入比赛内容' : '请输入活动描述',
                icon: 'none'
            });
            return;
        }

        // 全局显示loading
        wx.showLoading({
            title: '提交中...',
        });
        // var act_create_time = new Date().getTime()
        var that = this;
        console.log('last data: ', data)
        // 与后端交互
        if (app.globalData.g_openid) {
            console.log("DBG: g_openid found")
        }
        wx.request({
            url: 'http://127.0.0.1:8000/activity/create/',
            header: { "content-type": "application/json" },
            method: "POST",
            data: {
                open_id: app.globalData.g_openid,
                scene_ind: data.scene_ind,
                max_num: data.max_mem,
                act_name: data.act_name,
                content: that.data.content,
                act_time: new Date().getTime(),
            },
            success: function (res) {
                console.log("res:", res)
                if (res.data["code"] == 0) {
                    console.log("created activity")
                } else {
                    console.log("failed to create activity")
                }
            }
            ,fail: function (res) {
                // 请求失败弹出提示框 popup
                console.log("res: ", res)
                wx.showModal({
                    title: '错误',
                    content: "创建活动的请求失败"
                });
            }
            ,complete: function() {
                // complete 总会执行
                wx.hideLoading()
                /*
                定时功能
                setTimeout(() => wx.hideLoading(), 2000)
                */
            }
        })
    },

    /**
     * 计算内容长度
     */
    bindInput: function(e){
        let v = e.detail ? e.detail.value : '';
        this.setData({
            content: v,
            contentSize: v.length
        });
        // console.log(e);
    },

    /**
     * 获取用户信息
     */
    getUserInfoSuccess: function(res){
        const userInfo = res.userInfo || {};
        // console.log(userInfo);
        this.setData({
            userInfo: userInfo
        });

        // console.log(this.data.userInfo);
    },
})
