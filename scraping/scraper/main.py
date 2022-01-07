from scrapy import cmdline
command = "scrapy runspider --output=kk:json spiders/proyecto_de_ley.py"
cmdline.execute(command.split())
