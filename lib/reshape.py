import sys
import os

print os.path.abspath( __file__ )
mypath = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', 'timeline'))
sys.path.append(mypath)

from mongoengine import *
from models import *


connect ('sdbm')

def extract_exchange(t):
    ex = Exchange(
        buyer = t.buyer,
        seller = t.seller,
        seller_2 = t.seller_2,
        cat_date = t.cat_date,
        institution = t.institution,
        catalogue_id = t.catalogue_id,
        cat_lot_num = t.cat_lot_num,
        price = t.price,
        sold = t.sold,
        comments = t.comments
        )
    return ex

def extract_manuscript(t):
    man = Manuscript(
        currency = t.currency, 
        source = t.source, 
        columns = t.columns, 
        duplicate_ms = t.duplicate_ms, 
        manuscript_id = t.manuscript_id, 
        current_location = t.current_location, 
        author = t.author, 
        author_variant = t.author_variant, 
        title = t.title, 
        language = t.language, 
        material = t.material, 
        place = t.place, 
        use = t.use, 
        date = t.date, 
        circa = t.circa, 
        artist = t.artist, 
        script = t.script, 
        folios = t.folios, 
        lines = t.lines, 
        height = t.height, 
        width = t.width, 
        binding = t.binding, 
        provenance = t.provenance, 
        link = t.link, 
        full_page_mini = t.full_page_mini, 
        large_mini = t.large_mini, 
        small_mini = t.small_mini, 
        mini = t.mini, 
        historiated_initials = t.historiated_initials, 
        decorated_initials = t.decorated_initials, 
        possible_duplicates = t.possible_duplicates,
        exchanges = []
        )
    return man


for t in Transaction.objects()[1:]:
    man = extract_manuscript(t)
    exch = extract_exchange(t)
    exch.save()
    ex = [str(exch.id)]
    for dup_id in man.duplicate_ms.split(','):
        if dup_id == man.manuscript_id:
            continue
        try:
            dup = Transaction.objects.get(manuscript_id=dup_id)
        except DoesNotExist:
            print dup_id, "DNE"
            continue
        print dup_id, "Exists"
        x = extract_exchange(dup)
        x.save()
        ex.append(str(x.id))
        print str(x.id)
        #Transaction.objects.delete(manuscript_id = dup_id)
    print man, ex
    man.exchanges = ex
    #print man.exchanges
    man.save()
        #man.exchanges = ex
