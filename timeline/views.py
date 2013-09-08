from django.http import HttpResponse
from django.views.generic import TemplateView

from settings import STATIC_ROOT
from settings import PROJECT_PATH
from timeline.models import Transaction
import json
#from django.utils import simplejson

class MyEncoder(json.JSONEncoder):
    def encode_object(self, obj):
        return {
            'id':unicode(obj.id),
            'duplicate_ms': obj.duplicate_ms,
            'seller': obj.seller,
            'seller_2': obj.seller_2,
            'institution': obj.institution,
            'catalogue_id': obj.catalogue_id,
            'cat_lot_num': obj.cat_lot_num,
            'price': obj.price,
            'currency': obj.currency,
            'sold': obj.sold,
            'source': obj.source,
            'cat_date': obj.cat_date,
            'buyer': obj.buyer,
            'columns': obj.columns,
            'manuscript_id': obj.manuscript_id,
            'current_location': obj.current_location,
            'author': obj.author,
            'author_variant': obj.author_variant,
            'title': obj.title,
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
            'comments': obj.comments,
            'link': obj.link,
            'full_page_mini': obj.full_page_mini,
            'large_mini': obj.large_mini,
            'small_mini': obj.small_mini,
            'mini': obj.mini,
            'historiated_initials': obj.historiated_initials,
            'decorated_initials': obj.decorated_initials,
            'possible_duplicates': obj.possible_duplicates
        };

    def default(self, obj):
        if hasattr(obj, '__iter__'):
            return [ self.encode_object(x) for x in obj ]
        else:
            return self.encode_object(obj)

class ArcsView(TemplateView):
    template_name = "arcs.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(ArcsView, self).get_context_data(**kwargs)
        transactions = Transaction.objects.filter(manuscript_id__lte='500')
        """
        lst = []

        for transaction in transactions:
            print transaction
            lst.append(transaction.manuscript_id)
        vals = transactions.values_list()
        """
        context['staticstuff'] = STATIC_ROOT
        context['proj'] = PROJECT_PATH
        context['transactions'] = json.dumps(transactions, cls=MyEncoder)

        return context


class HomeView(TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(HomeView, self).get_context_data(**kwargs)
        transactions = Transaction.objects().filter(manuscript_id__lte='500')
        # Add in a QuerySet of all the books
        context['staticstuff'] = STATIC_ROOT
        context['proj'] = PROJECT_PATH
        context['transactions'] = serializers.serialize("json", transactions)

        return context