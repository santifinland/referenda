# -*- coding: utf-8 -*-

# Send Proyecto de Ley to Referenda backend

from datetime import datetime
from typing import List
import json
import re

import requests

from law import Law


def main():
    """ main script """

    # Current laws
    current_laws: List[Law] = Law.get_laws()
    # Parse Laws
    print("Start law send")
    laws = parse_laws()
    headers = {"Content-Type": "application/json",
               "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbnRpIiwiX2lkIjoiNjI1ZDcwOWE4NDlhMGU2ZWEwMTBhM2VjIiwiYWRtaW4iOnRydWUsImlhdCI6MTY1MzkxNTY3NywiZXhwIjoxNjUzOTM3Mjc3fQ.d2NrZX8Qqma9zqtQEHoRmP2jm5JjJRiNYxNnQO7FPT8"}
    # Send laws to referenda
    for l in laws:
        if not Law.is_in_db(current_laws, l):
            print("{}: {} from {}".format(l.law_id, l.headline, l.institution))
            r = requests.post('https://referenda.es:3443/api/laws', headers=headers, data=l.toJSON(), verify=False)
            print(r)
        break


def parse_laws():
    # Open proyectos de ley file
    f = open("/tmp/proyecto_de_ley.json", "r")
    laws_document = json.load(f)
    laws = []
    for law_document in laws_document:
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
    filtered_laws = list(filter(lambda x: x.vote_start > datetime(2021, 12, 12), laws))
    filtered_laws = list(filter(lambda x: x.vote_start < datetime(2023, 6, 1), filtered_laws))
    filtered_laws = sorted(filtered_laws, key=lambda l: l.vote_start)
    print('Total laws: {}'.format(len(filtered_laws)))
    filtered_laws.sort(key=lambda x: x.law_id, reverse=True)
    return filtered_laws


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print('Failed to execute. Exception: {}'.format(e))
