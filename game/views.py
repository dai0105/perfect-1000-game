from django.shortcuts import render


def title_view(request):
    return render(
        request,
        "game/title.html"
    )