from django.shortcuts import render
import json
from django.http import HttpResponse, Http404
from django.template import loader

from index.models import Activity, Player, Match, Team


def createActivity(request):
    body_str = str(request.body, encoding = "utf8")
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)
    print("body", body_str)
    resp = {
        'activities': team_num,
        'matches': match_num,
        'offence': player.offence,
        'defence': player.defence,
        'stability': player.stability,
        'teamwork': player.teamwork,
        'passion': player.passion,
        'win_ratio': player.win_ratio
    }
    return HttpResponse(json.dumps("rank view function"), content_type="application/json")
