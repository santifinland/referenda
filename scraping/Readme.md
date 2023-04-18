# Proyecto de Ley
cd referenda/scraping

scrapy runspider scraper/spiders/proyecto_de_ley.py -o /tmp/proyecto_de_ley.json -t json

cd referenda/scraping/lawpost

python proyecto_de_ley.py

# Decreto Ley
cd referenda/scraping

scrapy runspider scraper/spiders/decreto_ley.py -o /tmp/decreto_ley.json -t json