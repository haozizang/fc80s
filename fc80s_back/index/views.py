from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    # turn hex kanji into string
    body = str(request.body, encoding = "utf8")
    # body_kanji = body.decode("utf-8").encode("utf-8")
    print("body", body)
    print("path", request.path)
    print("GET", request.GET)
    print("POST", request.POST)
    print("Method", request.method)
    return HttpResponse("Hello, this is fc80s-back!")
