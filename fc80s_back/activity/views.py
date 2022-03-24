from django.shortcuts import render
import json
from django.http import HttpResponse, Http404
from django.template import loader
from datetime import datetime

from index.models import Activity, Player, Match, Team


def createActivity(request):
    body_str = str(request.body, encoding = "utf8")
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)
    print("body", body_str)
    time_zone = datetime.utcnow().astimezone().tzinfo
    print(time_zone)
    act_time = datetime.fromtimestamp(float(body["act_time"])/1000, time_zone)
    activity, if_created = Activity.objects.get_or_create(
        creator_open_id=body["open_id"],
        act_time = act_time,
        defaults={
            'act_name': body["act_name"],
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
