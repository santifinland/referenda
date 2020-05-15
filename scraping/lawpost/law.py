# -*- coding: utf-8 -*-

from datetime import datetime


class Law(object):

    def __init__(self, law_type, institution, tier, featured, headline, long_description, link, pub_date, vote_start):
        self.law_type = law_type
        self.institution = institution
        self.tier = tier
        self.featured = featured
        self.headline = headline
        self.long_description = long_description
        self.link = link
        self.pub_date = pub_date
        self.vote_start = datetime.strptime(vote_start, '%d/%m/%Y')

    def __str__(self):
        return '{} - {}: institution: {}'.format(self.vote_start, self.headline[0:120], self.institution)
