Page({
  data: {
    input: "",
    teamCount: 0,
    activity_time: "",
    teams: [
      // {
      //   name: "",
      //   game: 0,
      //   win: 0,
      //   draw: 0,
      //   loss: 0,
      //   goal: 0,
      //   point: 0
      // }
    ],
    orderedTeams: [],
    matches: [],
    roundIndex: "",
    matchIndex: "",
    fixedHeight: 154
  },

  // 保存记录
  save: function () {
    wx.setStorageSync('data', this.data)
  },

  // 启动程序时加载数据data
  load: function () {
    var data = wx.getStorageSync("data")
    var teams = data.teams
    var orderedTeams = data.orderedTeams
    var matches = data.matches
    // 算出球队数目
    if (teams) {
      var teamCount = teams.length
      this.setData({ teams: teams, orderedTeams: orderedTeams, teamCount: teamCount, matches: matches })
    }
  },

  onLoad: function () {
    this.load()
  },

  // 输入球队name -> 监听输入值 并赋值给input
  inputChangeHandle: function (e) {
    this.setData({ input: e.detail.value })
    this.save()
  },

  // 添加球队
  addTream: function (e) {
    // 当input无具体值时 return
    if (!this.data.input || !this.data.input.trim()) return
    var teams = this.data.teams
    if (!this.data.teams.length) {
      this.data.activity_time = new Date().toLocaleString('en-US')
    }
    var orderedTeams = this.data.orderedTeams
    // 将input的值 push 给teams
    teams.push({
      name: this.data.input,
      game: 0,
      win: 0,
      draw: 0,
      loss: 0,
      goal: 0,
      point: 0,
      finished: false
    })
    orderedTeams.push({
        name: this.data.input,
        game: 0,
        win: 0,
        draw: 0,
        loss: 0,
        goal: 0,
        point: 0,
        finished: false
      })
    // 将data设为更新后的teams
    this.setData({
      input: '',
      teams: teams,
      orderedTeams: orderedTeams,
    })
    this.save()
    // 调整matches 元素的 padding-top高度
    this.adjustHeight()
  },

  // 删除球队
  deleteTeam: function(e) {
    var teams = this.data.teams
    var orderedTeams = this.data.orderedTeams
    var teamIndex = e.currentTarget.dataset.index
    teams.splice(teamIndex, 1)
    orderedTeams.splice(teamIndex, 1)
    // 删除完成后保存
    this.setData({teams: teams, orderedTeams: orderedTeams})
    this.save()
    // 调整matches 元素的 padding-top高度
    this.adjustHeight()
  },

  adjustHeight: function() {
    var query = wx.createSelectorQuery();
    query.select("#topFixed").boundingClientRect()
    query.exec((res) => {
      var height = res[0].height;
      // console.log(height)
      this.setData({fixedHeight: height})
      this.save()
    })
  },

  // start键 添加比赛
  startAddMatch: function(){
    // 先读取data中的数据-> 通过this来读取
    // var data = wx.getStorageSync("data")
    var orderedTeams = this.data.orderedTeams
    var teamCount = orderedTeams.length
    var matches = this.data.matches
    // 根据球队数目来设计比赛
    if (teamCount == 2) {
      var match = [{
        home: orderedTeams[0].name,
        away: orderedTeams[1].name,
        lScore: "",
        rScore: "",
      }]
      // matches.push(match)
    }else if (teamCount == 3) {
      var match = [
        {home: orderedTeams[0].name, away: orderedTeams[1].name, lScore: "", rScore: ""},
        {home: orderedTeams[0].name, away: orderedTeams[2].name, lScore: "", rScore: ""},
        {home: orderedTeams[1].name, away: orderedTeams[2].name, lScore: "", rScore: ""}
        ]
    }else if (teamCount == 4) {
      var match = [
        { home: orderedTeams[0].name, away: orderedTeams[3].name, lScore: "", rScore: "" },
        { home: orderedTeams[1].name, away: orderedTeams[2].name, lScore: "", rScore: "" },
        { home: orderedTeams[1].name, away: orderedTeams[3].name, lScore: "", rScore: "" },
        { home: orderedTeams[0].name, away: orderedTeams[2].name, lScore: "", rScore: "" },
        { home: orderedTeams[2].name, away: orderedTeams[3].name, lScore: "", rScore: "" },
        { home: orderedTeams[0].name, away: orderedTeams[1].name, lScore: "", rScore: "" },
      ]
    }
    matches.push(match)
    // 将数据matches更新后要使用setData进行保存
    this.setData({
      matches: matches,
    })
    this.save()
  },

  // 将storage中的数据清空并更新到当前数据中
  resetStorage:function() {
    this.setData({
      teams: [],
      orderedTeams: [],
      matches: []
    })
    // wx.removeStorageSync("data")
    wx.clearStorageSync()
  },

  uploadMatch: function() {
    var teams = this.data.teams;
    // var matches = this.data.matches;
    var activity_time = new Date().toLocaleString('en-US')
    // console.log(Date.now())
    console.log('team.len: ', teams.length)
    console.log('activity_time: ', this.data.activity_time)
    if (!this.data.teams.length || !this.data.activity_time || !this.data.activity_time.trim()) {
      wx.showModal({
          title: '提示',
          content: "上传活动失败..."
      });
      return;
    }
    wx.request({
      url: 'http://127.0.0.1:8000/rank/upload/',
      header: { "content-type": "application/json" },
      method: "POST",
      data: {
        activity_time: activity_time,
        teams: teams,
        // matches: matches
      },
      success: function (res) {
        console.log(res.data);
        console.log("upload callback.");
      }
  })
  },

  // 点击输入框时获取该输入框的序号
  tapLscoreChange: function (e) {
    var matches = this.data.matches
    var roundIndex = e.currentTarget.dataset.index
    var matchIndex = e.target.dataset.index
    if (matchIndex == undefined) return
    this.setData({ roundIndex: roundIndex, matchIndex: matchIndex })
    this.save()
  },

  // 输入比分动作->触发函数: 将比分赋值给 lScore
  inputScoreChange: function (e) {
    var roundIndex = this.data.roundIndex
    var matchIndex = this.data.matchIndex
    var matches = this.data.matches
    // 根据matchIndex的正负 -> 左侧or右侧
    if (matchIndex > 0) {
      matches[roundIndex][matchIndex-1].lScore = e.detail.value   
    }else{
      matches[roundIndex][-matchIndex-1].rScore = e.detail.value            
    }
    this.setData({ matches: matches })
    this.save()
    this.confirmScoreChange()
  },

  // enter键计算对战结果->积分榜
  confirmScoreChange: function () {
    var matches = this.data.matches
    var teams = this.data.teams
    // 将所有球队的积分归零
    for (teamIndex in teams) {
      teams[teamIndex].game = 0
      teams[teamIndex].win = 0
      teams[teamIndex].draw = 0
      teams[teamIndex].loss = 0
      teams[teamIndex].goal = 0
      teams[teamIndex].point = 0
    }
    // 根据matches计算积分榜信息
    for (var round of matches) {
      for (var match of round) {
        // 当比分数字违法时跳过...
        if (!/^[0-9]+$/.test(match.lScore) || !/^[0-9]+$/.test(match.rScore)) continue
          var goalDiff = match.lScore - match.rScore
          // console.log(goalDiff)
        // var homeResult = { win: Number(goalDiff > 0), draw: Number(goalDiff == 0), loss: Number(goalDiff < 0), goal: goalDiff, point: goalDiff == 0 ? 1 : 3 * Number(goalDiff > 0) }
        // var awayResult = { win: Number(goalDiff > 0), draw: Number(goalDiff == 0), loss: Number(goalDiff > 0), goal: -goalDiff, point: goalDiff == 0 ? 1 : 3 * Number(goalDiff < 0) }
        // 遍历球队找到对战双方, 修改其各变量
          for (var teamIndex in teams) {
            if (match.home == teams[teamIndex].name) {
              teams[teamIndex].game += 1
              teams[teamIndex].win += Number(goalDiff > 0)
              teams[teamIndex].draw += Number(goalDiff == 0)
              teams[teamIndex].loss += Number(goalDiff < 0)
              teams[teamIndex].goal += goalDiff
              teams[teamIndex].point += goalDiff == 0 ? 1 : 3 * Number(goalDiff > 0)
              
            } else if (match.away == teams[teamIndex].name) {
              teams[teamIndex].game += 1
              teams[teamIndex].win += Number(goalDiff < 0)
              teams[teamIndex].draw += Number(goalDiff == 0)
              teams[teamIndex].loss += Number(goalDiff > 0)
              teams[teamIndex].goal += - goalDiff
              teams[teamIndex].point += goalDiff == 0 ? 1 : 3 * Number(goalDiff < 0)
            }
          }
      }
    }
    // TODO 按照积分高低排序...
    // teams.sort(this.teamSort("point"))
    teams.sort(
      function(team1, team2) {
        if (team1["point"] == team2["point"]) {
          var value1 = team1["goal"]
          var value2 = team2["goal"]
          return value2 - value1
        }
        var value1 = team1["point"]
        var value2 = team2["point"]
        return value2 - value1
      }
    )
    this.setData({ teams: teams })
    this.save()
  },

  // NOT_USED_FUNCTION 
  // add sort function
  teamSort: function (property) {
    return function(team1, team2) {
      var value1 = team1[property]
      var value2 = team2[property]
      return value2 - value1
    }
  }
})
