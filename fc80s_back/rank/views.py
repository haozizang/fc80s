from django.shortcuts import render
import json
from django.http import HttpResponse, Http404
from django.template import loader
from django.db.models import Q

from datetime import datetime

from index.models import Player, Match, Team

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
    for team in body["teams"]:
        print("team", team)
        print("name", team["name"])
        print("game", team["game"])
        # create team in DB
        # get or create the team for the sender
        dt = datetime(2021, 10, 9, 23, 55, 59, 345433)
        team = Team.objects.create(name = team["name"], time = dt)
    return HttpResponse(json.dumps("upload view function"), content_type="application/json")

