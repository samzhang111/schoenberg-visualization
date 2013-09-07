from django.http import HttpResponse
from django.views.generic import TemplateView
from settings import STATIC_ROOT
from django.models import Transaction

# Create your views here.
class HomeView(TemplateView):
    template_name = "home.html"
    model = Transaction

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(HomeView, self).get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['STATIC_ROOT'] = STATIC_ROOT
        return context