# -*- coding: utf-8 -*

import unittest

from scraping.scraper.spiders.proyecto_de_ley import PDLSpider

class ListProcessesTest(unittest.TestCase):

    def test_refine_long_description(self):
        assert PDLSpider().refine_long_description("bar") == "bar"
        long_description = '<p style="text-align:center"><a name="(P%C3%A1gina3)"><b>Página 3</b></a></p>'
        assert PDLSpider().refine_long_description(long_description) == ""
