# -*- coding: utf-8 -*-

import json
import re
from datetime import datetime


class Law(object):

    def __init__(self, law_type, institution, tier, featured, headline, long_description, link, vote_start):
        self.law_type = law_type
        self.institution = self.clean_institution(institution)
        self.tier = tier
        self.featured = False if featured == 'False' else True
        self.headline = headline.partition('.')[0]
        long_description = long_description[0] if len(long_description) > 0 else "No disponible"
        long_description_replaced = (long_description
                                     .replace('\n\n', 'carrier-return')
                                     .replace('\n', '')
                                     .replace('<br>', '')
                                     .replace('', '')
                                     .replace('carrier-return', '\n\n'))
        long_description_no_page = re.sub('<p style=\"text-align:center\"><a name=\".*\"><b>P.*</b></a></p>', '',
                                          long_description_replaced)
        self.long_description = long_description_no_page[0:min(90000, len(long_description_no_page))]
        self.link = link
        self.vote_start = datetime.strptime(vote_start, '%d/%m/%Y')
        self.pub_date = self.vote_start
        self.vote_end = datetime(2030, 1, 1, 0, 0, 0)
        self.official_positive = 0
        self.official_negative = 0
        self.official_abstention = 0

    def __str__(self):
        return '{} - {}: institution: {}. Long des: {}'\
            .format(self.vote_start, self.headline[0:220], self.institution, len(self.long_description))

    @staticmethod
    def datetime_option(value):
        if isinstance(value, datetime):
            return value.strftime('%Y-%m-%dT00:00:00Z')
        else:
            return value.__dict__

    def toJSON(self):
        return json.dumps(self, default=self.datetime_option)

    def clean_institution(self, institution):
        institution = institution.lower()
        if "socialista" in institution:
            return "psoe"
        if "popular" in institution:
            return "pp"
        if "vox" in institution:
            return "vox"
        if "unidas" in institution:
            return "podemos"
        if "ciudadanos" in institution:
            return "ciudadanos"
        if "republicano" in institution:
            return "erc"
        else:
            return institution
