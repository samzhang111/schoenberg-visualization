from pymongo import MongoClient
from collections import defaultdict
import pprint

client = MongoClient()
db = client.sdbm

entries = db.things.find( {}, {'CAT_DATE':1} )
counts = defaultdict(int)

for e in entries:
    try:
        date = str(e['CAT_DATE'])
        if date:
            date = date[:4] # only want year
            if date in counts.keys():
                counts[date] += 1
            else:
                counts[date] = 1
    except KeyError:
        print "KeyError"
        continue

for i in xrange(1200, 2014):
    db.yearcounts.insert({ str(i):counts[str(i)] })

print "yearcounts collection created."
