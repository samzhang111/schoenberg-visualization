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
        }

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
        #lst = serializers.serialize('json', transactions, fields=('manuscript_id'))
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