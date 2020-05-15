# -*- coding: utf-8 -*-

# Send Proyecto de Ley to Referenda backend

import json

from law import Law


def main():
    """ main script """

    # Get arguments
    print("Start law send")

    # Open proyectos de ley file
    f = open("proyecto_de_ley.json", "r")
    laws_document = json.load(f)
    laws = []
    for law_document in laws_document:
        law = Law(
            law_document.get('law_type'),
            law_document.get('institution'),
            law_document.get('tier'),
            law_document.get('featured'),
            law_document.get('headline')[0],
            law_document.get('long_description'),
            law_document.get('link'),
            law_document.get('pub_date'),
            law_document.get('vote_start'))
        laws.append(law)
    laws.sort(key=lambda x: x.vote_start, reverse=True)
    for l in laws:
        print(l)
    print('Total laws: {}'.format(len(laws)))


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print('Failed to execute. Exception: {}'.format(e))
