/**
 * 小程序入口文件
 */
App({
    onLaunch: function() {
        console.log("### App::onLaunch start...")
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'soccer-tally-197',
                traceUser: true,
            });
        }

        // 全局数据 globalData
        this.globalData = {
            isLogin: false
        }

        // 查询授权
        // wx.getSetting({
        //     // success: this.getAuthSetting,
        //     fail: function(res) {
        //         console.log('查询授权失败');
        //     },
        //     complete: function(res){
        //         console.log('查询授权完成');
        //     console.log("isLogin: ", res)
        //     }
        // });
    },

    getRealName: function (res) {

    }

    // 获取授权信息；scope.userInfo 接口已废弃
    // getAuthSetting: function (res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //         // 没有授权
    //         this.globalData.isLogin = false;
    //     } else {
    //         this.globalData.isLogin = true;
    //     }
    // },
})