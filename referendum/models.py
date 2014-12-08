from autoslug.fields import AutoSlugField
from django.db import models
from django.contrib.auth.models import User


VOTE_CHOICES = (('YES', 'Yes'), ('NO','No'), ('ABS', 'Abs'),)

class Poll(models.Model):
    slug = AutoSlugField(populate_from='headline', unique=True)
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
    pp = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    psoe = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    iu = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    ciu = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    upd = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    amaiur = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    pnv = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    erc = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    bng = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    cc = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    compromis = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    gb = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    fa = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')

    def get_absolute_url(self):
        return "/referendum/%s/" % self.slug

    def __unicode__(self):
        return self.headline


class Vote(models.Model):
    referendum = models.ForeignKey('Poll')
    userid = models.IntegerField(default=0)
    vote = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')


class Comment(models.Model):
    referendum = models.ForeignKey('Poll')
    user = models.ForeignKey(User)
    comment = models.TextField()


class Partie(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    logo = models.ImageField(upload_to='logos')
    quota = models.IntegerField(default=0)


class DelegatedVote(models.Model):
    user = models.ForeignKey(User)
    partie = models.ForeignKey('Partie')
