from django.db import models
from django.contrib.auth.models import User

class Poll(models.Model):
    headline = models.CharField(max_length=100)
    short_description = models.CharField(max_length=500)
    long_description = models.TextField()
    link = models.CharField(max_length=500)
    pub_date = models.DateTimeField('date published')
    vote_date = models.DateTimeField('date voted')
    votes_positive = models.IntegerField(default=0)
    votes_negative = models.IntegerField(default=0)

    def get_absolute_url(self):
        return "/referendum/%i/" % self.id

    def __unicode__(self):
        return self.headline

class Vote(models.Model):
    referendum = models.ForeignKey('Poll')
    userid = models.IntegerField(default=0)
    vote = models.BooleanField()

class Comment(models.Model):
    referendum = models.ForeignKey('Poll')
    user = models.ForeignKey(User)
    comment = models.TextField()
