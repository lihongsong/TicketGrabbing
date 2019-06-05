
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import re
import json
from lxml import etree

f = open('shipseat.html', 'r')
result = f.read()

p = re.compile('shippricelst=[\s\S]*}];\\n')

m = p.search(result)

shippricelst = m.group()

json_str = shippricelst[13:-2]

shippricelst_list = json.loads(json_str)

for i in shippricelst_list:
    print(i)

