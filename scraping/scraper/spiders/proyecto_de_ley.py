# -*- coding: utf-8 -*-

from typing import List
import logging
import json
import re

from scrapy.http import FormRequest
from scrapy.utils.response import open_in_browser
import scrapy


class PDLSpider(scrapy.Spider):
    name = "proyecto_de_ley"

    start_urls = ['https://www.congreso.es/proyectos-de-ley']

    def parse(self, response, **kwargs):

        return [FormRequest(
            url="https://www.congreso.es/proyectos-de-ley?p_p_id=iniciativas&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=filtrarListado&p_p_cacheability=cacheLevelPage&_iniciativas_legislatura=14&_iniciativas_cini=121.CINI.&_iniciativas_tipoLlamada=T&_iniciativas_paginaActual=1",
            callback=self.parse_link)]
        # Main proyectos de ley site
        #pdl_links = response.xpath("//a[contains(text(),'Proyecto de Ley')]").attrib['href']

        # List of proyectos de ley urls
        #yield scrapy.Request(url=response.urljoin(pdl_links), callback=self.parse_link)

    def parse_link(self, response):
        iniciativas = json.loads(response.text).get('lista_iniciativas')
        ids: List[(str, str)] = [v.get('id_iniciativa').split('/') for k, v in iniciativas.items()]
        base_url = ('https://www.congreso.es/proyectos-de-ley?' +
                    'p_p_id=iniciativas&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&' +
                    '_iniciativas_mode=mostrarDetalle&_iniciativas_legislatura=XIV&_iniciativas_id=')
        for law_id in ids:
            law = dict(law_id=law_id[0] + '/' + law_id[1])
            yield scrapy.Request(url=base_url + law_id[0] + '%2F' + law_id[1], callback=self.parse_pdl, cb_kwargs=law)

    def parse_pdl(self, response, law_id):
        logging.info('----------------------------------------------------')
        headline: str = response.xpath("//div[@class='entradilla-iniciativa']/text()").get()
        logging.info('Proyecto de Ley: {}'.format(headline))
        institution = [response.xpath("//div[@class='cuerpo-iniciativa-det iniciativa']/ul[1]/li/text()").get()]
        presented: str = response.xpath("//div[@class='f-present']/text()").get()
        vote_start: str = presented[15:26]
        logging.info('Vote Start: {}'.format(vote_start))
        law = dict(
            law_id=law_id,
            headline=headline,
            institution=institution,
            link=response.url,
            vote_start=vote_start if vote_start is not None else '01/01/2030'
        )
        long_description_link = response.xpath("//ul[@class='boletines']/li/div[2]/a[1]").attrib['href']
        #print(long_description_link)
        yield scrapy.Request(url=response.urljoin(long_description_link), callback=self.parse_long_desc, cb_kwargs=law)

    def parse_long_desc(self, response, law_id, headline, institution, link, vote_start):
        yield {
            'law_type': 'Proyecto de Ley',
            'institution': institution,
            'tier': 1,
            'featured': 'False',
            'law_id': law_id,
            'headline': headline,
            'link': link,
            'vote_start': vote_start,
            'long_description': [self.refine_long_description(x) for x in
                                 response.xpath("//div[@class='textoIntegro publicaciones']").getall()]
        }

    def refine_long_description(self, long_description: str) -> str:
        pattern_to_remove_i: str = r'.p style=.text-align.center...a name=..P.C3.A1gina.....b.P.gina ...b...a...p.'
        pattern_to_remove_ii: str = r'.p style=.text-align.center...a name=..P.C3.A1gina......b.P.gina ....b...a...p.'
        pattern_to_remove_iii = r'.p style=.text-align.center...a name=..P.C3.A1gina.......b.P.gina .....b...a...p.'
        i = re.sub(pattern_to_remove_i, '', long_description)
        ii = re.sub(pattern_to_remove_ii, '', i)
        iii = re.sub(pattern_to_remove_iii, '', ii)
        long_description_replaced = iii
                                     #.replace('\n\n', 'carrier-return')
                                     #.replace('\n', '')
                                     #.replace('<br><br><br>', 'carrier-return')
                                     #.replace('<br>', ' ')
                                     #.replace('carrier-return', '<br><br><br>'))
                                     #.replace('', '')
                                     #.replace('carrier-return', '\n\n'))
        return self.string_cleaner(long_description_replaced)

    @staticmethod
    def string_cleaner(rouge_text):
        return ("".join(rouge_text.strip()).encode('iso8859-1', 'ignore').decode("iso8859-1").encode("utf-8").decode("utf-8"))
