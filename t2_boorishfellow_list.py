#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 第二步: 选择航班
import urllib.request
import urllib.parse
import urllib.error
import http.cookiejar
import random

# values = {
#         'startstation': '沈家门',
#         'endstation': '东极',
#         'startTime': '2019-07-10'
#     }

def selectaddress(values):

    selectStation_url = 'https://dzsw.hxzs.com.cn/ST9ZHHXAPP/ShipTicket/shipHome/selectStation'
    random_value = random.random()
    url = selectStation_url + "?" + "rnd" + str(random_value)

    postdata = urllib.parse.urlencode(values).encode('utf-8')
    user_agent = r'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16C104 MicroMessenger/7.0.2(0x17000222) NetType/WIFI Language/zh_CN'
    headers = {'User-Agent': user_agent, 'Connection': 'keep-alive'}

    cookie_filename = 'cookie.txt'
    cookie = http.cookiejar.MozillaCookieJar(cookie_filename)
    cookie.load(cookie_filename, ignore_discard=True, ignore_expires=True)

    handler = urllib.request.HTTPCookieProcessor(cookie)
    opener = urllib.request.build_opener(handler)

    selectStation_request = urllib.request.Request(
        url=url, data=postdata, headers=headers, method="POST")

    get_response = opener.open(selectStation_request)

    print(get_response.read().decode())
