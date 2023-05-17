# Referenda

from selenium import webdriver


def test_cookies():
    driver = webdriver.Chrome()

    driver.get("https://referenda.es")

    cookies = driver.get_cookies()
    print(cookies)
    assert len(cookies) == 2, "Not the 2 desired cookies"

    assert {'domain': 'referenda.es',
            'httpOnly': False,
            'name': 'referendaLanding',
            'path': '/',
            'sameSite': 'Lax',
            'secure': False,
            'value': '1'} in cookies, "No Referenda landing cookie"

    driver.quit()


if __name__ == "__main__":
    try:
        test_cookies()
    except Exception as e:
        print('Failed to execute. Exception: {}'.format(e))
