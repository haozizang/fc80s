from django.shortcuts import render
from django.http import HttpResponse
from .models import Player

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
    all_player_str = ""
    for player in player_list:
        all_player_str += "name: " + player.name + "<br>"
        all_player_str += "offence: " + str(player.offence) + "<br>"
        all_player_str += "defence: " + str(player.defence) +  "<br>"
    return HttpResponse(all_player_str)

def detail(request, detail_id):
    return HttpResponse("You're looking at detail %s." % detail_id)

def question(request, detail_id):
    return HttpResponse("You're looking at question %s." % detail_id)

def result(request, detail_id):
    return HttpResponse("You're looking at result %s." % detail_id)
