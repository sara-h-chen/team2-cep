from django.http import HttpResponse, Http404

# Create your views here.

def index(request):
    return HttpResponse("Hello, world. You're at the Index.")


