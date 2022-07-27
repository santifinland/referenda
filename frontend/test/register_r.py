# Referenda

from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains


def test_register_referenda():
    driver = webdriver.Chrome()

    driver.get("https://referenda.es")
    action_chains = ActionChains(driver)

    session = driver.find_element(value="session")
    driver.implicitly_wait(2)
    action_chains.move_to_element(session).perform()

    register_link = driver.find_element(value="register")
    driver.implicitly_wait(2)
    register_link.click()
    driver.implicitly_wait(2)

    title = driver.title
    assert title == "Regístrate en Referenda y empieza a votar", "No matching title"
    driver.implicitly_wait(2)

    username = driver.find_element(value="username")
    username.send_keys("testreferenda")
    driver.implicitly_wait(10)
    email = driver.find_element(value="email")
    email.send_keys("test@referenda.es")
    driver.implicitly_wait(10)
    password = driver.find_element(value="pass")
    password.send_keys("")
    driver.implicitly_wait(10)
    register = driver.find_element(value="register")
    driver.implicitly_wait(10)
    register.click()
    driver.implicitly_wait(10)

    register_username = driver.find_element(value="complete-username")
    register_username.send_keys("referenda")
    driver.implicitly_wait(10)
    gdpr = driver.find_element(value="complete-gdpr")
    gdpr.click()
    driver.implicitly_wait(10)
    register_button = driver.find_element(value="complete-register")
    driver.implicitly_wait(10)
    register_button.click()
    driver.implicitly_wait(10)

    username = driver.find_element(value="username")
    driver.implicitly_wait(10)
    driver.implicitly_wait(10)
    assert username.text == "referenda", "Not showing the username"

    driver.quit()


if __name__ == "__main__":
    try:
        test_register_referenda()
    except Exception as e:
        print('Failed to execute. Exception: {}'.format(e))
