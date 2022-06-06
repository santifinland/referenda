# -*- coding: utf-8 -*-

from datetime import datetime
from typing import Dict, List
import json

import re
import requests


class Law(object):

    def __init__(self, law_id, law_type, institution, tier, featured, headline, long_description, link, vote_start):
        self.law_id = law_id
        self.law_type = law_type
        self.institution = self.clean_institution(institution)
        self.tier = tier
        self.area = 'economia'
        self.featured = False if featured == 'False' else True
        self.headline = headline.partition('.')[0]
        long_description = (long_description[0] if long_description is not None and len(long_description) > 0
                            else "No disponible")

        pattern_to_remove_i: str = r'^.*n de motivos'
        pattern_to_remove_ii: str = r'<.div>'
        pattern_to_remove_iii: str = r'<p.*p>'
        pattern_to_remove_iv: str = r'<br><br><br><br><br><br>'
        pattern_to_remove_v: str = r'<br><br><br>'
        pattern_to_remove_vi: str = r'<br>'
        pattern_to_remove_vii: str = r'doble_retorno_de_carro'
        pattern_to_remove_viii: str = r'simple_retorno_de_carro'
        i = re.sub(pattern_to_remove_i, '', long_description)
        ii = re.sub(pattern_to_remove_ii, '', i)
        iii = re.sub(pattern_to_remove_iii, '', ii)
        iv = re.sub(pattern_to_remove_iv, 'doble_retorno_de_carro', iii)
        v = re.sub(pattern_to_remove_v, 'simple_retorno_de_carro ', iv)
        vi = re.sub(pattern_to_remove_vi, ' ', v)
        vii = re.sub(pattern_to_remove_vii, '<br><br>', vi)
        viii = re.sub(pattern_to_remove_viii, '<br><br>', vii)
        long_description_replaced = viii
        self.long_description = long_description_replaced
        self.link = link
        #self.vote_start = datetime.strptime(vote_start.strip(), '%d/%m/%Y')
        self.vote_start = vote_start
        self.pub_date = self.vote_start
        self.vote_end = datetime(2030, 1, 1, 0, 0, 0)
        self.official_positive = 0
        self.official_negative = 0
        self.official_abstention = 0
        self.reviewed = False

    def __str__(self):
        return '{} - {} - {}: institution: {}. Long des: {}'\
            .format(self.vote_start, self.law_id, self.headline[0:220], self.institution, len(self.long_description))

    @staticmethod
    def datetime_option(value):
        if isinstance(value, datetime):
            return value.strftime('%Y-%m-%dT00:00:00Z')
        else:
            return value.__dict__

    def toJSON(self):
        return json.dumps(self, default=self.datetime_option)

    @staticmethod
    def from_JSON(law: Dict):
        parsed_law = Law(
            law.get('law_id', None),
            law.get('law_type'),
            law.get('institution'),
            law.get('tier'),
            law.get('featured'),
            law.get('headline'),
            law.get('long_description'),
            law.get('link'),
            datetime.fromisoformat(law.get('vote_start')[:-1]))  # Removing last Z
        return parsed_law

    def clean_institution(self, institution):
        print("Cleaning institution: {}".format(institution))
        institution = [x.lower() for x in institution if x is not None]
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

    @staticmethod
    def get_laws() -> List[str]:
        print("Getting current laws")
        r = requests.get('https://referenda.es/api/laws?all=true')
        r.encoding = "utf-8"
        print(r.status_code)
        return [x["law_id"] for x in r.json() if "law_id" in x.keys()] if r.status_code == 200 else []
