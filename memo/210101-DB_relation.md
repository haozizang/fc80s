# DB relation
- activity -> team{activity_id}
- team <- middle -> player
- activity -> match{activity_id}
- team -> match{home_team_id, away_team_id}

# tables
player

team 
- 活动 可以根据 team 推算出来 -》分队的时候, 给同一个活动下的队加一个相同的 activity_id? 或者用 timestamp
- 冠军什么的, 都靠动态计算

match

