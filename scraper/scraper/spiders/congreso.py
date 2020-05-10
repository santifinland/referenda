import scrapy


class QuotesSpider(scrapy.Spider):
    name = "congreso"

    start_urls = ['http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas/Indice%20de%20Iniciativas']

    def parse(self, response):

        # Main Congreso iniciativas list
        print(response)

        # Main proyectos de ley site
        pdl_links = response.xpath("//a[contains(text(),'Proyecto de ley.')]").attrib['href']
        print(pdl_links)

        # List of proyectos de ley urls
        yield scrapy.Request(url=response.urljoin(pdl_links), callback=self.parse_link)

    def parse_link(self, response):
        print("ttt")
        i = 2
        all_pdl = True
        while all_pdl:
            pdl = response.xpath("//div[{}]//div[1]//div[1]//div[1]//p[1]//a[1]".format(i)).attrib['href']
            if pdl is not None:
                yield scrapy.Request(url=response.urljoin(pdl), callback=self.parse_pdl)
                i = i + 1
            else:
                all_pdl = False

    def parse_pdl(self, response):
        print("pdl")
        yield {
            'headline': response.xpath("//p[@class='titulo_iniciativa']").get(),
            'institution': response.xpath("//table//table//table//table//table[@class='RegionNoBorder']//p[4]").get(),
            'link': response
        }
