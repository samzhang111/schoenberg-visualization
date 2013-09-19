from django.http import HttpResponse
from django.views.generic import TemplateView

from settings import STATIC_ROOT
from settings import PROJECT_PATH
from timeline.models import Manuscript
from timeline.models import Exchange
from timeline.models import Transaction
import json
import pprint as pp
#from django.utils import simplejson

class ManuEncoder(json.JSONEncoder):
    def encode_object(self, obj):
        return {
            'id':unicode(obj.id),
            'duplicate_ms': obj.duplicate_ms,
            'manuscript_id': obj.manuscript_id,
            'date': obj.date,
            'current_location': obj.current_location,
            'language': obj.language,

            'desc': obj.title,
            'author': obj.author,
            'url': "balls",
            'refs': obj.exchanges
        };

    def default(self, obj):
        if hasattr(obj, '__iter__'):
            return [ self.encode_object(x) for x in obj ]
            #return { str(x.id): self.encode_object(x) for x in obj }
        else:
            return self.encode_object(obj)

class ExchEncoder(json.JSONEncoder):
    def encode_object(self, obj):
        return {
            'id':unicode(obj.id),
            'buyer': obj.buyer,
            'seller': obj.seller,
            'seller_2': obj.seller_2,
            'cat_date': obj.cat_date,
            'institution': obj.institution,
            'catalogue_id': obj.catalogue_id,
            'cat_lot_num': obj.cat_lot_num,
            'price': obj.price,
            'sold': obj.sold,
            'comments': obj.comments
        };

    def default(self, obj):
        if hasattr(obj, '__iter__'):
            #return [ self.encode_object(x) for x in obj ]
            return { str(x.id): self.encode_object(x) for x in obj }
        else:
            return self.encode_object(obj)


class ManuscriptEncoder(json.JSONEncoder):
    def encode_object(self, obj):
        return {
            'id':unicode(obj.id),
            'duplicate_ms': obj.duplicate_ms,
            'currency': obj.currency,
            'source': obj.source,
            'columns': obj.columns,
            'manuscript_id': obj.manuscript_id,
            'current_location': obj.current_location,
            'author': obj.author,
            'author_variant': obj.author_variant,
            'desc': obj.title,
            'language': obj.language,
            'material': obj.material,
            'place': obj.place,
            'use': obj.use,
            'date': obj.date,
            'circa': obj.circa,
            'artist': obj.artist,
            'script': obj.script,
            'folios': obj.folios,
            'lines': obj.lines,
            'height': obj.height,
            'width': obj.width,
            'binding': obj.binding,
            'provenance': obj.provenance,
            'link': obj.link,
            'full_page_mini': obj.full_page_mini,
            'large_mini': obj.large_mini,
            'small_mini': obj.small_mini,
            'mini': obj.mini,
            'historiated_initials': obj.historiated_initials,
            'decorated_initials': obj.decorated_initials,
            'possible_duplicates': obj.possible_duplicates,

            'refs': obj.exchanges
        };

    def default(self, obj):
        if hasattr(obj, '__iter__'):
            #return [ self.encode_object(x) for x in obj ]
            return { str(x.id): self.encode_object(x) for x in obj }
        else:
            return self.encode_object(obj)

class RootEncoder(json.JSONEncoder):
    def encode_object(self, obj):
        return {
                        "duplicate_ms" : obj.duplicate_ms,
                        "binding" : obj.binding,
                        "height" : obj.height,
                        "currency" : obj.currency,
                        "seller_2" : obj.seller_2,
                        "current_location" : obj.current_location,
                        "historiated_initials" : obj.historiated_initials,
                        "use" : obj.use,
                        "date" : obj.date,
                        "author" : obj.author,
                        "provenance" : obj.provenance,
                        "comments" : obj.comments,
                        "seller" : obj.seller,
                        "source" : obj.source,
                        "circa" : obj.circa,
                        "sold" : obj.sold,
                        "columns" : obj.columns,
                        "folios" : obj.folios,
                        "cat_date" : obj.cat_date,
                        "author_variant" : obj.author_variant,
                        "price" : obj.price,
                        "material" : obj.material,
                        "cat_lot_num" : obj.cat_lot_num,
                        "large_mini" : obj.large_mini,
                        "small_mini" : obj.small_mini,
                        "link" : obj.link,
                        "buyer" : obj.buyer,
                        "decorated_initials" : obj.decorated_initials,
                        "institution" : obj.institution,
                        "manuscript_id" : obj.manuscript_id,
                        "language" : obj.language,
                        "artist" : obj.artist,
                        "title" : obj.title,
                        "lines" : obj.lines,
                        "full_page_mini" : obj.full_page_mini,
                        "possible_duplicates" : obj.possible_duplicates,
                        "script" : obj.script,
                        "place" : obj.place,
                        "width" : obj.width
                }
def default(self, obj):
        if hasattr(obj, '__iter__'):
            return [ self.encode_object(x) for x in obj ]
        else:
            print 'hello'
            return self.encode_object(obj)


class ArcsView(TemplateView):
    template_name = "arcs.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(ArcsView, self).get_context_data(**kwargs)
        manuscripts = Manuscript.objects().all()[:5000]
        exchanges = Exchange.objects().all()[:10000]
        # Add in a QuerySet of all the books
        context['manuscripts'] = json.dumps(manuscripts, cls=ManuEncoder)
        #context['manlen'] = len(context['manuscripts'])
        context['exchanges'] = json.dumps(exchanges, cls=ExchEncoder)
        #context['exlen'] = len(context['exchanges'])
        return context


class HomeView(TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(HomeView, self).get_context_data(**kwargs)
        #rc = Transaction.objects().all() 
        #print rc[0].mini
        # Add in a QuerySet of all the books
        #context['root_encoding'] = json.dumps(rc, cls=RootEncoder)

        return context

class SerialView(TemplateView):
    template_name = "serial.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(SerialView, self).get_context_data(**kwargs)
        manuscripts = Manuscript.objects().all()[:2000]
        exchanges = Exchange.objects().all()[:2000]

        # Add in a QuerySet of all the books
        context['staticstuff'] = STATIC_ROOT
        context['manuscripts'] = json.dumps(manuscripts, cls=ManuscriptEncoder)
        context['exchanges'] = json.dumps(exchanges, cls=ExchEncoder)

        return context
