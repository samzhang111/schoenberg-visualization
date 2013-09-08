from pprint import pprint
import json

f = open('contra.json', 'r')
lines = f.read()
j = json.loads(lines)
print json.dumps(lines, indent=4)
"""
for line in lines:
    pprint(line)
"""
