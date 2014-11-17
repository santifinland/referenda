from django.db import models
from django.contrib.auth.models import User

class Poll(models.Model):
    headline = models.CharField(max_length=100)
    short_description = models.CharField(max_length=500)
    long_description = models.TextField()
    link = models.CharField(max_length=500)
    pub_date = models.DateTimeField('date published')
    vote_date_start = models.DateTimeField('date vote start')
    vote_date_end = models.DateTimeField('date vote end')
    votes_positive = models.IntegerField(default=0)
    votes_negative = models.IntegerField(default=0)
    votes_abstention = models.IntegerField(default=0)
    result_positive = models.IntegerField(default=0)
    result_negative = models.IntegerField(default=0)
    result_abstention = models.IntegerField(default=0)

    def get_absolute_url(self):
        return "/referendum/%i/" % self.id

    def __unicode__(self):
        return self.headline


class Vote(models.Model):
    referendum = models.ForeignKey('Poll')
    userid = models.IntegerField(default=0)
    VOTE_CHOICES = (('YES', 'Yes'), ('NO','No'), ('ABS', 'Abs'),)
    vote = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')


class Comment(models.Model):
    referendum = models.ForeignKey('Poll')
    user = models.ForeignKey(User)
    comment = models.TextField()
