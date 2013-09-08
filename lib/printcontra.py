import pprint as pp
import json

# j contains the list of dictionaries
f = open('contra.json', 'r')
#f = open('kjv.json', 'r')
lines = f.read()
j = json.loads(lines)
dump = json.dumps(lines, indent=4)

pp = pp.PrettyPrinter(indent=2)
pp.pprint(j)

