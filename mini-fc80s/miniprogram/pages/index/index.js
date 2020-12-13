/**
 * 小程序首页
 */
const app = getApp();

// 雷达图的变量
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
        isLogin: app.globalData.isLogin,
        openid: ''
    },

    // onLoad 小程序启动时调用
    onLoad: function() {
        var that = this;
        // 获取，保存 openid
        // 云函数调用为异步
        wx.cloud.callFunction({
            name: 'getOpenID',
            success: function(res) {
                console.log(res.result.openid)
                var local_openid = res.result.openid
                console.log('result:', res.result)
                wx.showModal({
                    title: '提示',
                    content: local_openid
                });
                app.globalData.openid = local_openid
                that.setData({
                    openid: local_openid
                })
                // 与后端交互
                wx.request({
                    url: 'http://127.0.0.1:8000/index/',
                    header: { "content-type": "application/x-www-form-urlencoded" },
                    method: "POST",
                    data: {openid: local_openid},
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function (res) {
                        console.log(res.data)
                    }
                })
            },
        })
    },

    // onShow 每次页面切换时调用
    onShow: function () {
    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: '圈子报名',
            desc: '圈子里的人都在用',
            path: '/pages/index/index'
        };
    },


    /**
     * 获取用户信息
     */

    bindGetUserInfo: function(event){
        // console.log(event);
        let o = event.detail || {};
        this.setData({
            isLogin: o.userInfo ? true : false
        });

        app.globalData.isLogin = this.data.isLogin;

        if(o.userInfo){
            wx.navigateTo({
                url: '/pages/post/post'
            });
        }
    },

    // 全局变量？
    data: {
        stepText:5,
        chanelArray1: [["稳定", 88], ["防守", 30], ["热情", 66], ["荣誉", 90],[ "进攻", 95], ["胜率", 88]],
        chanelArray2: [["稳定", 24], ["防守", 60], ["热情", 88], ["荣誉", 49], ["进攻", 46], ["胜率", 92]]
    },


    onReady: function () {
        this.drawRadar()
    },
    
    // 雷达图
    /*
    坐标旋转规则：+x轴为0， 顺时针为角度加
    */
    drawRadar: function() {
        var sourceData1 = this.data.chanelArray1
        var sourceData2 = this.data.chanelArray2

        //调用
        this.drawEdge() //画六边形
        //this.drawArcEdge() //画圆
        this.drawLinePoint()
        //设置数据
        this.drawRegion(sourceData1,'rgba(255, 0, 0, 0.5)') //第一个人的
        this.drawRegion(sourceData2, 'rgba(255, 200, 0, 0.5)') //第二个人
        //设置文本数据
        this.drawTextCans(sourceData1)
        //设置节点
        this.drawCircle(sourceData1,'red')
        this.drawCircle(sourceData2,'yellow')
        //开始绘制
        radCtx.draw()
    },

    // 绘制6条边
    drawEdge: function(){
        radCtx.setStrokeStyle("yellow")
        radCtx.setLineWidth(5)  //设置线宽
        for (var i = 0; i < numSlot; i++) {
            //计算半径
            radCtx.beginPath()
            var rdius = mRadius / numSlot * (i + 1)
            //画6条线段
            for (var j = 0; j < numCount; j++) {
            //坐标
            var x = mCenter + rdius * Math.cos(mAngle * j + Math.PI/6);
            var y = mCenter + rdius * Math.sin(mAngle * j + Math.PI/6);
            radCtx.lineTo(x, y);
            }
            radCtx.closePath()
            radCtx.stroke()
        } 
    },

    // 绘制连接点
    drawLinePoint:function(){
        radCtx.beginPath();
        for (var k = 0; k < numCount; k++) {
            var x = mCenter + mRadius * Math.cos(mAngle * k + Math.PI/6);
            var y = mCenter + mRadius * Math.sin(mAngle * k + Math.PI/6);

            radCtx.moveTo(mCenter, mCenter);
            radCtx.lineTo(x, y);
        }
        radCtx.stroke();
    },

    //绘制数据区域(数据和填充颜色)
    drawRegion: function (mData,color){   
        radCtx.beginPath();
        for (var m = 0; m < numCount; m++){
        var x = mCenter + mRadius * Math.cos(mAngle * m + Math.PI/6) * mData[m][1] / 100;
        var y = mCenter + mRadius * Math.sin(mAngle * m + Math.PI/6) * mData[m][1] / 100;

        radCtx.lineTo(x, y);
        }
        radCtx.closePath();
        radCtx.setFillStyle(color)
        radCtx.fill();
    },

    //绘制文字
    drawTextCans: function (mData){
        radCtx.setFillStyle("yellow")
        radCtx.font = 'bold 17px cursive'  //设置字体
        for (var n = 0; n < numCount; n++) {
            var x = mCenter + mRadius * Math.cos(mAngle * n + Math.PI/6);
            var y = mCenter + mRadius * Math.sin(mAngle * n + Math.PI/6);
            // radCtx.fillText(mData[n][0], x, y);
            //通过不同的位置，调整文本的显示位置
            if (mAngle * n == 0) {
                // 右下顶点
                radCtx.fillText(mData[n][0], x+5, y+5);
            }
            if (mAngle * n == Math.PI / 3) {
                // 下顶点
                radCtx.fillText(mData[n][0], x-15, y+20);
            }
            if (mAngle * n == Math.PI / 3 * 2) {
                // 左下顶点
                radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-7, y+5);
            }
            if (mAngle * n == Math.PI) {
                // 左上顶点
                radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-7, y+5);
            }
            if (mAngle * n == Math.PI / 3 * 4) {
                // 上顶点
                radCtx.fillText(mData[n][0], x-15, y-10);
            }
            if (mAngle * n == Math.PI / 3 * 5) {
                radCtx.fillText(mData[n][0], x + 5, y);
            }
        }
    },

    drawCircle: function(mData,color){
        var r = 3; //设置节点小圆点的半径
        for(var i = 0; i<numCount; i ++){
           var x = mCenter + mRadius * Math.cos(mAngle * i + Math.PI/6) * mData[i][1] / 100;
           var y = mCenter + mRadius * Math.sin(mAngle * i + Math.PI/6) * mData[i][1] / 100;
 
           radCtx.beginPath();
           radCtx.arc(x, y, r, 0, Math.PI * 2);
           radCtx.fillStyle = color;
           radCtx.fill();
         }
 
    }

})
