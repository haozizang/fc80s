from django.shortcuts import render
import json
from django.http import HttpResponse, Http404
from django.template import loader
from django.db.models import Q

from datetime import datetime

from index.models import Activity, Player, Match, Team

def rank(request):
    # turn hex kanji into string
    body_str = str(request.body, encoding = "utf8")
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)
    print("body", body_str)
    return HttpResponse(json.dumps("rank view function"), content_type="application/json")

def upload(request):
    # turn hex kanji into string
    body_str = str(request.body, encoding = "utf8")
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)
    print("body", body_str)
    activity_timestamp = body["activity_time"]
    time = datetime.fromtimestamp(float(activity_timestamp)/1000)
    print("backend time:", time)
    activity, if_created = Activity.objects.get_or_create(time = time)
    print("if_created: ", if_created)
    # when activity is not created, don't insert the teams neither
    if if_created:
        for team in body["teams"]:
            print("team", team)
            # create team in DB
            team = Team.objects.create(name = team["name"])
    return HttpResponse(json.dumps({"if_create": if_created}), content_type="application/json")

