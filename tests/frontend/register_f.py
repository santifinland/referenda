# Referenda

from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By

import time


def test_register():
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

    parent_window = driver.window_handles[0]

    facebook = driver.find_element(value="facebook")
    driver.implicitly_wait(10)
    facebook.click()
    driver.implicitly_wait(10)

    child_window = [x for x in driver.window_handles if x != parent_window][0]
    driver.switch_to.window(child_window)
    title = driver.title
    print(title)
    driver.implicitly_wait(10)
    assert title == "Facebook", "No matching title for child window"

    cookies = driver.find_element(by=By.XPATH, value="//button[contains(string(), 'Only allow essential cookies')]")
    #cookies = driver.find_element(by=By.XPATH, value="//button[contains(string(), 'Permitir solo cookies necesarias')]")
    cookies.click()
    driver.implicitly_wait(10)

    email = driver.find_element(value="email")
    email.send_keys("jatljptpqh_1655890132@tfbnw.net")
    driver.implicitly_wait(10)
    password = driver.find_element(value="pass")
    driver.implicitly_wait(10)
    password.send_keys("r3f3r3nd4")
    create_account = driver.find_element(by=By.NAME, value="login")
    driver.implicitly_wait(10)
    create_account.click()

    driver.switch_to.window(parent_window)
    #cookies_reg = driver.find_element(by=By.XPATH, value="//button[contains(string(), 'Continur como Samantha')]")
    #driver.implicitly_wait(10)
    #cookies_reg.click()

    time.sleep(10)

    driver.implicitly_wait(10)
    register_username = driver.find_element(value="complete-username")
    register_username.send_keys("referenda")
    driver.implicitly_wait(10)
    gdpr = driver.find_element(value="complete-gdpr")
    gdpr.click()
    driver.implicitly_wait(10)
    register_button = driver.find_element(value="complete-register")
    time.sleep(10)
    driver.implicitly_wait(10)
    register_button.click()
    driver.implicitly_wait(10)

    time.sleep(5)

    username = driver.find_element(value="username")
    driver.implicitly_wait(10)
    assert username.text == "referenda", "Not showing the username"

    driver.quit()


if __name__ == "__main__":
    try:
        test_register()
    except Exception as e:
        print('Failed to execute. Exception: {}'.format(e))
