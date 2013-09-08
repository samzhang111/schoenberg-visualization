from django.http import HttpResponse
from django.views.generic import TemplateView
from django.core import serializers
from settings import STATIC_ROOT
from settings import PROJECT_PATH
from timeline.models import Transaction
import json


# Create your views here.
class HomeView(TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(HomeView, self).get_context_data(**kwargs)
        transactions = Transaction.objects.filter(manuscript_id__lte='500')
        # Add in a QuerySet of all the books
        context['staticstuff'] = STATIC_ROOT
        context['proj'] = PROJECT_PATH
        context['transactions'] = serializers.serialize("json", transactions)

        return context