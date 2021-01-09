from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.template import loader

from .models import Player, Match, Team

def index(request):
    # turn hex kanji into string
    body = str(request.body, encoding = "utf8")
    # body_kanji = body.decode("utf-8").encode("utf-8")
    print("body", body)
    print("path", request.path)
    print("GET", request.GET)
    print("POST", request.POST)
    print("Method", request.method)
    # get all players
    player_list = Player.objects.all();
    # loader is old-fashioned
    context = {
        'player_list': player_list
    }
    return render(request, "index/index.html", context)

def match(request, match_id):
    try:
        match = Match.objects.get(pk=match_id)
    except Match.DoesNotExist:
        raise Http404("match not found")
    return HttpResponse("You're looking at match %s." % match_id)

def team(request, team_id):
    return HttpResponse("You're looking at team %s." % team_id)

def player(request, player_id):
    return HttpResponse("You're looking at player %s." % player_id)
