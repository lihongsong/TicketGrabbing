#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 第四步: 余票文件抓取

import re
from lxml import etree

def selectClasses(date):

    html = etree.parse('shipList.html', etree.HTMLParser())
    li_attrs = html.xpath('//ul[@class="many_ships"]/li/attribute::*')

    times = html.xpath('//*[@class="fepar_time"]/text()')
    prices = html.xpath('//*[@class="fr price"]')

    temp_list = []

    for i in range(0, len(times)):
        li_attr = li_attrs[i]
        temp = re.sub(r'selectship\(|\)|\'', '', li_attr)
        busid = temp.split(',')[0]
        ttype = temp.split(',')[1]
        time_temp = times[i]
        price_xml = prices[i]
        time = re.sub(r' ?\n?\r?', '', time_temp)
        price_infos = price_xml.xpath('div/text()')
        price_total = price_infos[0].split(':')[-1]
        price_sell = price_infos[1].split(':')[-1]

        dic = {
            "busid": busid,
            "ttype": ttype,
            "time": time,
            "余票": price_total,
            "可网售": price_sell
        }

        temp_list.append(dic)

    print(temp_list)

    flag = False
    for dic in temp_list:
        time = dic["time"]
        if time == date:
            flag = True
            return (dic["busid"], dic["ttype"])
    
    if flag == False:
        print("没有匹配到" + date + "的航班")
    else:
        print("匹配到" + date + "的航班")

    return (None, None)

# busid	B0041
# ttype	02
