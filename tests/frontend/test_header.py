# Referenda

import pytest
from selenium import webdriver


def test_header():
    driver = webdriver.Chrome()

    driver.get("https://referenda.es")

    title = driver.title
    assert title == "Referenda - Democracia directa", "No matching title"

    driver.quit()


if __name__ == "__main__":
    try:
        test_header()
    except Exception as e:
        print('Failed to execute. Exception: {}'.format(e))
