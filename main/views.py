from django.shortcuts import render
from .models import remarks_users


def index(request):
    # here QuerySet objects lies(like in the next comment)
    username = remarks_users.objects.fliter(username__contains='username') # here must be data from log-in
    browser_id = request.session.session_key
    return render(
        request,
        'index.html',
        context={'id': browser_id, 'username': username}
    )


def login(request):
    return render(
        request,
        'login.html',
    )


def update_model(request):
    if request.POST:
        if request.POST['update']:
            pass        # code ???
