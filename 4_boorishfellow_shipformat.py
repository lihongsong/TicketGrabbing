#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 第四步: 余票文件抓取

import re
from lxml import etree
 
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

# busid	B0041
# ttype	02