# -*- coding: utf-8 -*-

# Send Proyecto de Ley to Referenda backend

from datetime import datetime
from typing import List
import json

import requests

from law import Law


class LawPost:

    def __init__(self, raw_laws: str):
        self.raw_laws: str = raw_laws

    def run(self):
        """Post Congress scraped laws to Referenda API

        The scrapped laws are parsed, and later posted to Referenda API
        """

        # Parse laws
        laws: List[Law] = self.parse_laws(self.raw_laws)

        # Retrieve laws already present in Referenda and filter out those laws from parsed laws
        current_laws_ids: List[str] = Law.get_laws()
        selected_laws: filter = filter(lambda x: x.law_id not in current_laws_ids, laws)

        # Send laws to Referenda API
        headers = {"Content-Type": "application/json",
                   "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNhbnRpIiwiX2lkIjoiNjJiMDFkNGI4NjlmMWJmODkwY2M5ZmYzIiwiYWRtaW4iOnRydWUsImlhdCI6MTY2MzU2ODI3OSwiZXhwIjoxNjYzNTg5ODc5fQ.nnxa3V-uquAp4UEGBE8aZT3l64-yc0pHEmyBw8mwlyI"}
        for law in selected_laws:
            print("{}: {} from {}".format(law.law_id, law.headline, law.institution))
            r = requests.post('https://referenda.es:3443/api/laws', headers=headers, data=law.toJSON(), verify=False)
            print(r)
            break

    @staticmethod
    def parse_laws(raw_laws: str):
        # Open proyectos de ley file
        laws_document = json.loads(raw_laws)
        laws = []
        for law_document in laws_document:
            print("parsing {}".format(law_document.get('headline')))
            law = Law(
                law_document.get('law_id'),
                law_document.get('law_type'),
                law_document.get('institution'),
                law_document.get('tier'),
                law_document.get('featured'),
                law_document.get('headline'),
                law_document.get('long_description'),
                law_document.get('link'),
                datetime.strptime(law_document.get('vote_start').strip(), '%d/%m/%Y'))
            laws.append(law)
        laws.sort(key=lambda x: x.vote_start, reverse=True)
        filtered_laws = list(filter(lambda x: x.vote_start > datetime(2020, 12, 12), laws))
        filtered_laws = list(filter(lambda x: x.vote_start < datetime(2023, 6, 1), filtered_laws))
        filtered_laws = sorted(filtered_laws, key=lambda l: l.vote_start)
        print('Total laws: {}'.format(len(filtered_laws)))
        filtered_laws.sort(key=lambda x: x.law_id, reverse=True)
        return filtered_laws


def main():
    """ main script """

    # Read scraped congress laws and build LawPost instance
    #f = open("/tmp/p1.json", "r")
    #f = open("/tmp/proposicion_de_ley.json", "r")
    f = open("/tmp/proyecto_de_ley.json", "r")
    #f = open("/tmp/proposicion_no_de_ley.json", "r")
    law_post: LawPost = LawPost(f.read())
    f.close()

    # Parse laws and post them to Referenda API
    law_post.run()


if __name__ == "__main__":
    try:
        print("Law delivery script started")
        main()
    except Exception as e:
        print('Failed to execute. Exception: {}'.format(e))
