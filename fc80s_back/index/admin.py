from django.contrib import admin
from .models import Club, Player, Match, Team, Activity

# register => admin page reflect

admin.site.register(Club)
admin.site.register(Player)
admin.site.register(Match)
admin.site.register(Team)
admin.site.register(Activity)
