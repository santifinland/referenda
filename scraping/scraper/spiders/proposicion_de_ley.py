# -*- coding: utf-8 -*-

import logging
import scrapy


class QuotesSpider(scrapy.Spider):
    name = "proposicion_de_ley"

    start_urls = ['http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas/Indice%20de%20Iniciativas']

    def parse(self, response):

        # Main proyectos de ley site
        pdl_links = response.xpath("//a[contains(text(),'Proposición de ley de Grupos Parlamentarios del Congreso.')]").attrib['href']

        # List of proyectos de ley urls
        yield scrapy.Request(url=response.urljoin(pdl_links), callback=self.parse_link)

    def parse_link(self, response):
        i = 1
        all_pdl = True

        print("NEXTTTT")
        next = response.xpath("//div[@class='paginacion_brs']/a[3]").attrib['href']
        logging.info("NEXT")
        logging.info(next)
        if next is not None:
            yield scrapy.Request(url=response.urljoin(next), callback=self.parse_link)

        while all_pdl:
            pdl = response.xpath("//div[{}]//div[1]//div[1]//div[1]//p[1]//a[1]".format(i)).attrib['href']
            if pdl is not None:
                yield scrapy.Request(url=response.urljoin(pdl), callback=self.parse_pdl)
                i = i + 1
            else:
                all_pdl = False


    def parse_pdl(self, response):
        logging.info('----------------------------------------------------')
        headline = response.xpath("//p[@class='titulo_iniciativa']/text()").get()
        logging.info('Proposicion de Ley: {}'.format(headline))
        vote_start = response.xpath("//p[contains(text(),'Presentado')]/text()").get()
        logging.info('Vote Start: {}'.format(vote_start))
        law = dict(
            headline=headline,
            #institution=response.xpath("//table//table//table//table//table[@class='RegionNoBorder']//p[4]/text()").get(),
            #institution=response.xpath("//p[@class='texto']//a//b").get(),
            institution=response.xpath("//p[4]//a[1]//b[1]").get(),
            link=response.url,
            vote_start=vote_start[0:25][-11: -1] if vote_start is not None else '01/01/2030'
        )
        #long_description_link = response.xpath("//div[@class='ficha_iniciativa']/p[@class='texto'][9]/a").attrib['href']
        long_description_link = response.xpath("(//p/a/b[contains(text(),'texto íntegro')]/..)")[0].attrib['href']
        #print(long_description_link)
        yield scrapy.Request(url=response.urljoin(long_description_link), callback=self.parse_long_desc, cb_kwargs=law)

    def parse_long_desc(self, response, headline, institution, link, vote_start):
        yield {
            'law_type': 'Proposición de Ley',
            'institution': institution,
            'tier': 1,
            'featured': 'False',
            'headline': headline,
            'link': link,
            'vote_start': vote_start,
            'long_description': response.xpath("//div[@class='texto_completo']").getall()
        }
