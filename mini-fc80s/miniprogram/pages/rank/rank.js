const app = getApp();

Page({
  data: {
    p_openid: '',
    p_input: "",
    p_activity_time: "",
    p_teams: [
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
    p_ordered_teams: [],
    p_matches: [],
    p_round_index: "",
    p_match_index: "",
    p_fixed_height: 154
  },

  // 保存记录
  save: function () {
    wx.setStorageSync('data', this.data)
  },

  // 启动程序时加载数据data
  load: function () {
    var data = wx.getStorageSync("data")
    var activity_time = data.p_activity_time
    var teams = data.p_teams
    var ordered_teams = data.p_ordered_teams
    var matches = data.p_matches
    // 算出球队数目
    if (teams) {
      var team_count = teams.length
      this.setData({
        p_openid: app.globalData.g_openid,
        p_teams: teams,
        p_activity_time: activity_time,
        p_ordered_teams: ordered_teams,
        p_matches: matches
      })
    }
  },

  onLoad: function () {
    this.load()
  },

  // 输入球队name -> 监听输入值 并赋值给input
  inputChangeHandle: function (e) {
    this.setData({ p_input: e.detail.value })
    this.save()
  },

  // 添加球队
  addTream: function (e) {
    // 当input无具体值时 return
    var input = this.data.p_input
    if (!input || !input.trim()) return
    var teams = this.data.p_teams
    var activity_time = this.data.p_activity_time
    // only create activity_time when create no team in data
    if (!teams.length) {
      console.log("team length: ", teams.length)
      console.log("create activity time...")
      activity_time = new Date().getTime()
    }
    var ordered_teams = this.data.p_ordered_teams
    // 将input的值 push 给teams
    teams.push({
      name: input,
      game: 0,
      win: 0,
      draw: 0,
      loss: 0,
      goal: 0,
      point: 0,
      rank: 0,
    })
    ordered_teams.push({
      name: input,
      game: 0,
      win: 0,
      draw: 0,
      loss: 0,
      goal: 0,
      point: 0,
      rank: 0,
    })
    // 将data设为更新后的teams
    this.setData({
      p_input: "",
      p_activity_time: activity_time,
      p_teams: teams,
      p_ordered_teams: ordered_teams,
    })
    this.save()
    // 调整matches 元素的 padding-top高度
    this.adjustHeight()
  },

  // 删除球队
  deleteTeam: function(e) {
    var teams = this.data.p_teams
    var ordered_teams = this.data.p_ordered_teams
    var team_index = e.currentTarget.dataset.index
    teams.splice(team_index, 1)
    ordered_teams.splice(team_index, 1)
    // 删除完成后保存
    this.setData({p_teams: teams, p_ordered_teams: ordered_teams})
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
      this.setData({p_fixed_height: height})
      this.save()
    })
  },

  // start键 添加比赛
  startAddMatch: function(){
    // 先读取data中的数据-> 通过this来读取
    // var data = wx.getStorageSync("data")
    var ordered_teams = this.data.p_ordered_teams
    var team_count = ordered_teams.length
    var matches = this.data.p_matches
    // 根据球队数目来设计比赛
    if (team_count == 2) {
      var match = [{
        home: ordered_teams[0].name,
        away: ordered_teams[1].name,
        left_score: "",
        right_score: "",
      }]
      // matches.push(match)
    }else if (team_count == 3) {
      var match = [
        {home: ordered_teams[0].name, away: ordered_teams[1].name, left_score: "", right_score: ""},
        {home: ordered_teams[0].name, away: ordered_teams[2].name, left_score: "", right_score: ""},
        {home: ordered_teams[1].name, away: ordered_teams[2].name, left_score: "", right_score: ""}
        ]
    }else if (team_count == 4) {
      var match = [
        { home: ordered_teams[0].name, away: ordered_teams[3].name, left_score: "", right_score: "" },
        { home: ordered_teams[1].name, away: ordered_teams[2].name, left_score: "", right_score: "" },
        { home: ordered_teams[1].name, away: ordered_teams[3].name, left_score: "", right_score: "" },
        { home: ordered_teams[0].name, away: ordered_teams[2].name, left_score: "", right_score: "" },
        { home: ordered_teams[2].name, away: ordered_teams[3].name, left_score: "", right_score: "" },
        { home: ordered_teams[0].name, away: ordered_teams[1].name, left_score: "", right_score: "" },
      ]
    }
    matches.push(match)
    // 将数据matches更新后要使用setData进行保存
    this.setData({
      p_matches: matches,
    })
    this.save()
  },

  // 将storage中的数据清空并更新到当前数据中
  resetStorage:function() {
    this.setData({
      p_teams: [],
      p_ordered_teams: [],
      p_matches: []
    })
    // wx.removeStorageSync("data")
    wx.clearStorageSync()
  },

  uploadMatch: function() {
    var teams = this.data.p_teams;
    var activity_time = this.data.p_activity_time;
    var openid = this.data.p_openid;
    // console.log(Date.now())
    console.log('team.len: ', teams.length)
    console.log('activity_time: ', activity_time)
    console.log('p_openid: ', openid)
    if (!this.data.p_teams.length || !this.data.p_activity_time) {
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
        open_id: openid,
        activity_time: activity_time,
        teams: teams,
      },
      success: function (res) {
        console.log(res.data);
        var if_created = res.data["if_create"]
        console.log("if_created", if_created);
        if (if_created) {
          wx.showModal({
              title: '提示',
              content: "上传活动成功!"
          });
        } else {
          wx.showModal({
              title: '提示',
              content: "上传活动被拒绝..."
          });
        }
      }
  })
  },

  // 点击输入框时获取该输入框的序号
  tapLscoreChange: function (e) {
    var matches = this.data.p_matches
    var round_index = e.currentTarget.dataset.index
    var match_index = e.target.dataset.index
    if (match_index == undefined) return
    this.setData({ p_round_index: round_index, p_match_index: match_index })
    this.save()
  },

  // 输入比分动作->触发函数: 将比分赋值给 left_score
  inputScoreChange: function (e) {
    var round_index = this.data.p_round_index
    var match_index = this.data.p_match_index
    var matches = this.data.p_matches
    // 根据match_index的正负 -> 左侧or右侧
    if (match_index > 0) {
      matches[round_index][match_index-1].left_score = e.detail.value   
    }else{
      matches[round_index][-match_index-1].right_score = e.detail.value            
    }
    this.setData({ p_matches: matches })
    this.save()
    this.confirmScoreChange()
  },

  // enter键计算对战结果->积分榜
  confirmScoreChange: function () {
    var matches = this.data.p_matches
    var teams = this.data.p_teams
    // 将所有球队的积分归零
    for (team_index in teams) {
      teams[team_index].game = 0
      teams[team_index].win = 0
      teams[team_index].draw = 0
      teams[team_index].loss = 0
      teams[team_index].goal = 0
      teams[team_index].point = 0
    }
    // 根据matches计算积分榜信息
    for (var round of matches) {
      for (var match of round) {
        // 当比分数字违法时跳过...
        if (!/^[0-9]+$/.test(match.left_score) || !/^[0-9]+$/.test(match.right_score)) continue
          var goal_diff = match.left_score - match.right_score
          // console.log(goal_diff)
        // var homeResult = { win: Number(goal_diff > 0), draw: Number(goal_diff == 0), loss: Number(goal_diff < 0), goal: goal_diff, point: goal_diff == 0 ? 1 : 3 * Number(goal_diff > 0) }
        // var awayResult = { win: Number(goal_diff > 0), draw: Number(goal_diff == 0), loss: Number(goal_diff > 0), goal: -goal_diff, point: goal_diff == 0 ? 1 : 3 * Number(goal_diff < 0) }
        // 遍历球队找到对战双方, 修改其各变量
          for (var team_index in teams) {
            if (match.home == teams[team_index].name) {
              teams[team_index].game += 1
              teams[team_index].win += Number(goal_diff > 0)
              teams[team_index].draw += Number(goal_diff == 0)
              teams[team_index].loss += Number(goal_diff < 0)
              teams[team_index].goal += goal_diff
              teams[team_index].point += goal_diff == 0 ? 1 : 3 * Number(goal_diff > 0)
              
            } else if (match.away == teams[team_index].name) {
              teams[team_index].game += 1
              teams[team_index].win += Number(goal_diff < 0)
              teams[team_index].draw += Number(goal_diff == 0)
              teams[team_index].loss += Number(goal_diff > 0)
              teams[team_index].goal += - goal_diff
              teams[team_index].point += goal_diff == 0 ? 1 : 3 * Number(goal_diff < 0)
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
    for (team_index in teams) {
      if (Number(team_index) + 1 == teams.length) {
        teams[team_index].rank = -1
      } else {
        teams[team_index].rank = Number(team_index) + 1
      }
    }
    console.log("teams:", teams)
    this.setData({ p_teams: teams })
    this.save()
  },
})
