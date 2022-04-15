from django.shortcuts import render
import json
from django.http import HttpResponse, Http404
from django.template import loader
from datetime import datetime

from index.models import Activity, Player, Match, Team


def create(request):
    body_str = str(request.body, encoding = "utf8")
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)
    print("body", body_str)
    time_zone = datetime.utcnow().astimezone().tzinfo
    print(time_zone)
    # 相同活动时间一个人无法创建多个活动
    act_time = datetime.fromtimestamp(float(body["act_dt"])/1000, time_zone)
    activity, if_created = Activity.objects.get_or_create(
        creator_open_id=body["open_id"],
        act_time = act_time,
        defaults={
            'act_type': body["act_ind"],
            'act_name': body["act_name"],
            'act_fee': body["act_fee"],
            'creator_open_id': body["open_id"],
            'max_num': body["max_num"],
            'act_time': act_time,
        }
    )
    print(f"DBG: if_created: {if_created}")
    if if_created:
        resp = {'code': 0, 'msg': ""}
    else:
        resp = {'code': 1, 'msg': "failed to create a new activity"}
    return HttpResponse(json.dumps(resp), content_type="application/json")

# 获取特定用户的球队的全部活动
def getTeamActs(request):
    body_str = str(request.body, encoding = "utf8")
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)
    print("body", body_str)

    team_acts = Activity.objects.filter(club=player.club)
    activity, if_created = Activity.objects.get_or_create(
        creator_open_id=body["open_id"],
        act_time = act_time,
        defaults={
            'act_type': body["act_ind"],
            'act_name': body["act_name"],
            'act_fee': body["act_fee"],
            'creator_open_id': body["open_id"],
            'max_num': body["max_num"],
            'act_time': act_time,
        }
    )
    resp = {
        'code': 0,
        'msg': 0,
    }
    return HttpResponse(json.dumps(resp), content_type="application/json")
