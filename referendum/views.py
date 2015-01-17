from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from forms import CommentForm, CityForm, DelegateVoteForm, DeleteAccountForm, TierForm, RegionForm, VoteForm
from models import Comment, City, DelegatedVote, Location, Partie, Poll, Region, Tier, Vote


CATALUNYA_CHOICES = (
    ('BARCELONA', u'Barcelona'))


COMUNIDAD_DE_MADRID_CHOICES = (
    ('MADRID', u'Madrid'))


def home(request, institution=None):
    if institution is not None:
        poll_list = Poll.objects.filter(institution=institution).order_by('vote_date_end')
    else:
        return redirect('home_country', institution='Congreso')
    current_polls = [ r for r in poll_list if r.vote_date_end > timezone.now()]
    voteform = VoteForm()
    voteform.fields['vote'].widget = forms.HiddenInput()
    now = timezone.now()
    context = {'poll_list': current_polls, 'voteform': voteform, 'now': now}
    if request.user.is_authenticated():
        location_objects = Location.objects.filter(user=request.user)
        if len(location_objects) > 0:
            location = location_objects[0]
            city = location.city.name
            region = location.region.name
            context.update({'city': city, 'region': region})
    return render(request, 'home.html', context)


def results(request, institution=None):
    if institution is not None:
        poll_list = Poll.objects.filter(institution=institution).order_by('vote_date_end')
    else:
        return redirect('results_country', institution='Congreso')
    finished_polls = [ r for r in poll_list if r.vote_date_end < timezone.now()]
    context = {'poll_list': finished_polls}
    if request.user.is_authenticated():
        location_objects = Location.objects.filter(user=request.user)
        if len(location_objects) > 0:
            location = location_objects[0]
            city = location.city.name
            region = location.region.name
            context.update({'city': city, 'region': region})
    return render(request, 'results.html', context)


@login_required
def avatar(request):
    return render(request, 'avatar.html')


@login_required
def profile(request):
    context = {}
    delegated_vote_objects = DelegatedVote.objects.filter(user=request.user)
    if len(delegated_vote_objects) > 0:
        delegated_vote = delegated_vote_objects[0]
        if delegated_vote.partie.name != "none":
            delegated_vote_partie_logo_url = delegated_vote.partie.logo.url
            context.update({'delegated_vote_partie_logo_url': delegated_vote_partie_logo_url})
    location_objects = Location.objects.filter(user=request.user)
    if len(location_objects) > 0:
        location = location_objects[0]
        context.update({'region_logo_url': location.region.logo.url})
        if location.city != None:
            context.update({'city_logo_url': location.city.logo.url})
    tier_objects = Tier.objects.filter(user=request.user)
    if len(tier_objects) > 0:
        tier = tier_objects[0]
        if tier.tier != None:
            context.update({'tier': tier })
    return render(request, 'profile.html', context)


@login_required
def delete(request):
    if request.method == 'POST':
        delete_account_form = DeleteAccountForm(request.POST)
        if delete_account_form.is_valid():
            delegated_vote_objects = DelegatedVote.objects.filter(user=request.user)
            delegated_vote = delegated_vote_objects[0]
            delegated_vote.delete()
            user = User.objects.get(pk = request.user.id)
            user.delete()
            return render(request, 'delete_thanks.html')
    else:
        delete_account_form = DeleteAccountForm()
    context = {'delete_account_form': delete_account_form}
    return render(request, 'delete.html', context)


def delete_thanks(request):
    return render(request, 'delete_thanks.html')


@login_required
def vote(request, poll_id):
    p = get_object_or_404(Poll, pk=poll_id)
    try:
        voteform = VoteForm(request.POST)
        if voteform.is_valid() and p.vote_date_start < timezone.now() < p.vote_date_end:
            user_votes = Vote.objects.filter(referendum=p).filter(userid=request.user.id)
            if len(user_votes) == 0:
                user = request.user.id
                delegated_vote_objects = DelegatedVote.objects.filter(user=request.user)
                if len(delegated_vote_objects) > 0:
                    delegated_vote = delegated_vote_objects[0]
                    choice = getattr(p, delegated_vote.partie.name)
                    if choice == 'YES':
                        p.votes_positive -= 1
                    elif choice == 'NO':
                        p.votes_negative -= 1
                    else:
                        p.votes_abstention -= 1
                if voteform.data['vote'] == 'Yes':
                    p.votes_positive = p.votes_positive + 1
                elif voteform.data['vote'] == 'No':
                    p.votes_negative = p.votes_negative + 1
                else:
                    p.votes_abstention = p.votes_abstention + 1
                p.save()
                vote = Vote()
                vote.referendum = p
                vote.userid = user
                vote.save()
    except Exception as e:
        poll_list = Poll.objects.order_by('vote_date_end')
        current_polls = [ r for r in poll_list if r.vote_date_end > timezone.now()]
        context = {'poll_list': current_polls}
        print e
        return render(request, 'home.html', context)
    poll_list = Poll.objects.order_by('vote_date_end')
    current_polls = [ r for r in poll_list if r.vote_date_end > timezone.now()]
    context = {'poll_list': current_polls}
    return render(request, 'home.html', context)


def vote_referendum(request, poll_id):
    try:
        p = Poll.objects.get(pk=poll_id)
    except:
        raise Http404
    return redirect(p)


def referendum(request, poll_slug):
    try:
        referendum = Poll.objects.get(slug=poll_slug)
        context = {'referendum': referendum}
        comments = Comment.objects.filter(referendum_id = referendum.id)
        if comments != None:
            context.update({'comments': comments})
        comment_form = CommentForm(data=request.POST)
        context.update({'comment_form': comment_form})
    except Exception as e:
        print e
        raise Http404
    return render(request, 'referendum.html', context)


@login_required
def comment(request, poll_slug):
    try:
        referendum = Poll.objects.get(slug=poll_slug)
        context = {'referendum': referendum}
        comments = Comment.objects.filter(referendum_id = referendum.id)
        if comments != None:
            context.update({'comments': comments})
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            user = request.user
            comment = Comment()
            comment.referendum = referendum
            comment.user = user
            comment.comment = comment_form.data['comment']
            comment.save()
        comment_form = CommentForm()
        context.update({'comment_form': comment_form})
    except Exception as e:
        print e
        raise Http404
    else:
        return render(request, 'referendum.html', context)


@login_required
def delegatevote(request):
    delegated_vote = None
    delegated_vote_objects = DelegatedVote.objects.filter(user=request.user)
    if len(delegated_vote_objects) > 0:
        delegated_vote = delegated_vote_objects[0]
    if request.method == 'POST':
        delegate_vote_form = DelegateVoteForm(request.POST)
        if delegate_vote_form.is_valid():
            partie = Partie.objects.get(name=request.POST.get('partiename'))
            if delegated_vote != None:
                delegated_vote.partie = partie
                delegated_vote.save()
            else:
                new_delegated_vote = DelegatedVote()
                new_delegated_vote.partie = partie
                new_delegated_vote.user = request.user
                new_delegated_vote.save()
    delegate_vote_form = DelegateVoteForm()
    parties = Partie.objects.all()
    delegated_vote_partie_name = ""
    delegated_vote_partie_logo_url = ""
    delegated_vote_objects = DelegatedVote.objects.filter(user=request.user)
    if len(delegated_vote_objects) > 0:
        delegated_vote = delegated_vote_objects[0]
        if delegated_vote.partie.name != "none":
            delegated_vote_partie_name = delegated_vote.partie.description
            delegated_vote_partie_logo_url = delegated_vote.partie.logo.url
    context = {'delegated_vote_partie_name': delegated_vote_partie_name,
               'delegated_vote_partie_logo_url': delegated_vote_partie_logo_url,
               'delegate_vote_form': delegate_vote_form, 'parties': parties}
    return render(request, 'delegatevote.html', context)

@login_required
def region(request):
    context = {}
    cities = City.objects.all()
    location = None
    location_objects = Location.objects.filter(user=request.user)
    if len(location_objects) > 0:
        location = location_objects[0]
    if request.method == 'POST':
        region_form = RegionForm(request.POST)
        if region_form.is_valid():
            region = Region.objects.get(name=request.POST.get('region'))
            if location != None:
                location.region = region
                location.save()
                cities = cities.filter(region=location.region)
            else:
                new_location = Location()
                new_location.region = region
                new_location.city = City.objects.get(name="Madrid")
                new_location.user = request.user
                new_location.save()
                cities = cities.filter(region=new_location.region)
    regions = Region.objects.all()
    context.update({'region_form': RegionForm(), 'regions': regions, 'location': location, 'cities': cities})
    return render(request, 'location.html', context)


@login_required
def city(request):
    context = {}
    cities = City.objects.all()
    location = None
    location_objects = Location.objects.filter(user=request.user)
    if len(location_objects) > 0:
        location = location_objects[0]
    if request.method == 'POST':
        city_form = CityForm(request.POST)
        if city_form.is_valid():
            city = City.objects.get(name=request.POST.get('city'))
            if location != None:
                location.city = city
                location.save()
                cities = cities.filter(region=location.region)
            else:
                new_location = Location()
                new_location.city = city
                new_location.region = Region.objects.get(name="Comunidad de Madrid")
                new_location.user = request.user
                new_location.save()
                cities = cities.filter(region=new_location.region)
    regions = Region.objects.all()
    context.update({'region_form': RegionForm(), 'regions': regions, 'location': location, 'cities': cities})
    return render(request, 'location.html', context)


@login_required
def location(request):
    location = None
    location_objects = Location.objects.filter(user=request.user)
    cities = City.objects.all()
    if len(location_objects) > 0:
        location = location_objects[0]
        cities = cities.filter(region=location.region)
    regions = Region.objects.all()
    context = {'location': location, 'region_form': RegionForm(), 'regions': regions, 'cities': cities}
    return render(request, 'location.html', context)


@login_required
def lawtier(request):
    tier = None
    tier_objects = Tier.objects.filter(user=request.user)
    if len(tier_objects) > 0:
        tier = tier_objects[0]
    if request.method == 'POST':
        tier_form = TierForm(request.POST)
        if tier_form.is_valid():
            posted_tier = request.POST.get('tier')
            if tier != None:
                tier.tier = posted_tier
                tier.user = request.user
                tier.save()
            else:
                new_tier = Tier()
                new_tier.tier = posted_tier
                new_tier.user = request.user
                new_tier.save()
    context = {'tier_form': TierForm(), 'tier': tier}
    return render(request, 'lawtier.html', context)


def dataprotection(request):
    return render(request, 'dataprotection.html')


def cookies(request):
    return render(request, 'cookies.html')
