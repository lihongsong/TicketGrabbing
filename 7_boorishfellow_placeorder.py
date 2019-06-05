#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 第七步: 下单
import urllib.request, urllib.parse, urllib.error
import http.cookiejar
import random
import json

selectStation_url = 'https://dzsw.hxzs.com.cn/ST9ZHHXAPP/ShipTicket/shipSeat/makeship'
random_value = random.random()
url = selectStation_url + "?" + "rnd" + str(random_value)

one_value = {
    'name': '李泓松',
    'seat_type': '贵宾',
    'ticket_price': '260.00',
    'cardtype': '身份证',
    'cardtypeid': '10',
    'ticket_type': '成人票',
    'idcard': '350724199409250014',
    'ticket_type_id': '01',
    'seat_type_id': '0111',
    'mobile': '18850223077'
}

values = []

values.append(one_value)

json_str = json.dumps([one_value])

values = {
    'jsonstr': json_str,
    'insProductPrice': 0
    }

print(values)

postdata = urllib.parse.urlencode(values).encode('utf-8')
user_agent = r'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16C104 MicroMessenger/7.0.2(0x17000222) NetType/WIFI Language/zh_CN'
referer = 'https://dzsw.hxzs.com.cn/ST9ZHHXAPP/ShipTicket/shipSeat/Index?busid=B0041&ttype=02'
headers = {'User-Agent': user_agent, 'Connection': 'keep-alive', 'Referer': referer}

cookie_filename = 'cookie.txt'
cookie = http.cookiejar.MozillaCookieJar(cookie_filename)
cookie.load(cookie_filename, ignore_discard=True, ignore_expires=True)

handler = urllib.request.HTTPCookieProcessor(cookie)
opener = urllib.request.build_opener(handler)

selectStation_request = urllib.request.Request(url=url, data=postdata, headers=headers, method="POST")

get_response = opener.open(selectStation_request)

print(get_response.read().decode())