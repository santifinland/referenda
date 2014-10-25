from django.core.context_processors import request
from django.http import HttpResponse
from django.shortcuts import render, render_to_response
from django.shortcuts import get_object_or_404
from django import forms
from django.contrib.auth.models import User
from forms import CommentForm

from django.template import Context, Template
from models import Poll, Vote, Comment
from forms import VoteForm
from datetime import datetime

def home(request):
    print "kkkkk"
    poll_list = Poll.objects.order_by('vote_date_end')[:5]
    voteform = VoteForm()
    voteform.fields['vote'].widget = forms.HiddenInput()
    now = datetime.now()
    context = {'poll_list': poll_list, 'voteform': voteform, 'now': now}
    return render(request, 'home.html', context)

def profile(request):
    return render(request, 'profile.html')

def vote(request, poll_id):
    p = get_object_or_404(Poll, pk=poll_id)
    poll_list = Poll.objects.order_by('vote_date_end')[:5]
    context = {'poll_list': poll_list}
    try:
        voteform = VoteForm(request.POST)
        if voteform.is_valid() and p.vote_date_start < datetime.now() < p.vote_date_end:
            print "Form valid"
            #user_votes = Vote.objects.filter(referendum=p)
            user_votes = Vote.objects.filter(referendum=p).filter(userid=request.user.id)
            print "User votes"
            print len(user_votes)
            if len(user_votes) > 0:
                print "ya has votado"
            else: 
                user = request.user.id
                print "User"
                print user
                if voteform.data['vote'] == 'Yes':
                    p.votes_positive = p.votes_positive + 1
                elif voteform.data['vote'] == 'No':
                    p.votes_negative = p.votes_negative + 1
                else:
                    p.votes_abstention = p.votes_abstention + 1
                p.save()
                vote = Vote()
                print "Vote"
                print vote.id
                vote.referendum = p
                vote.userid = user
                vote.save()
                print vote.id
        else:
            user_vote = voteform.errors
    except Exception as e:
        print e
        return render(request, 'home.html', context)
    else:
        return render(request, 'home.html', context)

def vote_referendum(request, poll_id):
    try:
        p = Poll.objects.get(pk=poll_id)
    except:
        raise Http404
    return redirect(p)

def referendum(request, poll_id):
    try:
        referendum = Poll.objects.get(pk=poll_id)
        context = {'referendum': referendum}
        comments = Comment.objects.filter(referendum_id = poll_id)
        if comments != None:
            context.update({'comments': comments})
        comment_form = CommentForm(data=request.POST)
        context.update({'comment_form': comment_form})
    except Exception as e:
        print e
        raise Http404
    return render(request, 'referendum.html', context)

def comment(request, poll_id):
    try:
        referendum = Poll.objects.get(pk=poll_id)
        context = {'referendum': referendum}
        comments = Comment.objects.filter(referendum_id = poll_id)
        if comments != None:
            context.update({'comments': comments})
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            print "Form valid"
            user = request.user
            print "User"
            print user
            comment = Comment()
            comment.referendum = referendum
            comment.user = user
            comment.comment = comment_form.data['comment']
            print comment.comment
            comment.save()
        else:
            print "mal"
        comment_form = CommentForm()
        context.update({'comment_form': comment_form})
    except Exception as e:
        print e
        raise Http404
    else:
        return render(request, 'referendum.html', context)
