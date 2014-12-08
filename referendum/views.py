from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from forms import CommentForm, DelegateVoteForm, DeleteAccountForm, VoteForm
from models import Comment, DelegatedVote, Partie, Poll, Vote


def home(request):
    poll_list = Poll.objects.order_by('vote_date_end')
    current_polls = [ r for r in poll_list if r.vote_date_end > timezone.now()]
    voteform = VoteForm()
    voteform.fields['vote'].widget = forms.HiddenInput()
    now = timezone.now()
    context = {'poll_list': current_polls, 'voteform': voteform, 'now': now}
    return render(request, 'home.html', context)


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


def results(request):
    poll_list = Poll.objects.order_by('vote_date_end')
    finished_polls = [ r for r in poll_list if r.vote_date_end < timezone.now()]
    context = {'poll_list': finished_polls}
    return render(request, 'results.html', context)


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


def cookies(request):
    return render(request, 'cookies.html')
