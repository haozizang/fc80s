from django.shortcuts import render
import json
from django.http import HttpResponse, Http404
from django.template import loader
from django.db.models import Q

from . import models
from index.models import Club, Player, Match, Team

def create_club(name):
    # create clubs for DBG
    club = models.Club(name=name)
    club.save()
    return club

def index(request):
    # turn hex kanji into string
    body_str = str(request.body, encoding = "utf8")
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)
    print("body", body_str)
    print("path", request.path)
    print("Method", request.method)
    if not body['open_id']:
        return HttpResponse(json.dumps({'code': 1, 'msg': "open_id empty!"}),
            content_type="application/json")
    # get or create the player for the sender
    player, if_created = Player.objects.get_or_create(open_id=body["open_id"], defaults={'name': body["nick_name"], 'open_id': body["open_id"]})
    club = create_club('fc80s')
    player.club = club
    print("player: ", player)
    print("if created: ", if_created)
    match_num = 0
    team_num = 0
    club_name = None
    if not if_created:
        # get club the player belongs
        club = player.club
        # club = Club.objects.filter(name=player.name)
        print("club.name: ", club)
        if club:
            club_name = club.name
        # not new user => check team and match
        # get all the team(activity) the sender get involved
        team_list = Team.objects.filter(players__open_id=body["open_id"])
        team_num = team_list.count()
        # get all the matches the sender's in
        for team in team_list:
            print('team name: ', team.name)
            home_match_list = Match.objects.filter(home_team__id=team.id)
            away_match_list = Match.objects.filter(away_team__id=team.id)
            print("home match num: ", home_match_list.count())
            print("away match num: ", away_match_list.count())
            match_num += home_match_list.count()
            match_num += away_match_list.count()
            print("match count: ", match_num)
        print("team num(activity num): ", team_list.count())
    resp = {
        'club': club_name,
        'activities': team_num,
        'matches': match_num,
        'offence': player.offence,
        'defence': player.defence,
        'stability': player.stability,
        'teamwork': player.teamwork,
        'passion': player.passion,
        'win_ratio': player.win_ratio
    }
    # return render(request, "index/index.html", context)
    return HttpResponse(json.dumps(resp), content_type="application/json")

def match(request, match_id):
    try:
        match = Match.objects.get(pk=match_id)
    except Match.DoesNotExist:
        raise Http404("match not found")
    return HttpResponse("You're looking at match %s." % match_id)

def team(request, team_id):
    team = Team.objects.get(id=team_id)
    match_list = Match.objects.filter(Q(home_team__id=team_id) | Q(away_team__id=team_id))
    context = {
        'team': team,
        'match_list': match_list
    }
    return render(request, "index/team.html", context)

def player(request, player_id):
    player = Player.objects.get(id=player_id)
    team_list = Team.objects.filter(players__id=player_id)
    context = {
        'player': player,
        'team_list': team_list
    }
    return render(request, "index/player.html", context)
