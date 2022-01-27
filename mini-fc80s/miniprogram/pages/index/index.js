// 小程序首页
const app = getApp();

// 雷达图的图形尺寸
var numCount = 6;
var numSlot = 5;
var mW = 400;
var mH = 400;
var mCenter = mW / 2; //中心点
var mAngle = Math.PI * 2 / numCount; //角度
var mRadius = mCenter - 60; //半径(减去的值用于给绘制的文本留空间)
//获取Canvas
var radCtx = wx.createCanvasContext("radarCanvas")


Page({
    data: {
        p_can_use: wx.canIUse('button.open-type.getUserInfo'),
        p_is_ready: false,
        p_user_info: {},
        p_openid: '',
        // business data
        p_user_profile: {
            activities: 0,
            matches: 0,
            ability_array: [["稳定", 0], ["防守", 0], ["热情", 0], ["荣誉", 0], ["进攻", 0], ["胜率", 0]],
        }
    },

    // onLoad 小程序启动时调用
    onLoad: function () {
        console.log("call index.onLoad")
        var c_is_ready = wx.getStorageSync("c_is_ready");
        if (!c_is_ready) {
            return
        }
        this.setData({
            p_is_ready: c_is_ready,
        })
        var c_user_info = wx.getStorageSync("c_user_info");
        if (c_user_info == true) {
            this.setData({
                p_user_info: c_user_info,
            })
        }
        console.log('user_info', c_user_info)
        var c_openid = wx.getStorageSync("c_openid");
        if (c_openid) {
            this.setData({
                p_openid: c_openid,
            })
        }
        var c_user_profile = wx.getStorageSync("c_user_profile");
        if (c_user_profile) {
            this.setData({
                p_user_profile: c_user_profile,
            })
        } else {
            this.getUserProfile()
        }
        this.drawRadar()
    },

    onGotUserInfo(res) {
        console.log("call index.onGotUserInfo")
        this.setData({
            p_user_info: res.detail.userInfo,
            p_is_ready: true,
        })
        wx.setStorageSync('c_is_ready', true)
        wx.setStorageSync('c_user_info', this.data.p_user_info)
        // reload after auth
        this.onLoad();
    },

    getOpenId() {
        console.log("call index.getOpenId")
        var that = this;
        // 获取，保存 openid
        // 云函数调用为异步
        wx.cloud.callFunction({
            name: 'getOpenID',
            success: function (res) {
                var local_openid = res.result.openid
                console.log('result:', res.result)
                /* 弹出提示框
                wx.showModal({
                    title: '提示',
                    content: local_openid
                }); */
                app.globalData.g_openid = local_openid
                that.setData({
                    p_openid: local_openid
                })
                wx.setStorageSync('c_openid', local_openid)
            },
        })
    },

    // get from server
    getUserProfile() {
        console.log("call index.getUserProfile")
        console.log("nickName: ", this.data.p_user_info)
        var that = this;
        // 与后端交互
        wx.request({
            url: 'http://127.0.0.1:8000/index/',
            header: { "content-type": "application/json" },
            method: "POST",
            data: {
                open_id: that.data.p_openid,
                nick_name: that.data.p_user_info.nickName
            },
            success: function (res) {
                that.setData({
                    ['p_user_profile.matches']: res.data.matches,
                    ['p_user_profile.activities']: res.data.activities,
                    ['p_user_profile.ability_array']: [["稳定", res.data.stability], ["防守", res.data.defence], ["热情", res.data.passion], ["荣誉", res.data.teamwork], ["进攻", res.data.offence], ["胜率", res.data.win_ratio]]
                })

                wx.setStorageSync('c_user_profile', that.data.p_user_profile)
                console.log("that.data.p_user_profile: ", that.data.p_user_profile)
                // that.drawRadar()
            }
        })
    },

    // onShow 每次页面切换时调用
    onShow: function () {
        // this.getUserInfo();
    },

    // 下拉时调用
    onPullDownRefresh: function () {
        this.getUserInfo();
    },

    // 用户点击右上角分享
    onShareAppMessage: function () {
        return {
            title: '圈子报名',
            desc: '圈子里的人都在用',
            path: '/pages/index/index'
        };
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


    onReady: function () {
        // this.drawRadar()
    },

    // 雷达图
    // 坐标旋转规则：+x轴为0， 顺时针为角度加
    drawRadar: function () {
        var sourceData1 = this.data.p_user_profile.ability_array

        //调用
        this.drawEdge() //画六边形
        //this.drawArcEdge() //画圆
        this.drawLinePoint()
        //设置数据
        this.drawRegion(sourceData1, 'rgba(255, 0, 0, 0.5)') //第一个人的
        // this.drawRegion(sourceData2, 'rgba(255, 200, 0, 0.5)') //第二个人
        //设置文本数据
        this.drawTextCans(sourceData1)
        //设置节点
        this.drawCircle(sourceData1, 'red')
        // this.drawCircle(sourceData2,'yellow')
        //开始绘制
        radCtx.draw()
    },

    // 绘制6条边
    drawEdge: function () {
        radCtx.setStrokeStyle("yellow")
        radCtx.setLineWidth(5)  //设置线宽
        for (var i = 0; i < numSlot; i++) {
            //计算半径
            radCtx.beginPath()
            var rdius = mRadius / numSlot * (i + 1)
            //画6条线段
            for (var j = 0; j < numCount; j++) {
                //坐标
                var x = mCenter + rdius * Math.cos(mAngle * j + Math.PI / 6);
                var y = mCenter + rdius * Math.sin(mAngle * j + Math.PI / 6);
                radCtx.lineTo(x, y);
            }
            radCtx.closePath()
            radCtx.stroke()
        }
    },

    // 绘制连接点
    drawLinePoint: function () {
        radCtx.beginPath();
        for (var k = 0; k < numCount; k++) {
            var x = mCenter + mRadius * Math.cos(mAngle * k + Math.PI / 6);
            var y = mCenter + mRadius * Math.sin(mAngle * k + Math.PI / 6);

            radCtx.moveTo(mCenter, mCenter);
            radCtx.lineTo(x, y);
        }
        radCtx.stroke();
    },

    //绘制数据区域(数据和填充颜色)
    drawRegion: function (mData, color) {
        radCtx.beginPath();
        for (var m = 0; m < numCount; m++) {
            var x = mCenter + mRadius * Math.cos(mAngle * m + Math.PI / 6) * mData[m][1] / 100;
            var y = mCenter + mRadius * Math.sin(mAngle * m + Math.PI / 6) * mData[m][1] / 100;

            radCtx.lineTo(x, y);
        }
        radCtx.closePath();
        radCtx.setFillStyle(color)
        radCtx.fill();
    },

    //绘制文字
    drawTextCans: function (mData) {
        radCtx.setFillStyle("yellow")
        radCtx.font = 'bold 17px cursive'  //设置字体
        for (var n = 0; n < numCount; n++) {
            var x = mCenter + mRadius * Math.cos(mAngle * n + Math.PI / 6);
            var y = mCenter + mRadius * Math.sin(mAngle * n + Math.PI / 6);
            // radCtx.fillText(mData[n][0], x, y);
            //通过不同的位置，调整文本的显示位置
            if (mAngle * n == 0) {
                // 右下顶点
                radCtx.fillText(mData[n][0], x + 5, y + 5);
            }
            if (mAngle * n == Math.PI / 3) {
                // 下顶点
                radCtx.fillText(mData[n][0], x - 15, y + 20);
            }
            if (mAngle * n == Math.PI / 3 * 2) {
                // 左下顶点
                radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 7, y + 5);
            }
            if (mAngle * n == Math.PI) {
                // 左上顶点
                radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 7, y + 5);
            }
            if (mAngle * n == Math.PI / 3 * 4) {
                // 上顶点
                radCtx.fillText(mData[n][0], x - 15, y - 10);
            }
            if (mAngle * n == Math.PI / 3 * 5) {
                radCtx.fillText(mData[n][0], x + 5, y);
            }
        }
    },

    drawCircle: function (mData, color) {
        var r = 3; //设置节点小圆点的半径
        for (var i = 0; i < numCount; i++) {
            var x = mCenter + mRadius * Math.cos(mAngle * i + Math.PI / 6) * mData[i][1] / 100;
            var y = mCenter + mRadius * Math.sin(mAngle * i + Math.PI / 6) * mData[i][1] / 100;

            radCtx.beginPath();
            radCtx.arc(x, y, r, 0, Math.PI * 2);
            radCtx.fillStyle = color;
            radCtx.fill();
        }
    }
})
