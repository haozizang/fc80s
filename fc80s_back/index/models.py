from django.db import models

# DB relations
## team : player = N : N
## team : match = 1 : N

# player
class Player(models.Model):
    # openID -> id
    player_id = models.IntegerField(default=0)
    name = models.CharField(max_length=30)
    offence = models.IntegerField(default=0)
    defence = models.IntegerField(default=0)
    stability = models.IntegerField(default=0)
    teamwork = models.IntegerField(default=0)
    passion = models.IntegerField(default=0)
    win_ratio = models.IntegerField(default=0)

    # 此函数决定 模型对象访问显示(Player.objects.all()) 和 admin 站点显示
    def __str__(self):
        return self.name

# class Activity(models.Model):
#     time = models.DateTimeField()

class Team(models.Model):
    name = models.CharField(max_length=30)
    win = models.IntegerField(default=0)
    draw = models.IntegerField(default=0)
    loss = models.IntegerField(default=0)
    # 添加GS(goal scored), GA(goal against) -> 算出 GD(goal difference)
    time = models.DateTimeField()
    players = models.ManyToManyField(Player)

    def __str__(self):
        return self.name

class Match(models.Model):
    # home_team = models.CharField(max_length=30)
    home_team = models.ForeignKey(Team, related_name="home_team", on_delete=models.CASCADE)
    # away_team = models.CharField(max_length=30)
    away_team = models.ForeignKey(Team, related_name="away_name", on_delete=models.CASCADE)
    home_goals = models.IntegerField(default=0)
    away_goals = models.IntegerField(default=0)
    time = models.DateTimeField()

    def __str__(self):
        return "home: " + self.home_team.name + " VS " + "away: " + self.away_team.name
