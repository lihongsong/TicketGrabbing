#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 第一步: 登录
import urllib.request, urllib.parse, urllib.error
import http.cookiejar
import random

random_value = random.random()
url_login = "https://dzsw.hxzs.com.cn/ST9ZHHXAPP/Login/Login"

url = url_login + "?" + "rnd" + str(random_value)

values = {
    'userID': '18850223077', 
    'password': '357997194'
    }

postdata = urllib.parse.urlencode(values).encode('utf-8')
user_agent = r'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16C104 MicroMessenger/7.0.2(0x17000222) NetType/WIFI Language/zh_CN'
headers = {'User-Agent': user_agent, 'Connection': 'keep-alive'}

cookie_filename = 'cookie.txt'
cookie = http.cookiejar.MozillaCookieJar(cookie_filename)
handler = urllib.request.HTTPCookieProcessor(cookie)
opener = urllib.request.build_opener(handler)

request = urllib.request.Request(url=url, data=postdata, headers=headers, method="POST")
try:
    response = opener.open(request)
    page = response.read().decode()
    print("login success")
    print(page)
except urllib.error.URLError as e:
    print("login fail")
    print(e.code, ':', e.reason)

cookie.save(ignore_discard=True, ignore_expires=True)  # 保存cookie到cookie.txt中
print(cookie)
for item in cookie:
    print('Name = ' + item.name)
    print('Value = ' + item.value)


