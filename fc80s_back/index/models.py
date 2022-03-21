from django.db import models
import enum

class ActType(enum.Enum):
    PracticeGame = "Practice"
    OfficialGame = "OfficialGame"
    Party = "Party"

class Club(models.Model):
    name = models.CharField(max_length=30)
    create_time = models.DateTimeField()

    def __str__(self):
        return self.name

# player
class Player(models.Model):
    # openID -> id
    name = models.CharField(max_length=30)
    club = models.ForeignKey(Club, on_delete=models.SET_NULL, blank=True, null=True)
    open_id = models.CharField(max_length=50, null=True)
    offence = models.IntegerField(default=0)
    defence = models.IntegerField(default=0)
    stability = models.IntegerField(default=0)
    teamwork = models.IntegerField(default=0)
    passion = models.IntegerField(default=0)
    win_ratio = models.IntegerField(default=0)

    # 此函数决定 模型对象访问显示(Player.objects.all()) 和 admin 站点显示
    def __str__(self):
        return self.name

class Activity(models.Model):
    act_name = models.CharField(max_length=20)
    act_type = models.CharField(
        max_length=20,
        choices=[(ele, ele.value) for ele in ActType]
    )
    act_content = models.CharField(max_length=30, null=True)
    act_time = models.DateTimeField()
    creator_open_id = models.CharField(max_length=50, null=True)
    create_time = models.DateTimeField()
    max_num = models.IntegerField()

    def __str__(self):
        #return self.create_time.strftime("%Y-%m-%d %H:%M:%S")
        return self.act_name

class Team(models.Model):
    name = models.CharField(max_length=30)
    captain = models.ForeignKey(Player, related_name="captain", on_delete=models.SET_NULL, blank=True, null=True)
    players = models.ManyToManyField(Player)
    rank = models.IntegerField(null=True)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, blank=True, null=True)
    win = models.IntegerField(default=0)
    draw = models.IntegerField(default=0)
    loss = models.IntegerField(default=0)
    point = models.IntegerField(default=0)
    goal = models.IntegerField(default=0)
    # 添加GS(goal scored), GA(goal against) -> 算出 GD(goal difference)

    def __str__(self):
        return self.name

class Match(models.Model):
    # home_team = models.CharField(max_length=30)
    home_team = models.ForeignKey(Team, related_name="home_team", on_delete=models.CASCADE, blank=True, null=True)
    # away_team = models.CharField(max_length=30)
    away_team = models.ForeignKey(Team, related_name="away_name", on_delete=models.CASCADE, blank=True, null=True)
    home_goals = models.IntegerField(default=0)
    away_goals = models.IntegerField(default=0)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.home_team.name + str(self.home_goals) + " : " + str(self.away_goals) + self.away_team.name
