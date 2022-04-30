import json
from django.http import HttpResponse
from datetime import datetime

from index.models import Activity, Player


def create(request):
    body_str = str(request.body, encoding = "utf8")
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)
    print("body", body_str)
    time_zone = datetime.utcnow().astimezone().tzinfo
    print(time_zone)
    # 相同活动时间一个人无法创建多个活动
    act_time = datetime.fromtimestamp(float(body["act_dt"])/1000, time_zone)
    # 根据open_id 找到创建人
    creator = Player.objects.get(open_id=body['open_id'])
    # 根据创建人找到club
    club = creator.club
    if not club:
        return HttpResponse(json.dumps({'code': 1, 'msg': "failed to find the club"}), content_type="application/json")
    activity, if_created = Activity.objects.get_or_create(
        creator=creator,
        act_time = act_time,
        defaults={
            'act_type': body["act_ind"],
            'act_name': body["act_name"],
            'act_fee': body["act_fee"],
            'max_num': body["max_num"],
            'act_time': act_time,
        }
    )
    print(f"DBG: if_created: {if_created}")
    if if_created:
        activity.club = club
        activity.save()
        resp = {
            'code': 0,
            'msg': "",
            'act_name': activity.act_name,
            'act_type': activity.act_type,
            'creator_name': creator.name,
            'creator_avatar_url': creator.avatar_url,
            'max_num': activity.max_num,
            'act_ts': activity.act_time.timestamp() * 1000,
            'act_content': activity.act_content,

        }
    else:
        resp = {'code': 1, 'msg': "failed to create a new activity"}
    return HttpResponse(json.dumps(resp), content_type="application/json")

# 获取特定用户的球队的全部活动
def get_team_acts(request):
    body_str = str(request.body, encoding = "utf8")
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)
    print("body", body_str)

    team_acts = Activity.objects.filter(club_id=body['club']).order_by('act_time')
    act_list = []
    for act in team_acts:
        creator = act.creator
        act_list.append({
            'act_name': act.act_name,
            'act_type': act.act_type,
            'max_num': act.max_num,
            'act_ts': act.act_time.timestamp() * 1000,
            'act_content': act.act_content,
            'creator_name': creator.name,
            'creator_avatar_url': creator.avatar_url,
        })
    resp = {
        'code': 0,
        'msg': 0,
        'act_list': act_list,
    }
    return HttpResponse(json.dumps(resp), content_type="application/json")
