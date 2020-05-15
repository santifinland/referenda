# -*- coding: utf-8 -*-

import logging
import scrapy


class QuotesSpider(scrapy.Spider):
    name = "proyecto_de_ley"

    start_urls = ['http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas/Indice%20de%20Iniciativas']

    def parse(self, response):

        # Main proyectos de ley site
        pdl_links = response.xpath("//a[contains(text(),'Proyecto de ley.')]").attrib['href']

        # List of proyectos de ley urls
        yield scrapy.Request(url=response.urljoin(pdl_links), callback=self.parse_link)

    def parse_link(self, response):
        i = 1
        all_pdl = True
        while all_pdl:
            pdl = response.xpath("//div[{}]//div[1]//div[1]//div[1]//p[1]//a[1]".format(i)).attrib['href']
            if pdl is not None:
                yield scrapy.Request(url=response.urljoin(pdl), callback=self.parse_pdl)
                i = i + 1
            else:
                all_pdl = False

    def parse_pdl(self, response):
        logging.info('----------------------------------------------------')
        headline = response.xpath("//p[@class='titulo_iniciativa']/text()").get(),
        logging.info('Proyecto de Ley: {}'.format(headline))
        vote_start = response.xpath("//p[contains(text(),'Presentado')]/text()").get()
        logging.info('Vote Start: {}'.format(vote_start))
        law = dict(
            headline=headline,
            institution=response.xpath("//table//table//table//table//table[@class='RegionNoBorder']//p[4]/text()").get(),
            link=response.url,
            vote_start=vote_start[0:25][-11: -1] if vote_start is not None else '01/01/2030'
        )
        long_description_link = response.xpath("//div[@class='ficha_iniciativa']/p[@class='texto'][9]/a").attrib['href']
        #print(long_description_link)
        yield scrapy.Request(url=response.urljoin(long_description_link), callback=self.parse_long_desc, cb_kwargs=law)

    def parse_long_desc(self, response, headline, institution, link, vote_start):
        yield {
            'law_type': 'Proyecto de Ley',
            'institution': institution,
            'tier': 1,
            'featured': 'False',
            'headline': headline,
            'link': link,
            'pub_date': '2030-01-01T00:00:00Z',
            'vote_start': vote_start,
            'long_description': response.xpath("//div[@class='texto_completo']").getall()
        }
