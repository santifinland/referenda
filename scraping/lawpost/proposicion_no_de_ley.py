# -*- coding: utf-8 -*-

# Send Proyecto de Ley to Referenda backend

import json
import sys
import requests
from datetime import datetime

from law import Law


def main():
    """ main script """

    # Parse Laws
    print("Start law send")
    laws = parse_laws()
    headers = {"Content-Type": "application/json",
               "x-access-token": ""}
    # Send laws to referenda
    for l in laws:
        print(l)
        print(len(l.toJSON()))
        #r = requests.post('https://referenda.es:3443/api/laws', headers=headers, data=l.toJSON(), verify=False)
        #print(r)


def parse_laws():
    # Open proyectos de ley file
    f = open("proposicion_no_de_ley.json", "r")
    laws_document = json.load(f)
    laws = []
    for law_document in laws_document:
        law = Law(
            law_document.get('law_type'),
            law_document.get('institution'),
            law_document.get('tier'),
            law_document.get('featured'),
            law_document.get('headline'),
            law_document.get('long_description'),
            law_document.get('link'),
            law_document.get('vote_start'))
        laws.append(law)
    laws.sort(key=lambda x: x.vote_start, reverse=True)
    filtered_laws = list(filter(lambda x: x.vote_start < datetime(2020, 1, 25), laws))
    filtered_laws = list(filter(lambda x: x.vote_start > datetime(2020, 1, 19), filtered_laws))
    print('Total laws: {}'.format(len(laws)))
    return filtered_laws


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print('Failed to execute. Exception: {}'.format(e))
