from django.db import models

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
    # TODO: add other fields

    # 此函数决定 模型对象访问显示(Player.objects.all()) 和 admin 站点显示
    def __str__(self):
        return self.name

class Match(models.Model):
    home_team = models.CharField(max_length=30)
    away_team = models.CharField(max_length=30)
    time = models.DateTimeField()

    # 此函数决定 模型对象访问显示(Player.objects.all()) 和 admin 站点显示
    def __str__(self):
        return self.time
