from django.shortcuts import render
from .models import remarks_users


def index(request):
    # here QuerySet objects lies(like in the next comment)
    # username = remarks_users.objects.all()
    browser_id = request.session.session_key
    return render(
        request,
        'index.html',
        context={'id': browser_id}
    )

