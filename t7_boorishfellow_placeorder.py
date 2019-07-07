#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 第七步: 下单
import urllib.request
import urllib.parse
import urllib.error
import http.cookiejar
import random
import json

def selectTicket(values, valueslist):

    selectStation_url = 'https://dzsw.hxzs.com.cn/ST9ZHHXAPP/ShipTicket/shipSeat/makeship'
    random_value = random.random()
    url = selectStation_url + "?" + "rnd" + str(random_value)

    # "seatType": "下舱",
    #     "ticketType": "成人票",
    #     "name": "李泓松",
    #     "cardtype": "身份证",
    #     "idcard": "350724199409250014",
    #     "mobile": "18850223077"

    flag = False
    one_value = {}
    for dic in valueslist:
        ticketType = dic["ticketType"]
        if dic["seatType"] == values["seatType"] and ticketType == values["ticketType"]:
            flag = True
            one_value["name"] = values["name"]
            one_value["seat_type"] = dic["seatType"]
            one_value["ticket_price"] = dic["price"]
            one_value["cardtype"] = values["cardtype"]
            one_value["cardtypeid"] = values["cardtypeid"]
            one_value["ticket_type"] = values["ticketType"]
            one_value["idcard"] = values["idcard"]
            one_value["ticket_type_id"] = dic["ticketTypeCode"]
            one_value["seat_type_id"] = dic["seatTypeCode"]
            one_value["mobile"] = values["mobile"]

    if flag == False:
        print("请求参数校验失败")
        return

    values = []

    values.append(one_value)

    json_str = json.dumps([one_value])

    values = {
        'jsonstr': json_str,
        'insProductPrice': 0
    }

    postdata = urllib.parse.urlencode(values).encode('utf-8')
    user_agent = r'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16C104 MicroMessenger/7.0.2(0x17000222) NetType/WIFI Language/zh_CN'
    referer = 'https://dzsw.hxzs.com.cn/ST9ZHHXAPP/ShipTicket/shipSeat/Index?busid=B0041&ttype=02'
    headers = {'User-Agent': user_agent,
               'Connection': 'keep-alive', 'Referer': referer}

    cookie_filename = 'cookie.txt'
    cookie = http.cookiejar.MozillaCookieJar(cookie_filename)
    cookie.load(cookie_filename, ignore_discard=True, ignore_expires=True)

    handler = urllib.request.HTTPCookieProcessor(cookie)
    opener = urllib.request.build_opener(handler)

    selectStation_request = urllib.request.Request(
        url=url, data=postdata, headers=headers, method="POST")

    get_response = opener.open(selectStation_request)

    print(get_response.read().decode())
