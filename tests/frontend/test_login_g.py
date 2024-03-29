# Referenda

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait


def test_login():
    chrome_options = Options()
    chrome_options.add_argument("--lang=es")
    chrome_options.add_argument("--disable-web-security=true")
    chrome_options.add_argument("--user-data-dir=true")
    chrome_options.add_argument("--allow-running-insecure-content")
    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(2)

    driver.get("https://referenda.es")
    action_chains = ActionChains(driver)

    session = driver.find_element(value="session")
    driver.implicitly_wait(2)
    action_chains.move_to_element(session).perform()

    login_link = driver.find_element(value="login")
    driver.implicitly_wait(2)
    login_link.click()
    driver.implicitly_wait(2)

    title = driver.title
    assert title == "Inicia sesión en Referenda", "No matching title"
    driver.implicitly_wait(2)

    parent_window = driver.window_handles[0]

    google = driver.find_element(value="google")
    driver.implicitly_wait(10)
    google.click()
    driver.implicitly_wait(10)

    child_window = [x for x in driver.window_handles if x != parent_window][0]
    driver.switch_to.window(child_window)
    driver.implicitly_wait(10)
    title = driver.title
    driver.implicitly_wait(10)
    WebDriverWait(driver, 10).until(lambda x: 'Sign in - Google Accounts' in driver.title)
    assert title == "Sign in - Google Accounts", "No matching title for child window"

    email = driver.find_element(value="identifierId")
    email.send_keys("referenda.es@gmail.com")
    driver.implicitly_wait(10)
    identifier_next = driver.find_element(value="identifierNext")
    identifier_next.click()
    driver.implicitly_wait(10)
    password = driver.find_element(by=By.NAME, value="password")
    driver.implicitly_wait(30)
    password.send_keys("")
    password_next = driver.find_element(value="passwordNext")
    driver.implicitly_wait(30)
    password_next.click()
    driver.implicitly_wait(30)

    driver.switch_to.window(parent_window)
    username = driver.find_element(value="username")
    driver.implicitly_wait(100)
    assert username.text == "referenda", "Not showing the username"

    driver.quit()


if __name__ == "__main__":
    try:
        test_login()
    except Exception as e:
        print('Failed to execute. Exception: {}'.format(e))
