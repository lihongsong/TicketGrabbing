#!/usr/bin/env python
# -*- coding: utf-8 -*-
import re
from lxml import etree
 
html = etree.parse('shipList.html', etree.HTMLParser())
lis = html.xpath('//ul[@class="many_ships"]/li')

times = html.xpath('//*[@class="fepar_time"]/text()')
prices = html.xpath('//*[@class="fr price"]')

temp_list = []

for i in range(0, len(times)):
    time_temp = times[i]
    price_xml = prices[i]
    time = re.sub(r' ?\n?', '', time_temp)
    price_infos = price_xml.xpath('div/text()')
    price_total = price_infos[0].split(':')[-1]
    price_sell = price_infos[1].split(':')[-1]
    
    dic = {
        "time": time,
        "余票": price_total,
        "可网售": price_sell
    }

    temp_list.append(dic)

print(temp_list)