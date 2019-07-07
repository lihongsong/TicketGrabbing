#!/usr/bin/env python
# -*- coding: utf-8 -*-

from t2_boorishfellow_list import selectaddress
from t3_boorishfellow_shiplist import selectDate
from t4_boorishfellow_shipformat import selectClasses
from t5_boorishfellow_ticketinfo import getSeatInfo
from t6_boorishfellow_postformat import postformat
from t7_boorishfellow_placeorder import selectTicket

import json
file_path = './config.json'
with open(file_path) as f:
    js = json.load(f)  # js是转换后的字典
    print(js)
    selectaddress(js["selectaddress"])
    selectDate(js["selectDate"])
    (busid, ttype) = selectClasses(js["selectClasses"]["time"])
    print(busid, ttype)
    getSeatInfo(busid, ttype)
    shippricelst_list = postformat()
    selectTicket(js["selectTicket"], shippricelst_list)